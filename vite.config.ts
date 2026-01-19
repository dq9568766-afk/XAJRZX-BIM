import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    // Vercel: 默认为 '/'；GitHub Pages: 需设置环境变量 VITE_BASE_URL='/XAJRZX-BIM/'
    base: env.VITE_BASE_URL || '/',
    define: {
      'process.env.VITE_AI_API_KEY': JSON.stringify(env.VITE_AI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
