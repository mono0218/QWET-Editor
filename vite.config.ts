import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import wasm from "vite-plugin-wasm";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),basicSsl(),wasm()],
})
