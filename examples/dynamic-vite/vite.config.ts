import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { polyfillNode } from "esbuild-plugin-polyfill-node";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), polyfillNode()],
  server: {
    port: 3002,
  },
  define: {
    "process.env": process.env,
  },
});
