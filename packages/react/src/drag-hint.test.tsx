/** @vitest-environment jsdom */

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { DragHint } from "./drag-hint";

describe(DragHint, () => {
  afterEach(cleanup);

  it("is decorative and drags right by default", () => {
    const { container } = render(<DragHint />);
    const hint = container.firstElementChild as HTMLElement | null;

    expect(hint?.getAttribute("aria-hidden")).toBe("true");
    expect(hint?.dataset.direction).toBe("right");
  });

  it("reserves proportional space at a custom size", () => {
    const { container } = render(<DragHint direction="left" size={84} />);
    const hint = container.firstElementChild as HTMLElement | null;

    expect(hint?.dataset.direction).toBe("left");
    expect(hint?.style.width).toBe("84px");
    expect(hint?.style.height).toBe("54px");
  });

  it("renders custom poses at the requested hotspot", () => {
    const { container } = render(
      <DragHint
        className="custom-hint"
        icons={{
          grabbing: <svg data-testid="grabbing-pose" />,
          idle: <svg data-testid="idle-pose" />,
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

    const anchor = container.querySelector<HTMLElement>(
      ".gestik-drag-hint__icon-anchor"
    );
    expect(anchor?.style.transform).toBe("translate(-25%, -75%)");
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
