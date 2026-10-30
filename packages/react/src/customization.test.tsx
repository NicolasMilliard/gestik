/** @vitest-environment jsdom */

import { act, cleanup, render, waitFor } from "@testing-library/react";
import { useEffect, useState } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  DragHint,
  HoldHint,
  ResizeHint,
  ScrollHint,
  ShortcutHint,
  SwipeHint,
} from "./index";
import type { HintStyle } from "./index";
import * as silhouette from "./svg-silhouette";

const CUSTOM_ICON = (
  <svg data-testid="custom-icon" viewBox="0 0 32 32">
    <path d="M2 2h28v28H2Z" />
  </svg>
);
const CUTOUT = { path: "M1 1h256v256H1Z", viewBox: "1 1 256 256" };
const ready = async (container: HTMLElement) => {
  await waitFor(() =>
    expect(
      container.querySelector<SVGElement>('[class$="__stage"]')?.dataset.ready
    ).toBe("true")
  );
};

describe("Shared style customization", () => {
  afterEach(cleanup);

  it.each([
    DragHint,
    HoldHint,
    ResizeHint,
    ScrollHint,
    ShortcutHint,
    SwipeHint,
  ])(
    "lets %s style its outer layout while size controls artwork scaling",
    (Hint) => {
      const { container } = render(
        <Hint size={168} style={{ height: 200, width: 240 }} />
      );
      const hint = container.firstElementChild as HTMLElement;
      const stage = hint.querySelector<HTMLElement | SVGElement>(
        '[class$="__stage"]'
      );

      expect([hint.style.width, hint.style.height]).toStrictEqual([
        "240px",
        "200px",
      ]);
      expect(stage?.style.transform).toBe("scale(1.5)");
    }
  );

  it.each([
    [DragHint, "drag"],
    [HoldHint, "hold"],
    [ResizeHint, "resize"],
    [ScrollHint, "scroll"],
    [ShortcutHint, "shortcut"],
    [SwipeHint, "swipe"],
  ] as const)(
    "keeps %s playback props authoritative and restores style fallbacks",
    (Hint, gesture) => {
      const durationVariable = `--gestik-${gesture}-hint-duration`;
      const iterationsVariable = `--gestik-${gesture}-hint-iterations`;
      const playingVariable = `--gestik-${gesture}-hint-play-state`;
      const style: HintStyle = Object.freeze({
        color: "teal",
        [durationVariable]: "900ms",
        [iterationsVariable]: "3",
        marginInlineStart: 12,
        [playingVariable]: "running",
      });
      const { container, rerender } = render(
        <Hint style={style} duration={1500} iterations={1} playing={false} />
      );
      const hint = container.firstElementChild as HTMLElement;
      const playback = () =>
        [durationVariable, iterationsVariable, playingVariable].map(
          (variable) => hint.style.getPropertyValue(variable)
        );

      expect([hint.style.color, hint.style.marginInlineStart]).toStrictEqual([
        "teal",
        "12px",
      ]);
      expect(playback()).toStrictEqual(["1500ms", "1", "paused"]);

      rerender(<Hint style={style} />);
      expect(playback()).toStrictEqual(["900ms", "3", "running"]);

      rerender(<Hint />);
      expect(playback()).toStrictEqual(["", "", ""]);
      expect([hint.style.color, hint.style.marginInlineStart]).toStrictEqual([
        "",
        "",
      ]);
    }
  );
});

describe.each([HoldHint, ResizeHint])("%s artwork customization", (Hint) => {
  beforeEach(() => {
    vi.spyOn(silhouette, "createSvgSilhouette").mockResolvedValue(CUTOUT);
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("waits for an automatic cutout and anchors it with the artwork in one SVG stage", async () => {
    const { container } = render(
      <Hint icon={CUSTOM_ICON} hotspot={{ x: 0.25, y: 0.75 }} />
    );
    const stage = container.querySelector<SVGElement>('[class$="__stage"]');
    expect([
      stage?.dataset.ready,
      container.querySelector("mask"),
    ]).toStrictEqual(["false", null]);
    await ready(container);
    const mask = container.querySelector("mask");
    const cutout = mask?.querySelector("svg");
    const anchor = container.querySelector('[class$="__icon-anchor"]');
    for (const node of [anchor, cutout]) {
      expect(
        ["x", "y", "width", "height"].map((attribute) =>
          node?.getAttribute(attribute)
        )
      ).toStrictEqual(["-8", "-24", "32", "32"]);
    }
    expect([
      cutout?.getAttribute("viewBox"),
      cutout?.querySelector("path")?.getAttribute("d"),
    ]).toStrictEqual([CUTOUT.viewBox, CUTOUT.path]);
    expect([
      mask?.closest('[class$="__stage"]'),
      anchor?.closest('[class$="__stage"]'),
      anchor?.closest("g[mask]"),
    ]).toStrictEqual([stage, stage, null]);
    expect([
      container.querySelectorAll('[data-testid="custom-icon"]').length,
      container.querySelector("g[mask]")?.getAttribute("mask"),
    ]).toStrictEqual([1, `url(#${mask?.id})`]);
  });

  it("restarts on artwork mode changes and preserves completed cutouts while pausing", async () => {
    const { container, rerender } = render(<Hint />);
    const initialStage = container.querySelector('[class$="__stage"]');
    const builtinPath = container.querySelector("mask path")?.getAttribute("d");
    rerender(<Hint icon={CUSTOM_ICON} />);
    const customStage =
      container.querySelector<SVGElement>('[class$="__stage"]');
    expect(customStage).not.toBe(initialStage);
    await ready(container);
    rerender(<Hint icon={CUSTOM_ICON} size={168} playing={false} />);
    expect([
      container.querySelector('[class$="__stage"]'),
      customStage?.dataset.ready,
    ]).toStrictEqual([customStage, "true"]);
    expect(silhouette.createSvgSilhouette).toHaveBeenCalledOnce();
    rerender(<Hint />);
    expect([
      container.querySelector("mask path")?.getAttribute("d"),
      container.querySelector<SVGElement>('[class$="__stage"]')?.dataset.ready,
    ]).toStrictEqual([builtinPath, "true"]);
  });

  it("rebuilds after a child's geometry changes without resetting its state", async () => {
    let change: (() => void) | undefined;
    const Artwork = () => {
      const [width, setWidth] = useState(10);
      useEffect(() => {
        change = () => setWidth(20);
      }, []);
      return (
        <svg viewBox="0 0 32 32">
          <rect data-testid="changing-shape" width={width} height="10" />
        </svg>
      );
    };
    const { container } = render(<Hint icon={<Artwork />} playing={false} />);
    await ready(container);
    const stage = container.querySelector('[class$="__stage"]');
    const changed = { ...CUTOUT, path: "M4 4h20v20H4Z" };
    const observedReadiness: (string | undefined)[] = [];
    const observer = new MutationObserver(() => {
      observedReadiness.push((stage as SVGElement).dataset.ready);
    });
    const shape = container.querySelector('[data-testid="changing-shape"]');
    if (!shape) {
      throw new Error("Expected the custom shape to be mounted.");
    }
    observer.observe(shape, { attributes: true });
    vi.mocked(silhouette.createSvgSilhouette).mockResolvedValue(changed);
    await act(() => change?.());
    observer.disconnect();
    await ready(container);
    expect(observedReadiness).toStrictEqual(["false"]);
    expect(
      container
        .querySelector('[data-testid="changing-shape"]')
        ?.getAttribute("width")
    ).toBe("20");
    expect(container.querySelector('[class$="__stage"]')).toBe(stage);
    expect(container.querySelector("mask path")?.getAttribute("d")).toBe(
      changed.path
    );
    expect(silhouette.createSvgSilhouette).toHaveBeenCalledTimes(2);
  });

  it("keeps unsupported HTML artwork inert and anchored without a built-in cutout", async () => {
    const { container } = render(
      <Hint
        icon={<a href="#outside">Custom icon</a>}
        hotspot={{ x: 0.25, y: 0.75 }}
      />
    );
    await ready(container);
    const artwork = container.querySelector("a");
    const anchor = artwork?.closest('[class$="__icon-anchor"]');
    expect(artwork?.namespaceURI).toBe("http://www.w3.org/1999/xhtml");
    expect(artwork?.closest("[inert]")).toBe(container.firstElementChild);
    expect([
      anchor?.getAttribute("x"),
      anchor?.getAttribute("y"),
    ]).toStrictEqual(["-8", "-24"]);
    expect(container.querySelector("mask")).toBeNull();
    expect(container.firstElementChild?.getAttribute("aria-hidden")).toBe(
      "true"
    );
  });

  it.each([null, new Error("Canvas blocked")])(
    "falls back without a cutout when generation is unavailable (%s)",
    async (failure) => {
      const mock = vi.mocked(silhouette.createSvgSilhouette);
      if (failure) {
        mock.mockRejectedValue(failure);
      } else {
        mock.mockResolvedValue(null);
      }
      const { container, rerender } = render(<Hint icon={CUSTOM_ICON} />);
      await ready(container);
      expect(container.querySelector("mask")).toBeNull();
      expect(
        container.querySelector('[data-testid="custom-icon"]')
      ).not.toBeNull();
      rerender(<Hint icon={null} />);
      await ready(container);
      expect(
        container
          .querySelector('[class$="__icon-anchor"]')
          ?.querySelector("svg")
      ).toBeNull();
      expect(container.querySelector("mask")).toBeNull();
    }
  );

  it.each([null, false])(
    "renders an omitted illustration during SSR without waiting for a cutout (%s)",
    (icon) => {
      const html = renderToString(<Hint icon={icon} />);
      expect(html).toContain('data-ready="true"');
      expect(html).not.toContain("<mask");
      expect(silhouette.createSvgSilhouette).not.toHaveBeenCalled();
    }
  );

  it("hydrates with reserved space and reveals only completed cutouts", async () => {
    const html = renderToString(<Hint icon={CUSTOM_ICON} size={168} />);
    expect(html).toContain('data-ready="false"');
    expect(renderToString(<Hint />)).toContain('data-ready="true"');
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.append(container);
    const onRecoverableError = vi.fn<(error: unknown) => void>();
    let root: ReturnType<typeof hydrateRoot> | undefined;
    await act(() => {
      root = hydrateRoot(container, <Hint icon={CUSTOM_ICON} size={168} />, {
        onRecoverableError,
      });
    });
    await ready(container);
    expect((container.firstElementChild as HTMLElement).style.width).toBe(
      "168px"
    );
    expect(container.querySelectorAll("mask")).toHaveLength(1);
    expect(onRecoverableError).not.toHaveBeenCalled();
    await act(() => root?.unmount());
    container.remove();
  });
});

describe("Scroll artwork customization", () => {
  afterEach(cleanup);

  it("moves custom HTML in the existing scene and can restore the built-in cue", () => {
    const { container, rerender } = render(
      <ScrollHint icon={<a href="#outside">Custom icon</a>} size={168} />
    );
    const artwork = container.querySelector("a");
    const hint = container.firstElementChild as HTMLElement;

    expect(artwork?.closest("[inert]")).toBe(hint);
    expect(artwork?.parentElement?.className).toBe(
      "gestik-scroll-hint__motion"
    );
    expect([hint.style.width, hint.style.height]).toStrictEqual([
      "168px",
      "132px",
    ]);
    expect(container.querySelector("svg")).toBeNull();

    rerender(<ScrollHint />);
    expect(container.querySelector("svg path")).not.toBeNull();
  });
});
