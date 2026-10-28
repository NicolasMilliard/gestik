/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { HoldHintDemo } from "./hold-hint-demo";

describe(HoldHintDemo, () => {
  afterEach(cleanup);

  it("updates the size and duration through controls with stable accessible names", () => {
    const { container } = render(<HoldHintDemo />);
    fireEvent.change(screen.getByRole("slider", { name: "Size" }), {
      target: { value: "168" },
    });
    fireEvent.change(screen.getByRole("slider", { name: "Duration" }), {
      target: { value: "4200" },
    });
    const hint = container.querySelector(".gestik-hold-hint") as HTMLElement;

    expect(hint.style.width).toBe("168px");
    expect(hint.style.getPropertyValue("--gestik-hold-hint-duration")).toBe(
      "4200ms"
    );
    expect(screen.getByRole("slider", { name: "Size" })).toBeDefined();
    expect(screen.getByRole("slider", { name: "Duration" })).toBeDefined();
    expect(container.querySelector("code")?.textContent).toContain(
      "duration={4200}"
    );
  });

  it("pauses, resumes, and replays the preview", () => {
    const { container } = render(<HoldHintDemo />);
    const hint = container.querySelector(".gestik-hold-hint") as HTMLElement;
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));

    expect(hint.style.getPropertyValue("--gestik-hold-hint-play-state")).toBe(
      "paused"
    );
    fireEvent.click(screen.getByRole("button", { name: "Resume" }));
    expect(container.querySelector(".gestik-hold-hint")).toBe(hint);
    expect(hint.style.getPropertyValue("--gestik-hold-hint-play-state")).toBe(
      "running"
    );

    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    fireEvent.click(screen.getByRole("button", { name: "Replay" }));

    expect(container.querySelector(".gestik-hold-hint")).not.toBe(hint);
    expect(screen.getByRole("button", { name: "Pause" })).toBeDefined();
  });
});
