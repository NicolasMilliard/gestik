import { defineConfig } from "tsdown";

export default defineConfig({
  css: { inject: true },
  entry: ["./src/index.ts"],
  // Keep each hint's CSS beside its module so unused hints can be tree-shaken.
  unbundle: true,
});
