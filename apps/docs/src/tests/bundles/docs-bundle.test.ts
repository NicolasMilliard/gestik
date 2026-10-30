import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { JSDOM } from "jsdom";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { buildDocs } from "../../../scripts/build-docs";

const gestures = ["drag", "hold", "resize", "scroll", "shortcut", "swipe"];

describe("Docs production bundles", () => {
  let outDir: string;
  let result: Awaited<ReturnType<typeof buildDocs>>;
  beforeAll(async () => {
    outDir = await mkdtemp(path.join(os.tmpdir(), "gestik-docs-"));
    result = await buildDocs({ logLevel: "silent", outDir });
  }, 20_000);

  afterAll(async () => {
    await rm(outDir, { force: true, recursive: true });
  });

  it("defers component pages and playground controls without oversized chunks", () => {
    if (Array.isArray(result) || !("output" in result)) {
      throw new Error("Expected a single docs build.");
    }

    const chunks = result.output.filter((file) => file.type === "chunk");
    const initial = new Set(chunks.filter((chunk) => chunk.isEntry));
    for (const chunk of initial) {
      for (const dependency of chunk.imports) {
        const imported = chunks.find(
          (candidate) => candidate.fileName === dependency
        );
        if (imported) {
          initial.add(imported);
        }
      }
    }
    const initialModules = [...initial].flatMap((chunk) => chunk.moduleIds);

    expect(
      initialModules.filter((id) =>
        /\/src\/(?:pages\/[\w-]+-hint-page|playgrounds\/.+|components\/(?:ui\/select|content\/.+))\.tsx?$/u.test(
          id
        )
      )
    ).toStrictEqual([]);
    expect(
      gestures.filter((gesture) =>
        chunks.some(
          (chunk) =>
            !initial.has(chunk) &&
            chunk.moduleIds.some((id) =>
              id.endsWith(`/src/pages/${gesture}-hint-page.tsx`)
            )
        )
      )
    ).toStrictEqual(gestures);
    expect(
      [...initial].reduce(
        (bytes, chunk) =>
          bytes + new TextEncoder().encode(chunk.code).byteLength,
        0
      )
    ).toBeLessThan(350_000);
    expect(
      chunks.every(
        (chunk) => new TextEncoder().encode(chunk.code).byteLength < 500_000
      )
    ).toBeTruthy();
    // A dev JSX transform paired with production React breaks hydration.
    expect(chunks.map((chunk) => chunk.code).join("\n")).not.toContain(
      "jsxDEV"
    );
  });

  it.each(["", ...gestures.map((gesture) => `${gesture}-hint`)])(
    "prerenders %s with content and nested-safe assets",
    async (route) => {
      const html = await readFile(
        path.join(outDir, route, "index.html"),
        "utf-8"
      );
      const dom = new JSDOM(html);
      const { document } = dom.window;
      expect(document.querySelector("main h1")).not.toBeNull();
      expect(document.querySelectorAll('a[href*="#/"]')).toHaveLength(0);
      expect(
        document.querySelector('script[type="module"]')?.getAttribute("src")
      ).toMatch(/^\/gestik\/assets\//u);
      dom.window.close();
    }
  );

  it("prerenders both example sources with only React visible initially", async () => {
    const html = await readFile(
      path.join(outDir, "drag-hint", "index.html"),
      "utf-8"
    );
    const dom = new JSDOM(html);
    const example = dom.window.document.querySelector(
      'section[aria-labelledby="example-title"]'
    );
    const tabs = example?.querySelectorAll('[role="tab"]') ?? [];
    const panels = example?.querySelectorAll('[role="tabpanel"]') ?? [];

    expect(
      [...tabs].map((tab) => tab.getAttribute("aria-selected"))
    ).toStrictEqual(["true", "false"]);
    expect(
      [...panels].map((panel) => panel.hasAttribute("hidden"))
    ).toStrictEqual([false, true]);
    for (const panel of panels) {
      expect(panel.querySelector("code")?.textContent?.trim()).toBeTruthy();
    }
    expect(
      [...tabs].map((tab) => [tab.id, tab.getAttribute("aria-controls")])
    ).toStrictEqual(
      [...panels].map((panel) => [
        panel.getAttribute("aria-labelledby"),
        panel.id,
      ])
    );
    dom.window.close();
  });

  it("provides a real not-found document for static hosting", async () => {
    const html = await readFile(path.join(outDir, "404.html"), "utf-8");
    const dom = new JSDOM(html);
    expect(dom.window.document.querySelector("main h1")).not.toBeNull();
    expect(
      dom.window.document
        .querySelector('script[type="module"]')
        ?.getAttribute("src")
    ).toMatch(/^\/gestik\/assets\//u);
    dom.window.close();
  });
});
