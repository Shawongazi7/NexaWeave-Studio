
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';

  export default defineConfig({
    plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'build',
    },
    server: {
      port: 3000,
      open: true,
      // Removed explicit hmr.port so when 3000 is busy and Vite picks 3001/3002, it also uses that port for the WS
      // If you need to expose via container/reverse proxy later, add: hmr: { clientPort: <publicPort> }
    },
  });