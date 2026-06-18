import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative asset paths so the build works under the GitHub Pages
  // project subpath (e.g. /dakcupac-2026/) as well as at the root.
  base: "./",
  plugins: [react()],
  server: { port: 5173, open: true },
});
