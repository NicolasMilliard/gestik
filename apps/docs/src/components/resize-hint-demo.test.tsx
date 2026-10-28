/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ResizeHintDemo } from "./resize-hint-demo";

describe(ResizeHintDemo, () => {
  afterEach(cleanup);

  it("keeps slider labels connected to their own preview across instances", () => {
    const { container } = render(
      <>
        <ResizeHintDemo />
        <ResizeHintDemo />
      </>
    );
    const sizes = screen.getAllByRole("slider", { name: "Size" });
    const durations = screen.getAllByRole("slider", { name: "Duration" });
    const inputs = [...sizes, ...durations];

    expect(new Set(inputs.map((input) => input.id)).size).toBe(4);
    expect(
      inputs.every((input) =>
        container.querySelector(`label[for="${input.id}"]`)
      )
    ).toBeTruthy();
    fireEvent.change(sizes[1], { target: { value: "168" } });
    const hints = container.querySelectorAll<HTMLElement>(
      ".gestik-resize-hint"
    );

    expect([...hints].map((hint) => hint.style.width)).toStrictEqual([
      "112px",
      "168px",
    ]);
  });

  it("updates the size and duration through controls with stable accessible names", () => {
    const { container } = render(<ResizeHintDemo />);
    fireEvent.change(screen.getByRole("slider", { name: "Size" }), {
      target: { value: "168" },
    });
    fireEvent.change(screen.getByRole("slider", { name: "Duration" }), {
      target: { value: "4200" },
    });
    const hint = container.querySelector(".gestik-resize-hint") as HTMLElement;

    expect(hint.style.width).toBe("168px");
    expect(hint.style.getPropertyValue("--gestik-resize-hint-duration")).toBe(
      "4200ms"
    );
    expect(screen.getByRole("slider", { name: "Size" })).toBeDefined();
    expect(screen.getByRole("slider", { name: "Duration" })).toBeDefined();
    expect(container.querySelector("code")?.textContent).toContain(
      "duration={4200}"
    );
  });

  it("pauses, resumes, and replays the preview", () => {
    const { container } = render(<ResizeHintDemo />);
    const hint = container.querySelector(".gestik-resize-hint") as HTMLElement;
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));

    expect(hint.style.getPropertyValue("--gestik-resize-hint-play-state")).toBe(
      "paused"
    );
    fireEvent.click(screen.getByRole("button", { name: "Resume" }));
    expect(container.querySelector(".gestik-resize-hint")).toBe(hint);
    expect(hint.style.getPropertyValue("--gestik-resize-hint-play-state")).toBe(
      "running"
    );

    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    fireEvent.click(screen.getByRole("button", { name: "Replay" }));

    expect(container.querySelector(".gestik-resize-hint")).not.toBe(hint);
    expect(screen.getByRole("button", { name: "Pause" })).toBeDefined();
  });
});
