import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@aws-amplify/api-graphql']
  },
  resolve: {
    alias: {
      './runtimeConfig': './runtimeConfig.browser',
      'components': path.resolve(__dirname, './src/components'),
      'layouts': path.resolve(__dirname, './src/layouts'),
      'routes': path.resolve(__dirname, './src/routes'),
      'pages': path.resolve(__dirname, './src/pages'),
      'utils': path.resolve(__dirname, './src/utils'),
      'contexts': path.resolve(__dirname, './src/contexts'),
      'lib': path.resolve(__dirname, './src/lib'),
      'config': path.resolve(__dirname, './src/config'),
      'store': path.resolve(__dirname, './src/store'),
      'assets': path.resolve(__dirname, './src/assets'),
      'menu-items': path.resolve(__dirname, './src/menu-items'),
    },
  },
})
