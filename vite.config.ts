import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  base: "/tee-time-tee-bot/",
  tanstackStart: {
    server: { entry: "server" },
  },
});
