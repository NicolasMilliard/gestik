import { defineConfig } from "tsdown";

export default defineConfig({
  css: { inject: true },
  entry: ["./src/index.ts"],
  // Preserve each hint's module and core CSS import so unused hints can be tree-shaken.
  unbundle: true,
});
