import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon-192.svg'],
      manifest: {
        name: 'Angpao Tracker 红包记录',
        short_name: 'Angpao',
        description: 'Track your CNY angpao collection',
        theme_color: '#B91C1C',
        background_color: '#FFF7ED',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'icon-192.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}']
      }
    })
  ],
})
