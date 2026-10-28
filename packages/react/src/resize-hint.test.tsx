/** @vitest-environment jsdom */

import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ResizeHint } from "./resize-hint";

describe(ResizeHint, () => {
  afterEach(cleanup);

  it("is decorative, non-focusable, and reserves the default scene", () => {
    const { container } = render(<ResizeHint />);
    const hint = container.firstElementChild as HTMLElement;

    expect(hint.getAttribute("aria-hidden")).toBe("true");
    expect(hint.style.width).toBe("112px");
    expect(hint.style.height).toBe("88px");
    expect(container.querySelector("[tabindex]")).toBeNull();
    expect(
      [...container.querySelectorAll("svg")].every(
        (svg) => svg.getAttribute("focusable") === "false"
      )
    ).toBeTruthy();
  });

  it("reserves proportional space and preserves a caller's class", () => {
    const { container } = render(
      <ResizeHint size={168} className="custom-resize" />
    );
    const hint = container.firstElementChild as HTMLElement;

    expect(hint.style.width).toBe("168px");
    expect(hint.style.height).toBe("132px");
    expect(hint.classList.contains("gestik-resize-hint")).toBeTruthy();
    expect(hint.classList.contains("custom-resize")).toBeTruthy();
  });

  it("keeps each resizing frame connected to its own hand cutout", () => {
    const { container } = render(
      <>
        <ResizeHint />
        <ResizeHint size={168} />
      </>
    );
    const masks = [...container.querySelectorAll("mask")];
    const references = [...container.querySelectorAll("g[mask]")].map((group) =>
      group.getAttribute("mask")
    );

    expect(masks).toHaveLength(2);
    expect(new Set(masks.map((mask) => mask.id)).size).toBe(2);
    expect(references).toStrictEqual(masks.map((mask) => `url(#${mask.id})`));
  });

  it("applies finite playback settings and supports pause and resume", () => {
    const { container, rerender } = render(
      <ResizeHint duration={1800} iterations={2} playing={false} />
    );
    const hint = container.firstElementChild as HTMLElement;

    expect(hint.style.getPropertyValue("--gestik-resize-hint-duration")).toBe(
      "1800ms"
    );
    expect(hint.style.getPropertyValue("--gestik-resize-hint-iterations")).toBe(
      "2"
    );
    expect(hint.style.getPropertyValue("--gestik-resize-hint-play-state")).toBe(
      "paused"
    );

    rerender(<ResizeHint duration={1800} iterations={2} playing />);

    expect(hint.style.getPropertyValue("--gestik-resize-hint-play-state")).toBe(
      "running"
    );
  });

  it("restores CSS playback defaults when overrides are removed", () => {
    const { container, rerender } = render(
      <ResizeHint duration={1800} iterations={2} playing={false} />
    );
    const hint = container.firstElementChild as HTMLElement;

    rerender(<ResizeHint />);

    expect(hint.style.getPropertyValue("--gestik-resize-hint-duration")).toBe(
      ""
    );
    expect(hint.style.getPropertyValue("--gestik-resize-hint-iterations")).toBe(
      ""
    );
    expect(hint.style.getPropertyValue("--gestik-resize-hint-play-state")).toBe(
      ""
    );
  });
});
