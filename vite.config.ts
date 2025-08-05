import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import fs from 'fs'
import path from 'path'

const certPath = './';
const keyFile = path.resolve(certPath, './192.168.x.x-key.pem');
const certFile = path.resolve(certPath, './192.168.x.x.pem');

const hasCerts = fs.existsSync(keyFile) && fs.existsSync(certFile);

const server = hasCerts
  ? {
      host: '0.0.0.0',
      port: 5173,
      https: {
        key: fs.readFileSync(keyFile),
        cert: fs.readFileSync(certFile),
      },
    }
  : undefined;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  ...(server && { server })
})
