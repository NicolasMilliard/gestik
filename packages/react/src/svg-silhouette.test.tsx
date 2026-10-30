/** @vitest-environment jsdom */

import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { filledSilhouettePath, snapshotSvg } from "./svg-silhouette";

const raster = (rows: string[]) => {
  const pixels = new Uint8ClampedArray(rows.length * rows[0].length * 4);
  for (const [y, row] of rows.entries()) {
    for (const [x, pixel] of [...row].entries()) {
      pixels[(y * row.length + x) * 4 + 3] = pixel === "#" ? 255 : 0;
    }
  }
  return filledSilhouettePath(pixels, rows[0].length, rows.length);
};

describe("SVG silhouette geometry", () => {
  afterEach(cleanup);

  it("fills enclosed outline interiors while preserving the exterior and gaps", () => {
    expect(
      raster([".......", ".###.#.", ".#.#.#.", ".###.#.", "......."])
    ).toBe(
      "M1 1h3v1H1ZM5 1h1v1H5ZM1 2h3v1H1ZM5 2h1v1H5ZM1 3h3v1H1ZM5 3h1v1H5Z"
    );
    expect(raster([".....", ".###.", ".#...", ".###.", "....."])).toBe(
      "M1 1h3v1H1ZM1 2h1v1H1ZM1 3h3v1H1Z"
    );
    expect(raster(["...", "...", "..."])).toBe("");
  });

  it("resolves styled shapes and transforms without modifying the visible SVG", () => {
    const { container } = render(
      <div>
        <svg
          viewBox="10 20 100 50"
          preserveAspectRatio="xMinYMin meet"
          fill="none"
          style={{ fill: "none", stroke: "red", strokeWidth: 4 }}
        >
          <g transform="translate(4 8)">
            <circle
              cx="40"
              cy="40"
              r="10"
              style={{ fill: "blue", opacity: 0.2 }}
            />
            <path d="M1 2h10" />
          </g>
        </svg>
      </div>
    );
    const original = container.innerHTML;
    const snapshot = snapshotSvg(container);
    expect(container.innerHTML).toBe(original);
    for (const fragment of [
      'viewBox="10 20 100 50"',
      'preserveAspectRatio="xMinYMin meet"',
      'transform="translate(4 8)"',
      "stroke-width: 4",
      "fill: black",
      "opacity: 1",
      "fill: none",
    ]) {
      expect(snapshot).toContain(fragment);
    }
  });

  it("keeps opaque RGB colors ending in zero and ignores fully transparent paint", () => {
    const { container } = render(
      <div>
        <svg viewBox="0 0 24 24">
          <circle
            data-testid="red-stroke"
            r="10"
            style={{ fill: "none", stroke: "rgb(255, 0, 0)" }}
          />
          <rect
            data-testid="transparent-fill"
            width="24"
            height="24"
            style={{ fill: "rgba(0, 0, 0, 0)", stroke: "none" }}
          />
        </svg>
      </div>
    );
    const snapshot = new DOMParser().parseFromString(
      snapshotSvg(container) ?? "",
      "image/svg+xml"
    );
    expect(
      (snapshot.querySelector('[data-testid="red-stroke"]') as SVGElement)
        ?.style.stroke
    ).toBe("black");
    expect(
      (snapshot.querySelector('[data-testid="transparent-fill"]') as SVGElement)
        ?.style.fill
    ).toBe("none");
  });

  it.each([
    <span key="html">HTML artwork</span>,
    <svg key="no-viewbox">
      <path d="M0 0h10v10Z" />
    </svg>,
    <svg key="empty-viewbox" viewBox="" />,
    <svg key="unsupported-1" viewBox="0 0 24 24">
      <use href="#external" />
    </svg>,
    <svg key="unsupported-2" viewBox="0 0 24 24">
      <image href="https://example.com/icon.png" />
    </svg>,
    <svg key="unsupported-3" viewBox="0 0 24 24">
      <animate attributeName="opacity" />
    </svg>,
    <svg key="unsupported-4" viewBox="0 0 24 24">
      <rect style={{ filter: "blur(2px)" }} />
    </svg>,
    <svg key="unsupported-5" viewBox="0 0 24 24">
      <text>Artwork</text>
    </svg>,
  ])("falls back for unsupported or incomplete artwork (%#)", (artwork) => {
    const { container } = render(<div>{artwork}</div>);
    expect(snapshotSvg(container)).toBeNull();
  });
});
