import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // Paginas del repo base (auth + admin)
        index: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "src/pages/auth/login/login.html"),
        registro: resolve(__dirname, "src/pages/auth/registro/registro.html"),
        adminHome: resolve(__dirname, "src/pages/admin/home/home.html"),
        clientHome: resolve(__dirname, "src/pages/client/home/home.html"),
        // Agregados parcial
        storeHome: resolve(__dirname, "src/pages/store/home/home.html"),
        storeCart: resolve(__dirname, "src/pages/store/cart/cart.html"),
        storeAdmin: resolve(__dirname, "src/pages/store/admin/admin.html"),
      },
    },
  },
  server: {
    open: "/src/pages/auth/login/login.html",
  },
  base: "/",
});
