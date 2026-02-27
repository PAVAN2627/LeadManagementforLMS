import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks - only check node_modules
          if (id.includes('node_modules')) {
            // React ecosystem - keep together to avoid duplication
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router') || id.includes('scheduler')) {
              return 'react';
            }
            // Animation
            if (id.includes('framer-motion')) {
              return 'framer';
            }
            // Icons
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            // Query
            if (id.includes('@tanstack')) {
              return 'query';
            }
            // Charts
            if (id.includes('recharts') || id.includes('d3-')) {
              return 'charts';
            }
            // Radix UI
            if (id.includes('@radix-ui')) {
              return 'radix';
            }
            // Everything else
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
}));
