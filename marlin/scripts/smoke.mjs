// Runtime smoke test: actually executes the full React component tree via
// server-side render (no browser, no network). Catches runtime errors that a
// plain `vite build` cannot — broken imports, bad data shapes, render-time
// throws — and asserts the SLDS theme tokens are present in the output.
//
// Runs with only already-installed deps (esbuild + react-dom/server), so it
// works in offline / locked-down environments. Wire-up: `npm test`.

import esbuild from "esbuild";
import { createRequire } from "module";
import { writeFileSync, unlinkSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tmp = path.join(root, ".smoke.cjs");

const entry = `
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import App from "./src/App.jsx";

// Minimal browser-global shims for module-load / initial-render code paths.
globalThis.window = globalThis.window || globalThis;
globalThis.localStorage = globalThis.localStorage || { getItem: () => null, setItem() {}, removeItem() {} };

module.exports = { html: renderToStaticMarkup(React.createElement(App)) };
`;

function fail(msg) {
  console.error("SMOKE FAIL: " + msg);
  if (existsSync(tmp)) unlinkSync(tmp);
  process.exit(1);
}

let html;
try {
  const res = await esbuild.build({
    stdin: { contents: entry, resolveDir: root, loader: "jsx" },
    bundle: true,
    platform: "node",
    format: "cjs",
    jsx: "automatic",
    loader: { ".jsx": "jsx" },
    write: false,
    logLevel: "warning",
  });
  writeFileSync(tmp, res.outputFiles[0].text);
  ({ html } = createRequire(import.meta.url)(tmp));
  unlinkSync(tmp);
} catch (e) {
  fail("app threw during render — " + (e && e.stack ? e.stack : e));
}

if (!html || html.length < 1000) fail("render produced too little markup (" + (html ? html.length : 0) + " bytes)");

// Every primary view label must render.
const views = ["Marlin", "Service Console", "Home", "Owners", "Boats", "Follow-ups", "Work Orders", "Parts", "Deferred Work", "Schedule", "Memberships"];
const missingViews = views.filter((s) => !html.includes(s));
if (missingViews.length) fail("missing view markers: " + missingViews.join(", "));

// SLDS theme contract: navy header, blue accent, teal boating accent.
const tokens = { "navy header (#16325c)": "16325c", "SLDS blue accent (#0176d3)": "0176d3", "marlin brand teal (#3ec6e0)": "3ec6e0" };
const missingTokens = Object.entries(tokens).filter(([, hex]) => !html.includes(hex)).map(([name]) => name);
if (missingTokens.length) fail("missing theme tokens: " + missingTokens.join(", "));

console.log("SMOKE PASS: app rendered " + html.length + " bytes; all views + SLDS theme tokens present.");
