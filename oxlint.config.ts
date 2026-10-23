import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import react from "ultracite/oxlint/react";
import vitest from "ultracite/oxlint/vitest";

export default defineConfig({
  env: { ...core.env, node: true },
  extends: [core, react, vitest],
  ignorePatterns: [...(core.ignorePatterns ?? []), "**/*.tsbuildinfo"],
  overrides: [
    {
      files: ["apps/docs/src/**/*.{ts,tsx}"],
      rules: {
        "react/only-export-components": [
          "error",
          { allowConstantExport: true },
        ],
      },
    },
    {
      files: ["**/*.{test,spec}.{ts,tsx}"],
      rules: {
        // Vitest's per-file environment directive is valid test metadata.
        "jsdoc/check-tag-names": [
          "error",
          { definedTags: ["vitest-environment"] },
        ],
      },
    },
  ],
  rules: {
    // Preserve the existing side-effect import check while allowing component styles.
    "import/no-unassigned-import": ["error", { allow: ["**/*.css"] }],
  },
});
