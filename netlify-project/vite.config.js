import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Tijdens lokaal ontwikkelen (npm run dev) stuurt dit /api-aanroepen door
      // naar `netlify dev`, zodat de functions ook lokaal werken.
      "/api": "http://localhost:8888",
    },
  },
});
