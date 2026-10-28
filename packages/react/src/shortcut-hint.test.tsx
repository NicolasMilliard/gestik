/** @vitest-environment jsdom */

import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ShortcutHint } from "./shortcut-hint";

describe(ShortcutHint, () => {
  afterEach(cleanup);

  it("shows Command and K by default and keeps the hint decorative", () => {
    const { container } = render(<ShortcutHint />);
    const hint = container.firstElementChild as HTMLElement;
    const keycaps = container.querySelectorAll("kbd");

    expect(keycaps).toHaveLength(2);
    expect(keycaps[0].querySelector("svg")?.getAttribute("fill")).toBe(
      "currentColor"
    );
    expect(keycaps[0].querySelector("svg")?.getAttribute("focusable")).toBe(
      "false"
    );
    expect(keycaps[1].textContent).toBe("K");
    expect([
      hint.getAttribute("aria-hidden"),
      hint.hasAttribute("inert"),
      container.querySelector("[tabindex]"),
    ]).toStrictEqual(["true", true, null]);
  });

  it("renders longer combinations in order and sizes the row to fit", () => {
    const { container } = render(
      <ShortcutHint keys={["Ctrl", "Shift", "Alt", "K"]} />
    );
    const hint = container.firstElementChild as HTMLElement;

    expect(
      [...container.querySelectorAll("kbd")].map((keycap) => keycap.textContent)
    ).toStrictEqual(["Ctrl", "Shift", "Alt", "K"]);
    expect(
      container.querySelectorAll(".gestik-shortcut-hint__separator")
    ).toHaveLength(3);
    expect(Number(hint.style.width.replace("px", ""))).toBeGreaterThan(112);
    expect(hint.style.height).toBe("72px");
  });

  it("supports custom artwork and repeated key labels", () => {
    const { container } = render(
      <ShortcutHint
        keys={[
          <svg key="custom" data-testid="custom-key" viewBox="0 0 24 24" />,
          "K",
          "K",
        ]}
      />
    );

    expect(
      container.querySelector('[data-testid="custom-key"]')
    ).not.toBeNull();
    expect(container.querySelectorAll("kbd")).toHaveLength(3);
    expect(container.textContent).toBe("+K+K");
  });

  it.each([[], ["K"]])("rejects fewer than two keys (%j)", (...keys) => {
    expect(() => {
      // @ts-expect-error Exercise the same minimum-length contract for JavaScript callers.
      render(<ShortcutHint keys={keys} />);
    }).toThrow("ShortcutHint requires at least two keycaps.");
  });

  it("scales the whole row proportionally at a requested width", () => {
    const { container, rerender } = render(<ShortcutHint size={168} />);
    const hint = container.firstElementChild as HTMLElement;

    expect([hint.style.width, hint.style.height]).toStrictEqual([
      "168px",
      "108px",
    ]);

    rerender(<ShortcutHint keys={["Command", "Shift", "K"]} size={168} />);

    expect(hint.style.width).toBe("168px");
    expect(Number(hint.style.height.replace("px", ""))).toBeLessThan(108);
  });

  it("pauses and resumes without replacing the keycaps, and restores CSS defaults", () => {
    const { container, rerender } = render(
      <ShortcutHint
        className="custom-hint"
        duration={1800}
        iterations={2}
        playing={false}
      />
    );
    const hint = container.firstElementChild as HTMLElement;
    const firstKey = hint.querySelector("kbd");

    expect(hint.classList.contains("custom-hint")).toBeTruthy();
    expect([
      hint.style.getPropertyValue("--gestik-shortcut-hint-duration"),
      hint.style.getPropertyValue("--gestik-shortcut-hint-iterations"),
      hint.style.getPropertyValue("--gestik-shortcut-hint-play-state"),
    ]).toStrictEqual(["1800ms", "2", "paused"]);

    rerender(<ShortcutHint duration={1800} iterations={2} playing />);

    expect(hint.querySelector("kbd")).toBe(firstKey);
    expect(
      hint.style.getPropertyValue("--gestik-shortcut-hint-play-state")
    ).toBe("running");

    rerender(<ShortcutHint />);

    expect([
      hint.style.getPropertyValue("--gestik-shortcut-hint-duration"),
      hint.style.getPropertyValue("--gestik-shortcut-hint-iterations"),
      hint.style.getPropertyValue("--gestik-shortcut-hint-play-state"),
    ]).toStrictEqual(["", "", ""]);
  });
});
