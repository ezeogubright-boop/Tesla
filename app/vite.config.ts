import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    inspectAttr(),
    react({
      // Enable faster refresh during development
      fastRefresh: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Improved production build optimization
    target: 'ES2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries for better caching
          'three-vendor': [
            'three',
            '@react-three/fiber',
            '@react-three/drei',
          ],
          // Split UI components
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-scroll-area',
          ],
          // Split animation libraries
          'animation-vendor': [
            'gsap',
          ],
        },
      },
    },
    // Optimize chunks
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
  },
  // Performance optimizations
  server: {
    middlewareMode: false,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    },
  },
});
