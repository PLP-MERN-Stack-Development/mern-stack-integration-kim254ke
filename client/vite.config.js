import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  plugins: [react()],
  
  // ==========================================================
  // ✅ FIX: ADDED VITE PROXY CONFIGURATION
  // ==========================================================
  server: {
    proxy: {
      // Forward all requests starting with '/api' to the backend server
      '/api': {
        target: 'http://localhost:5000', // Assuming your Express server runs on port 5000
        changeOrigin: true,
        secure: false, // Set to true if using HTTPS, but usually false for local dev
      },
    },
  },
  
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
});