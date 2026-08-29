import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // SESSION 8: TypeScript reads "paths" to type-check the import; Vite
      // reads this to actually FIND the file when the browser asks. Neither
      // one reads the other's, so the alias has to be written in both places.
      // import.meta.dirname, not __dirname: this file is an ES module, and
      // Vite 8 warns that __dirname is unsupported by its config loader.
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
