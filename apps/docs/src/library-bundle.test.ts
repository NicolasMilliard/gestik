import { gzipSync } from "node:zlib";

import { build } from "vite";
import { describe, expect, it } from "vitest";

const hints = [
  ["DragHint", "drag"],
  ["HoldHint", "hold"],
  ["ResizeHint", "resize"],
  ["ScrollHint", "scroll"],
  ["ShortcutHint", "shortcut"],
  ["SwipeHint", "swipe"],
] as const;

describe("Built library bundles", () => {
  it.each(hints)(
    "includes only %s and its styles in a production consumer",
    async (name, gesture) => {
      const entry = "virtual:gestik-consumer";
      const result = await build({
        build: {
          minify: true,
          rolldownOptions: {
            external: ["react", "react/jsx-runtime"],
            input: entry,
            output: { format: "es" },
            preserveEntrySignatures: "strict",
          },
          write: false,
        },
        configFile: false,
        logLevel: "silent",
        plugins: [
          {
            enforce: "pre",
            load(id) {
              if (id === `\0${entry}`) {
                return `export { ${name} } from "@gestik/react";`;
              }
            },
            name: "gestik-consumer",
            resolveId(id) {
              if (id === entry) {
                return `\0${entry}`;
              }
            },
          },
        ],
      });

      if (Array.isArray(result) || !("output" in result)) {
        throw new Error("Expected a single production bundle.");
      }

      const javascript = result.output
        .filter((file) => file.type === "chunk")
        .map((file) => file.code)
        .join("\n");
      const css = result.output
        .filter((file) => file.type === "asset")
        .filter((file) => file.fileName.endsWith(".css"))
        .map((file) => String(file.source))
        .join("\n");

      expect(
        result.output.some(
          (file) => file.type === "chunk" && file.exports.includes(name)
        )
      ).toBeTruthy();
      const componentNames =
        /gestik-(?:drag|hold|resize|scroll|shortcut|swipe)-hint/gu;
      expect([...new Set(javascript.match(componentNames))]).toStrictEqual([
        `gestik-${gesture}-hint`,
      ]);
      expect([...new Set(css.match(componentNames))]).toStrictEqual([
        `gestik-${gesture}-hint`,
      ]);
      expect(css).toContain("prefers-reduced-motion");

      // React is external. Leave room for polish, while catching bundled dependencies.
      expect(
        gzipSync(javascript).byteLength + gzipSync(css).byteLength
      ).toBeLessThan(4096);
    }
  );
});
