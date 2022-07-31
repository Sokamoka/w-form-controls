import vue from "@vitejs/plugin-vue2";
import path from "path";

export default {
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "~/assets/css/variables.scss";`,
      },
    },
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
};
