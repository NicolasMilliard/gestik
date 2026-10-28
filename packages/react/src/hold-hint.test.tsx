/** @vitest-environment jsdom */

import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { HoldHint } from "./hold-hint";

describe(HoldHint, () => {
  afterEach(cleanup);

  it("is decorative, non-focusable, and reserves the default scene", () => {
    const { container } = render(<HoldHint />);
    const hint = container.firstElementChild as HTMLElement;

    expect(hint.getAttribute("aria-hidden")).toBe("true");
    expect(hint.style.width).toBe("112px");
    expect(hint.style.height).toBe("72px");
    expect(container.querySelector("[tabindex]")).toBeNull();
    expect(
      [...container.querySelectorAll("svg")].every(
        (svg) => svg.getAttribute("focusable") === "false"
      )
    ).toBeTruthy();
  });

  it("reserves proportional space and preserves a caller's class", () => {
    const { container } = render(
      <HoldHint size={168} className="custom-hold" />
    );
    const hint = container.firstElementChild as HTMLElement;

    expect(hint.style.width).toBe("168px");
    expect(hint.style.height).toBe("108px");
    expect(hint.classList.contains("gestik-hold-hint")).toBeTruthy();
    expect(hint.classList.contains("custom-hold")).toBeTruthy();
  });

  it("keeps the ring connected to its own hand cutout across instances", () => {
    const { container } = render(
      <>
        <HoldHint />
        <HoldHint size={168} />
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
      <HoldHint duration={1800} iterations={2} playing={false} />
    );
    const hint = container.firstElementChild as HTMLElement;

    expect(hint.style.getPropertyValue("--gestik-hold-hint-duration")).toBe(
      "1800ms"
    );
    expect(hint.style.getPropertyValue("--gestik-hold-hint-iterations")).toBe(
      "2"
    );
    expect(hint.style.getPropertyValue("--gestik-hold-hint-play-state")).toBe(
      "paused"
    );

    rerender(<HoldHint duration={1800} iterations={2} playing />);

    expect(hint.style.getPropertyValue("--gestik-hold-hint-play-state")).toBe(
      "running"
    );
  });

  it("restores CSS playback defaults when overrides are removed", () => {
    const { container, rerender } = render(
      <HoldHint duration={1800} iterations={2} playing={false} />
    );
    const hint = container.firstElementChild as HTMLElement;

    rerender(<HoldHint />);

    expect(hint.style.getPropertyValue("--gestik-hold-hint-duration")).toBe("");
    expect(hint.style.getPropertyValue("--gestik-hold-hint-iterations")).toBe(
      ""
    );
    expect(hint.style.getPropertyValue("--gestik-hold-hint-play-state")).toBe(
      ""
    );
  });
});
