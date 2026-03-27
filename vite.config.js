import { defineConfig } from "vite";
import foundryVTT from "vite-plugin-fvtt";

export default defineConfig({
  plugins: [foundryVTT()],
  build: {
    lib: { entry: "./src/main.ts" },
    sourcemap: true,
  },
});
