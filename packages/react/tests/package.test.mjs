import { readFile } from "node:fs/promises";

import {
  DragHint,
  HoldHint,
  ResizeHint,
  ScrollHint,
  ShortcutHint,
  SwipeHint,
} from "@gestik/react";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

const entry = new URL(import.meta.resolve("@gestik/react"));
const clientDirective = /^\s*["']use client["'];/u;

describe("Built React package", () => {
  it.each(["drag", "hold", "resize"])(
    "preserves the %s hint's client boundary for RSC consumers",
    async (gesture) => {
      const source = await readFile(
        new URL(`${gesture}-hint.mjs`, entry),
        "utf-8"
      );
      expect(clientDirective.test(source)).toBeTruthy();
    }
  );

  it.each(["index", "scroll-hint", "shortcut-hint", "swipe-hint"])(
    "keeps %s available outside a client boundary",
    async (name) => {
      const source = await readFile(new URL(`${name}.mjs`, entry), "utf-8");
      expect(clientDirective.test(source)).toBeFalsy();
    }
  );

  it.each([
    [DragHint, "drag"],
    [HoldHint, "hold"],
    [ResizeHint, "resize"],
    [ScrollHint, "scroll"],
    [ShortcutHint, "shortcut"],
    [SwipeHint, "swipe"],
  ])("server-renders %s without a DOM", (Hint, gesture) => {
    const html = renderToString(createElement(Hint, { size: 168 }));

    expect("document" in globalThis).toBeFalsy();
    expect(html).toContain(`class="gestik-${gesture}-hint"`);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain("width:168px");
    expect(html).toContain("<svg");
  });
});
