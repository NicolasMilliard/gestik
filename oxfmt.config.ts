import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

export default defineConfig({
  ...ultracite,
  ignorePatterns: [
    ...(ultracite.ignorePatterns ?? []),
    "**/playwright-report",
    "**/test-results",
    "**/*.tsbuildinfo",
    ".env",
    ".env.*",
  ],
  // Resolve the docs app's Tailwind v4 theme when sorting custom utility classes.
  sortTailwindcss: {
    ...(typeof ultracite.sortTailwindcss === "object"
      ? ultracite.sortTailwindcss
      : {}),
    stylesheet: "./apps/docs/src/index.css",
  },
});
