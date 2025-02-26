/* eslint-disable no-unused-vars */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as sass from 'sass'

// vite.config.js
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        charset: false,
        additionalData: '@use "src/styles/_variables.scss" as *;',
        implementation: sass,
        sassOptions: {
          outputStyle: 'compressed',
          quietDeps: true
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    },
    cors: true
  },
  define: {
    'process.env.VITE_UPLOAD_PATH': JSON.stringify('/uploads'),
    'process.env.VITE_API_URL': JSON.stringify('http://localhost:5000')
  }
});