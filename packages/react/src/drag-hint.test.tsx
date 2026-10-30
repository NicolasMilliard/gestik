/** @vitest-environment jsdom */

import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { StrictMode, useEffect, useState } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DragHint } from "./drag-hint";
import * as silhouette from "./svg-silhouette";

const CUSTOM_ICONS = {
  grabbing: (
    <svg data-testid="grabbing-pose" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" />
    </svg>
  ),
  idle: (
    <svg data-testid="idle-pose" viewBox="0 0 24 24">
      <path d="M4 4h16v16H4Z" />
    </svg>
  ),
};
const CUTOUT = { path: "M1 1h256v256H1Z", viewBox: "1 1 256 256" };
const ready = async (container: HTMLElement) => {
  await waitFor(() =>
    expect(
      container.querySelector<HTMLElement>(".gestik-drag-hint__stage")?.dataset
        .ready
    ).toBe("true")
  );
};

describe(DragHint, () => {
  beforeEach(() => {
    vi.spyOn(silhouette, "createSvgSilhouette").mockResolvedValue(CUTOUT);
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("is decorative and drags right by default", () => {
    const { container } = render(<DragHint />);
    const hint = container.firstElementChild as HTMLElement | null;

    expect(hint?.getAttribute("aria-hidden")).toBe("true");
    expect(hint?.hasAttribute("inert")).toBeTruthy();
    expect(hint?.dataset.direction).toBe("right");
  });

  it("reserves proportional space at a custom size", () => {
    const { container } = render(<DragHint direction="left" size={84} />);
    const hint = container.firstElementChild as HTMLElement | null;

    expect(hint?.dataset.direction).toBe("left");
    expect(hint?.style.width).toBe("84px");
    expect(hint?.style.height).toBe("54px");
  });

  it("positions both built-in poses and cutouts at the square's lower edge", () => {
    const { container } = render(<DragHint />);
    const anchor = container.querySelector<SVGElement>(
      ".gestik-drag-hint__icon-anchor"
    );
    const icons = anchor?.querySelectorAll("svg");

    expect([
      anchor?.getAttribute("x"),
      anchor?.getAttribute("y"),
    ]).toStrictEqual(["4", "16"]);
    expect(icons).toHaveLength(2);
    for (const icon of icons ?? []) {
      expect(
        ["width", "height", "focusable"].map((attribute) =>
          icon.getAttribute(attribute)
        )
      ).toStrictEqual(["100%", "100%", "false"]);
    }
    expect(
      [...container.querySelectorAll("mask svg")].map((mask) => [
        mask.getAttribute("x"),
        mask.getAttribute("y"),
      ])
    ).toStrictEqual([
      ["4", "16"],
      ["4", "16"],
      ["4", "16"],
      ["4", "16"],
    ]);
  });

  it("renders custom poses at the requested hotspot", () => {
    const { container } = render(
      <DragHint
        className="custom-hint"
        icons={{
          grabbing: <svg data-testid="grabbing-pose" />,
          idle: (
            <a href="#example" data-testid="idle-pose">
              Custom artwork
            </a>
          ),
        }}
        hotspot={{ x: 0.25, y: 0.75 }}
      />
    );

    expect(
      container.firstElementChild?.classList.contains("custom-hint")
    ).toBeTruthy();
    expect(
      container
        .querySelector(".gestik-drag-hint__icon--idle")
        ?.contains(screen.getByTestId("idle-pose"))
    ).toBeTruthy();
    expect(
      container
        .querySelector(".gestik-drag-hint__icon--grabbing")
        ?.contains(screen.getByTestId("grabbing-pose"))
    ).toBeTruthy();

    const anchor = container.querySelector<SVGElement>(
      ".gestik-drag-hint__icon-anchor"
    );
    expect([
      anchor?.getAttribute("x"),
      anchor?.getAttribute("y"),
      screen.getByTestId("idle-pose").namespaceURI,
    ]).toStrictEqual(["10", "-2", "http://www.w3.org/1999/xhtml"]);
    expect([
      container.querySelector("mask"),
      screen.getByTestId("idle-pose").closest("[inert]"),
    ]).toStrictEqual([null, container.firstElementChild]);
  });

  it("keeps each instance's destination and square connected to their own masks", () => {
    const { container, rerender } = render(
      <>
        <DragHint />
        <DragHint direction="left" />
      </>
    );
    const hints = container.querySelectorAll(".gestik-drag-hint");
    const maskIds = [...container.querySelectorAll("mask")].map(
      (mask) => mask.id
    );

    for (const hint of hints) {
      for (const selector of [
        ".gestik-drag-hint__masked-scene",
        ".gestik-drag-hint__square-scene",
      ]) {
        const scene = hint.querySelector(selector);
        const maskId = scene?.getAttribute("mask")?.slice(5, -1);

        // Keep masking native to SVG; HTML CSS masks can leave stale WebKit cutouts.
        expect(scene?.namespaceURI).toBe("http://www.w3.org/2000/svg");
        expect(
          [...hint.querySelectorAll("mask")].some((mask) => mask.id === maskId)
        ).toBeTruthy();
        expect(
          scene?.querySelector(".gestik-drag-hint__icon-anchor")
        ).toBeNull();
      }
    }
    expect(new Set(maskIds).size).toBe(4);

    rerender(
      <>
        <DragHint direction="left" />
        <DragHint />
      </>
    );
    expect(
      [...container.querySelectorAll("mask")].map((mask) => mask.id)
    ).toStrictEqual(maskIds);
  });

  it.each([undefined, { grabbing: <svg />, idle: <svg /> }])(
    "keeps the square, shadow, and artwork attached throughout travel and lift",
    (icons) => {
      const { container } = render(<DragHint icons={icons} />);
      const square = container.querySelector(".gestik-drag-hint__square");
      const shadow = container.querySelector(".gestik-drag-hint__shadow");
      const artwork = container.querySelector(".gestik-drag-hint__icon-anchor");
      const lift = square?.closest(".gestik-drag-hint__lift-group");

      expect(lift).not.toBeNull();
      expect(artwork?.closest(".gestik-drag-hint__lift-group")).toBe(lift);
      expect(shadow?.closest(".gestik-drag-hint__lift-group")).toBe(lift);
      expect(lift?.closest(".gestik-drag-hint__drag-group")?.namespaceURI).toBe(
        "http://www.w3.org/2000/svg"
      );
      // The shadow excludes the same outline as the square, including its stroke.
      for (const attribute of [
        "x",
        "y",
        "width",
        "height",
        "rx",
        "stroke-width",
      ]) {
        expect(shadow?.getAttribute(attribute)).toBe(
          square?.getAttribute(attribute)
        );
      }
    }
  );

  it("reserves transparent space around the masked shadow for WebKit", () => {
    const { container } = render(<DragHint />);
    const bounds = container.querySelector(
      ".gestik-drag-hint__square-scene .gestik-drag-hint__shadow-bounds"
    );
    const filter = container.querySelector("filter");
    const mask = container.querySelector('mask[id$="-square"]');

    expect(bounds?.getAttribute("fill")).toBe("transparent");
    expect(filter?.getAttribute("filterUnits")).toBe("userSpaceOnUse");
    for (const attribute of ["x", "y", "width", "height"]) {
      expect([
        bounds?.getAttribute(attribute),
        mask?.getAttribute(attribute),
      ]).toStrictEqual([
        filter?.getAttribute(attribute),
        filter?.getAttribute(attribute),
      ]);
    }
  });

  it("generates both cutouts automatically and positions them at the hotspot", async () => {
    const { container } = render(
      <DragHint icons={CUSTOM_ICONS} hotspot={{ x: 0.25, y: 0.75 }} />
    );
    expect(
      container.querySelector<HTMLElement>(".gestik-drag-hint__stage")?.dataset
        .ready
    ).toBe("false");
    expect(container.querySelector("mask")).toBeNull();
    await ready(container);
    for (const pose of ["idle", "grabbing"] as const) {
      const cutout = container.querySelector(
        `.gestik-drag-hint__mask--${pose}`
      );
      expect(cutout?.getAttribute("viewBox")).toBe(CUTOUT.viewBox);
      expect(
        ["x", "y", "width", "height"].map((attribute) =>
          cutout?.getAttribute(attribute)
        )
      ).toStrictEqual(["10", "-2", "24", "24"]);
      expect(cutout?.querySelector("path")?.getAttribute("d")).toBe(
        CUTOUT.path
      );
      expect(screen.getAllByTestId(`${pose}-pose`)).toHaveLength(1);
    }
    expect(silhouette.createSvgSilhouette).toHaveBeenCalledTimes(2);
  });

  it("rebuilds after geometry changes, discards stale work, and preserves pause", async () => {
    let finishOld: ((value: typeof CUTOUT) => void) | undefined;
    vi.mocked(silhouette.createSvgSilhouette).mockImplementationOnce(
      () =>
        // oxlint-disable-next-line promise/avoid-new -- Control completion to exercise stale async results.
        new Promise((resolve) => {
          finishOld = resolve;
        })
    );
    const { container, rerender } = render(<DragHint icons={CUSTOM_ICONS} />);
    rerender(
      <DragHint
        icons={{
          ...CUSTOM_ICONS,
          grabbing: (
            <svg viewBox="0 0 10 10">
              <rect width="10" height="10" />
            </svg>
          ),
        }}
        playing={false}
      />
    );
    await ready(container);
    expect(
      container
        .querySelector(".gestik-drag-hint__mask--grabbing path")
        ?.getAttribute("d")
    ).toBe(CUTOUT.path);
    await act(() => finishOld?.({ ...CUTOUT, path: "stale" }));
    expect(
      container
        .querySelector(".gestik-drag-hint__mask--grabbing path")
        ?.getAttribute("d")
    ).toBe(CUTOUT.path);
    expect(
      (container.firstElementChild as HTMLElement).style.getPropertyValue(
        "--gestik-drag-hint-play-state"
      )
    ).toBe("paused");
    // Equivalent JSX and playback changes do not regenerate geometry.
    rerender(
      <DragHint
        icons={{
          ...CUSTOM_ICONS,
          grabbing: (
            <svg viewBox="0 0 10 10">
              <rect width="10" height="10" />
            </svg>
          ),
        }}
        playing
      />
    );
    expect(silhouette.createSvgSilhouette).toHaveBeenCalledTimes(4);
  });

  it("observes a child component's own geometry updates without remounting it", async () => {
    let change: (() => void) | undefined;
    const Artwork = () => {
      const [width, setWidth] = useState(10);
      useEffect(() => {
        change = () => setWidth(20);
      }, []);
      return (
        <svg viewBox="0 0 24 24">
          <rect data-testid="changing-shape" width={width} height="10" />
        </svg>
      );
    };
    const { container } = render(
      <StrictMode>
        <DragHint
          icons={{ grabbing: CUSTOM_ICONS.grabbing, idle: <Artwork /> }}
        />
      </StrictMode>
    );
    await ready(container);
    const calls = vi.mocked(silhouette.createSvgSilhouette).mock.calls.length;
    await act(() => change?.());
    await ready(container);
    expect(screen.getByTestId("changing-shape").getAttribute("width")).toBe(
      "20"
    );
    expect(silhouette.createSvgSilhouette).toHaveBeenCalledTimes(calls + 2);
  });

  it("settles into unmasked artwork when generation fails", async () => {
    vi.mocked(silhouette.createSvgSilhouette).mockRejectedValue(
      new Error("Canvas blocked")
    );
    const { container } = render(<DragHint icons={CUSTOM_ICONS} />);
    await ready(container);
    expect(container.querySelector("mask")).toBeNull();
    expect(screen.getByTestId("idle-pose")).toBeDefined();
  });

  it("keeps server markup stable through hydration and reveals only completed cutouts", async () => {
    const html = renderToString(<DragHint icons={CUSTOM_ICONS} />);
    expect(html).toContain('data-ready="false"');
    expect(html).not.toContain("<mask");
    expect(renderToString(<DragHint />)).toContain('data-ready="true"');
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.append(container);
    const onRecoverableError = vi.fn<(error: unknown) => void>();
    let root: ReturnType<typeof hydrateRoot> | undefined;
    await act(() => {
      root = hydrateRoot(container, <DragHint icons={CUSTOM_ICONS} />, {
        onRecoverableError,
      });
    });
    await ready(container);
    expect(container.querySelectorAll("mask")).toHaveLength(2);
    expect(onRecoverableError).not.toHaveBeenCalled();
    await act(() => root?.unmount());
    container.remove();
  });

  it("applies playback settings and can resume", () => {
    const { container, rerender } = render(
      <DragHint duration={1400} iterations={2} playing={false} />
    );
    const hint = container.firstElementChild as HTMLElement;

    expect(hint.style.getPropertyValue("--gestik-drag-hint-duration")).toBe(
      "1400ms"
    );
    expect(hint.style.getPropertyValue("--gestik-drag-hint-iterations")).toBe(
      "2"
    );
    expect(hint.style.getPropertyValue("--gestik-drag-hint-play-state")).toBe(
      "paused"
    );

    rerender(<DragHint duration={1400} iterations={2} playing />);

    expect(hint.style.getPropertyValue("--gestik-drag-hint-play-state")).toBe(
      "running"
    );
  });
});
