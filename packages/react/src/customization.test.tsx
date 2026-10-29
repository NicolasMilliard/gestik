/** @vitest-environment jsdom */

import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  DragHint,
  HoldHint,
  ResizeHint,
  ScrollHint,
  ShortcutHint,
  SwipeHint,
} from "./index";
import type { HintStyle } from "./index";

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
  afterEach(cleanup);

  it("restarts newly mounted artwork and masking layers on the same cycle", () => {
    const { container, rerender } = render(<Hint />);
    const initialStage = container.querySelector("svg[class]");
    const icon = <svg />;
    rerender(<Hint icon={icon} />);
    const customStage = container.querySelector("svg[class]");
    expect(customStage).not.toBe(initialStage);

    rerender(
      <Hint
        icon={icon}
        iconMask={{ path: "M0 0h32v32H0Z", viewBox: "0 0 32 32" }}
      />
    );
    expect(container.querySelector("svg[class]")).not.toBe(customStage);
  });

  it("keeps custom HTML artwork inert and anchored without a built-in cutout", () => {
    const { container } = render(
      <Hint
        icon={<a href="#outside">Custom icon</a>}
        hotspot={{ x: 0.25, y: 0.75 }}
      />
    );
    const artwork = container.querySelector("a");

    expect(artwork?.namespaceURI).toBe("http://www.w3.org/1999/xhtml");
    expect(artwork?.closest("[inert]")).toBe(container.firstElementChild);
    expect(artwork?.parentElement?.style.transform).toBe(
      "translate(-25%, -75%)"
    );
    expect(container.querySelector("mask")).toBeNull();
    expect(container.firstElementChild?.getAttribute("aria-hidden")).toBe(
      "true"
    );
  });

  it("positions a supplied silhouette at the same contact point and restores the default", () => {
    const iconMask = { path: "M2 2h28v28H2Z", viewBox: "0 0 32 32" };
    const { container, rerender } = render(
      <Hint
        icon={<svg data-testid="custom-icon" />}
        iconMask={iconMask}
        hotspot={{ x: 0.25, y: 0.75 }}
      />
    );
    const mask = container.querySelector("mask");
    const silhouette = mask?.querySelector("svg");

    expect(
      ["x", "y", "width", "height", "viewBox"].map((attribute) =>
        silhouette?.getAttribute(attribute)
      )
    ).toStrictEqual(["-8", "-24", "32", "32", iconMask.viewBox]);
    expect(silhouette?.querySelector("path")?.getAttribute("d")).toBe(
      iconMask.path
    );
    expect(container.querySelector("g[mask]")?.getAttribute("mask")).toBe(
      `url(#${mask?.id})`
    );
    expect(
      container.querySelectorAll('[data-testid="custom-icon"]')
    ).toHaveLength(1);

    rerender(<Hint />);
    expect(container.querySelector("mask path")?.getAttribute("d")).not.toBe(
      iconMask.path
    );
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
