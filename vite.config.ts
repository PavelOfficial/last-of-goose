import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "domain": path.resolve(__dirname, "./src/domain/"),
      "query": path.resolve(__dirname, "./src/query/"),
    },
  },
})
