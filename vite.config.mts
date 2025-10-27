import { defineConfig } from "vite";
import zaloMiniApp from "zmp-vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";\nimport { loadEnv } from "vite";

// https://vitejs.dev/config/\n  const env = loadEnv(mode, process.cwd(), '');
export default ({ mode }) => {
  return defineConfig({
    root: "./src",\n    envDir: "../",
    base: "",
    plugins: [zaloMiniApp(), react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  });
};
