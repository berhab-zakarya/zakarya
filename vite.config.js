import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2020", // no legacy transforms/polyfills for modern browsers
    // React in its own chunk: it rarely changes, so returning visitors keep it cached across deploys.
    rollupOptions: { output: { manualChunks: { react: ["react", "react-dom"] } } },
  },
});
