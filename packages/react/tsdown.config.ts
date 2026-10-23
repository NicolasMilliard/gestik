import { defineConfig } from "tsdown";

export default defineConfig({
  css: { inject: true },
  entry: ["./src/index.ts"],
});
