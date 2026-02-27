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
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'query-vendor': ['@tanstack/react-query'],
          'chart-vendor': ['recharts'],
          // UI components
          'ui-components': [
            './src/components/ui/button',
            './src/components/ui/card',
            './src/components/ui/input',
            './src/components/ui/label',
            './src/components/ui/dialog',
            './src/components/ui/dropdown-menu',
            './src/components/ui/table',
            './src/components/ui/badge',
            './src/components/ui/avatar',
            './src/components/ui/select',
            './src/components/ui/textarea',
            './src/components/ui/switch',
            './src/components/ui/separator',
            './src/components/ui/toast',
            './src/components/ui/use-toast',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
}));
