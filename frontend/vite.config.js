import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/guess": "http://localhost:3000",
      "/reset": "http://localhost:3000",
      "/partidas": "http://localhost:3000",
    },
  },
});
