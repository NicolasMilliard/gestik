import { defineConfig } from "tsdown";

export default defineConfig({
  // CSS remains a separate, explicit entry point for each gesture.
  copy: [{ from: "src/styles/*.css", to: "dist/styles" }],
  entry: ["./src/index.ts"],
  unbundle: true,
});
