import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        configure: (proxy) => {
          // Когда бэкенд не поднят, vite по умолчанию отвечает пустым 500 —
          // от настоящей ошибки сервера его не отличить. Отвечаем 502,
          // как ответил бы nginx в проде, и с телом, а не пустотой.
          proxy.on("error", (_err, _req, res) => {
            if (!("writeHead" in res) || res.headersSent || res.writableEnded) {
              return;
            }
            res.writeHead(502, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Бэкенд не отвечает" }));
          });
        },
      },
      // чат: в разработке WebSocket идёт на тот же origin, что и страница
      "/ws": {
        target: "ws://localhost:4000",
        ws: true,
      },
    },
  },
  plugins: [react()],
});
