import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins:[react()],
  // REACT_APP_API_URL is kept from the Create React App days so existing
  // .env files, the Dockerfile build arg and Compose keep working.
  envPrefix:['VITE_', 'REACT_APP_'],
  server:{port:3000},
  build:{outDir:'build'},
  test:{
    environment:'jsdom',
    globals:true,
    setupFiles:'./src/setupTests.js',
  },
});
