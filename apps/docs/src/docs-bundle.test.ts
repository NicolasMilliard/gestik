import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { JSDOM } from "jsdom";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { buildDocs } from "../scripts/build-docs";

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
        /\/src\/(?:pages\/[\w-]+-hint-page|components\/[\w-]+-hint-demo|components\/ui\/select)\.tsx$/u.test(
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

  it.each([
    ["", "Show users how.", "Gestik"],
    ...gestures.map((gesture) => [
      `${gesture}-hint`,
      `${gesture[0].toUpperCase() + gesture.slice(1)}Hint`,
      `${gesture[0].toUpperCase() + gesture.slice(1)}Hint — Gestik`,
    ]),
  ])(
    "prerenders %s with content, title, and nested-safe assets",
    async (route, heading, title) => {
      const html = await readFile(
        path.join(outDir, route, "index.html"),
        "utf-8"
      );
      const dom = new JSDOM(html);
      const { document } = dom.window;
      expect(document.querySelector("h1")?.textContent).toBe(heading);
      expect(document.title).toBe(title);
      expect(document.querySelectorAll('a[href*="#/"]')).toHaveLength(0);
      expect(
        document.querySelector('script[type="module"]')?.getAttribute("src")
      ).toMatch(/^\/gestik\/assets\//u);
      expect(html).not.toContain("Loading documentation");
      dom.window.close();
    }
  );

  it("provides a real not-found document for static hosting", async () => {
    const html = await readFile(path.join(outDir, "404.html"), "utf-8");
    const dom = new JSDOM(html);
    expect(dom.window.document.querySelector("h1")?.textContent).toBe(
      "Page not found"
    );
    expect(
      dom.window.document
        .querySelector('script[type="module"]')
        ?.getAttribute("src")
    ).toMatch(/^\/gestik\/assets\//u);
    dom.window.close();
  });
});
