/** @vitest-environment jsdom */

import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ScrollHint } from "./scroll-hint";

describe(ScrollHint, () => {
  afterEach(cleanup);

  it("keeps the vertical movement cue decorative and non-focusable", () => {
    const { container } = render(<ScrollHint />);
    const hint = container.firstElementChild as HTMLElement;
    const artwork = container.querySelector("svg");

    expect(hint.getAttribute("aria-hidden")).toBe("true");
    expect(artwork?.getAttribute("focusable")).toBe("false");
    expect(artwork?.getAttribute("fill")).toBe("currentColor");
    expect(container.querySelector("[tabindex]")).toBeNull();
  });

  it("reserves proportional space at the default and custom sizes", () => {
    const { container, rerender } = render(<ScrollHint />);
    const hint = container.firstElementChild as HTMLElement;

    expect([hint.style.width, hint.style.height]).toStrictEqual([
      "112px",
      "88px",
    ]);

    rerender(<ScrollHint size={168} className="custom-hint" />);

    expect([hint.style.width, hint.style.height]).toStrictEqual([
      "168px",
      "132px",
    ]);
    expect(hint.classList.contains("custom-hint")).toBeTruthy();
  });

  it("pauses and resumes finite playback without replacing the artwork", () => {
    const { container, rerender } = render(
      <ScrollHint duration={1600} iterations={2} playing={false} />
    );
    const hint = container.firstElementChild as HTMLElement;
    const artwork = hint.querySelector("svg");

    expect(hint.style.getPropertyValue("--gestik-scroll-hint-duration")).toBe(
      "1600ms"
    );
    expect(hint.style.getPropertyValue("--gestik-scroll-hint-iterations")).toBe(
      "2"
    );
    expect(hint.style.getPropertyValue("--gestik-scroll-hint-play-state")).toBe(
      "paused"
    );

    rerender(<ScrollHint duration={1600} iterations={2} playing />);

    expect(hint.style.getPropertyValue("--gestik-scroll-hint-play-state")).toBe(
      "running"
    );
    expect(hint.querySelector("svg")).toBe(artwork);
  });

  it("restores CSS playback defaults when inline props are removed", () => {
    const { container, rerender } = render(
      <ScrollHint duration={800} iterations={1} playing={false} />
    );
    const hint = container.firstElementChild as HTMLElement;

    rerender(<ScrollHint />);

    expect(hint.style.getPropertyValue("--gestik-scroll-hint-duration")).toBe(
      ""
    );
    expect(hint.style.getPropertyValue("--gestik-scroll-hint-iterations")).toBe(
      ""
    );
    expect(hint.style.getPropertyValue("--gestik-scroll-hint-play-state")).toBe(
      ""
    );
  });
});
