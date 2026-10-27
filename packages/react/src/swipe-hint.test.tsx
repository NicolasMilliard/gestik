/** @vitest-environment jsdom */

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { SwipeHint } from "./swipe-hint";

describe(SwipeHint, () => {
  afterEach(cleanup);

  it("is decorative and swipes right by default", () => {
    const { container } = render(<SwipeHint />);
    const hint = container.firstElementChild as HTMLElement;

    expect(hint.getAttribute("aria-hidden")).toBe("true");
    expect(hint.dataset.direction).toBe("right");
    expect(hint.style.width).toBe("112px");
    expect(hint.style.height).toBe("72px");
    expect(container.querySelector("[tabindex]")).toBeNull();
  });

  it("reserves proportional space for a left swipe at a custom size", () => {
    const { container } = render(<SwipeHint direction="left" size={168} />);
    const hint = container.firstElementChild as HTMLElement;

    expect(hint.dataset.direction).toBe("left");
    expect(hint.style.width).toBe("168px");
    expect(hint.style.height).toBe("108px");
  });

  it("anchors the built-in hand and its press at the fingertip", () => {
    const { container } = render(<SwipeHint />);
    const anchor = container.querySelector<HTMLElement>(
      ".gestik-swipe-hint__icon-anchor"
    );
    const icon = anchor?.querySelector("svg");

    expect(anchor?.style.transform).toBe("translate(-45.3125%, -6.25%)");
    expect(icon?.parentElement?.style.transformOrigin).toBe("45.3125% 6.25%");
    expect(icon?.getAttribute("width")).toBe("100%");
    expect(icon?.getAttribute("height")).toBe("100%");
    expect(icon?.getAttribute("focusable")).toBe("false");
  });

  it("draws a rounded trail from the contact point in either direction", () => {
    const { container, rerender } = render(<SwipeHint size={168} />);
    const trail = container.querySelector(".gestik-swipe-hint__trail");
    const path = trail?.querySelector("path");

    expect(trail?.getAttribute("focusable")).toBe("false");
    expect(path?.getAttribute("d")).toBe("M26 28H82");
    expect(path?.getAttribute("stroke-width")).toBe("2");
    expect(path?.getAttribute("stroke-linecap")).toBe("round");

    rerender(<SwipeHint direction="left" size={168} />);

    expect(
      container
        .querySelector(".gestik-swipe-hint__trail path")
        ?.getAttribute("d")
    ).toBe("M82 28H26");
  });

  it("renders a custom icon at its normalized contact point", () => {
    const { container } = render(
      <SwipeHint
        className="custom-hint"
        icon={<svg data-testid="custom-swipe-icon" />}
        hotspot={{ x: 0.25, y: 0.75 }}
      />
    );
    const icon = screen.getByTestId("custom-swipe-icon");

    expect(
      container.firstElementChild?.classList.contains("custom-hint")
    ).toBeTruthy();
    const anchor = icon.closest<HTMLElement>(".gestik-swipe-hint__icon-anchor");

    expect(anchor?.style.transform).toBe("translate(-25%, -75%)");
    expect(icon.parentElement?.style.transformOrigin).toBe("25% 75%");
  });

  it("keeps each trail connected to its own fade mask and gradient", () => {
    const { container } = render(
      <>
        <SwipeHint />
        <SwipeHint direction="left" />
      </>
    );
    const maskIds = [
      ...container.querySelectorAll(".gestik-swipe-hint__trail"),
    ].map((trail) => {
      const mask = trail.querySelector("mask");
      const gradient = trail.querySelector("linearGradient");

      expect(trail.querySelector("path")?.getAttribute("mask")).toBe(
        `url(#${mask?.id})`
      );
      expect(mask?.querySelector("rect")?.getAttribute("fill")).toBe(
        `url(#${gradient?.id})`
      );
      return mask?.id;
    });

    expect(new Set(maskIds).size).toBe(2);
  });

  it("applies finite playback settings and can pause and resume", () => {
    const { container, rerender } = render(
      <SwipeHint duration={1400} iterations={2} playing={false} />
    );
    const hint = container.firstElementChild as HTMLElement;

    expect(hint.style.getPropertyValue("--gestik-swipe-hint-duration")).toBe(
      "1400ms"
    );
    expect(hint.style.getPropertyValue("--gestik-swipe-hint-iterations")).toBe(
      "2"
    );
    expect(hint.style.getPropertyValue("--gestik-swipe-hint-play-state")).toBe(
      "paused"
    );

    rerender(<SwipeHint duration={1400} iterations={2} playing />);

    expect(hint.style.getPropertyValue("--gestik-swipe-hint-play-state")).toBe(
      "running"
    );
  });

  it("clears inline playback overrides when the caller restores CSS defaults", () => {
    const { container, rerender } = render(
      <SwipeHint duration={900} iterations={1} playing={false} />
    );
    const hint = container.firstElementChild as HTMLElement;

    rerender(<SwipeHint />);

    expect(hint.style.getPropertyValue("--gestik-swipe-hint-duration")).toBe(
      ""
    );
    expect(hint.style.getPropertyValue("--gestik-swipe-hint-iterations")).toBe(
      ""
    );
    expect(hint.style.getPropertyValue("--gestik-swipe-hint-play-state")).toBe(
      ""
    );
  });
});
