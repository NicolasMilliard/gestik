import { execFile } from "node:child_process";
import { readFile, readdir } from "node:fs/promises";
import { promisify } from "node:util";

import {
  DRAG_HINT_DEFAULTS,
  HOLD_HINT_DEFAULTS,
  RESIZE_HINT_DEFAULTS,
  SCROLL_HINT_DEFAULTS,
  SHORTCUT_HINT_DEFAULTS,
  SWIPE_HINT_DEFAULTS,
  getShortcutKeycapWidth,
  getShortcutPressStart,
  getShortcutSceneWidth,
} from "@gestik/core";
import { describe, expect, it } from "vitest";

const hints = [
  ["drag", DRAG_HINT_DEFAULTS, 2800],
  ["hold", HOLD_HINT_DEFAULTS, 3000],
  ["resize", RESIZE_HINT_DEFAULTS, 2200],
  ["scroll", SCROLL_HINT_DEFAULTS, 2400],
  ["shortcut", SHORTCUT_HINT_DEFAULTS, 2400],
  ["swipe", SWIPE_HINT_DEFAULTS, 2200],
];

describe("Built core package", () => {
  it("imports in Node without a DOM or a framework runtime", async () => {
    // A real Node process also catches CSS imports that Vitest can stub out.
    const { stdout } = await promisify(execFile)(
      process.execPath,
      [
        "--input-type=module",
        "--eval",
        'import { DRAG_HINT_DEFAULTS } from "@gestik/core"; process.stdout.write(JSON.stringify({ width: DRAG_HINT_DEFAULTS.width, hasDocument: "document" in globalThis }));',
      ],
      { cwd: new URL("..", import.meta.url) }
    );
    expect(JSON.parse(stdout)).toStrictEqual({
      hasDocument: false,
      width: 112,
    });
    const files = await readdir(new URL("../dist/", import.meta.url), {
      recursive: true,
    });
    const modules = await Promise.all(
      files
        .filter((file) => file.endsWith(".mjs"))
        .map((file) =>
          readFile(new URL(`../dist/${file}`, import.meta.url), "utf-8")
        )
    );

    // Only relative imports are allowed in the core runtime graph.
    for (const source of modules) {
      expect(source).not.toMatch(/(?:from\s*|import\s*)["'](?!\.)/u);
    }
  });

  it.each(hints)(
    "exports %s CSS with compatible defaults and reduced motion",
    async (gesture, defaults, duration) => {
      const css = await readFile(
        new URL(import.meta.resolve(`@gestik/core/styles/${gesture}-hint.css`)),
        "utf-8"
      );

      const requiredRules = [
        `--gestik-${gesture}-hint-duration: ${duration}ms`,
        `--gestik-${gesture}-hint-iterations: infinite`,
        `--gestik-${gesture}-hint-play-state: running`,
        `height: ${defaults.height}px`,
      ];
      if ("width" in defaults) {
        requiredRules.push(`width: ${defaults.width}px`);
      }
      for (const rule of requiredRules) {
        expect(css).toContain(rule);
      }
      expect(css).toContain("@media (prefers-reduced-motion: reduce)");
      expect(css).toContain("animation: none");
      expect(css).not.toMatch(/@import/u);
    }
  );
});

describe("Shortcut layout shared by adapters", () => {
  it("fits the default key row into the existing 112px scene", () => {
    expect(
      getShortcutSceneWidth(
        SHORTCUT_HINT_DEFAULTS.keys.map(getShortcutKeycapWidth)
      )
    ).toBe(112);
  });

  it("fits long labels and custom artwork without changing key order", () => {
    const widths = ["Command", "Shift", undefined, "K"].map(
      getShortcutKeycapWidth
    );

    expect(widths).toStrictEqual([36, 56, 36, 36]);
    expect(getShortcutSceneWidth(widths)).toBe(236);
    expect(
      widths.map((_, index) => getShortcutPressStart(index, widths.length))
    ).toStrictEqual([12, 12 + 22 / 3, 12 + (2 / 3) * 22, 34]);
  });

  it.each([[], [36]])("requires at least two keys (%j)", (...widths) => {
    expect(() => getShortcutSceneWidth(widths)).toThrow(RangeError);
  });
});
