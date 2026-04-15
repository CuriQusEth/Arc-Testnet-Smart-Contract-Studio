import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.ARC_RPC_URL': JSON.stringify(env.ARC_RPC_URL),
      'process.env.ARC_CHAIN_ID': JSON.stringify(env.ARC_CHAIN_ID),
      'process.env.ARC_CHAIN_NAME': JSON.stringify(env.ARC_CHAIN_NAME),
      'process.env.PRIVATE_KEY': JSON.stringify(env.PRIVATE_KEY),
      'process.env.KIT_KEY': JSON.stringify(env.KIT_KEY),
      'process.env.WALLET_ID': JSON.stringify(env.WALLET_ID),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
