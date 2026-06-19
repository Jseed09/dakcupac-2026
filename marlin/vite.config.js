import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative asset paths so the build works under the GitHub Pages
  // project subpath (e.g. /dakcupac-2026/) as well as at the root.
  base: "./",
  // Inline assets up to 32kB as base64 data URIs so the logo travels inside
  // the JS bundle (keeps the single-file demo self-contained).
  build: { assetsInlineLimit: 32768 },
  plugins: [react()],
  server: { port: 5173, open: true },
});
