import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5174,
  },
  plugins: [react({ plugins: [["@swc/plugin-styled-components", {}]] })],
  resolve: {
    alias: {
      "@ui": path.resolve(__dirname, "./../../packages/ui"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
