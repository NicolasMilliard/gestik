/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ShortcutHintDemo } from "./shortcut-hint-demo";

describe(ShortcutHintDemo, () => {
  afterEach(cleanup);

  it("starts with Command + K and supports longer combinations through its labeled control", () => {
    const { container } = render(<ShortcutHintDemo />);

    expect(screen.getByText("Press Command + K to open search.")).toBeDefined();
    expect(container.querySelectorAll("kbd")).toHaveLength(2);

    fireEvent.change(screen.getByRole("slider", { name: "Keycaps" }), {
      target: { value: "4" },
    });

    expect(container.querySelectorAll("kbd")).toHaveLength(4);
    expect(
      screen.getByText("Press Command + Shift + Alt + K together.")
    ).toBeDefined();
    expect(container.querySelector("code")?.textContent).toContain(
      'keys={["Command","Shift","Alt","K"]}'
    );
  });

  it("connects size and duration labels and replays a paused animation", () => {
    const { container } = render(<ShortcutHintDemo />);
    fireEvent.change(screen.getByRole("slider", { name: "Size" }), {
      target: { value: "168" },
    });
    fireEvent.change(screen.getByRole("slider", { name: "Duration" }), {
      target: { value: "3200" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    const hint = container.querySelector(
      ".gestik-shortcut-hint"
    ) as HTMLElement;

    expect(hint.style.width).toBe("168px");
    expect(hint.style.getPropertyValue("--gestik-shortcut-hint-duration")).toBe(
      "3200ms"
    );
    expect(
      hint.style.getPropertyValue("--gestik-shortcut-hint-play-state")
    ).toBe("paused");

    fireEvent.click(screen.getByRole("button", { name: "Replay" }));

    expect(container.querySelector(".gestik-shortcut-hint")).not.toBe(hint);
    expect(screen.getByRole("button", { name: "Pause" })).toBeDefined();
  });
});
