/** @vitest-environment jsdom */

import { DragHint } from "@gestik/react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { HintExample } from "@/playgrounds/hint-example";

describe(HintExample, () => {
  afterEach(cleanup);

  it("pauses and resumes the current frame, then remounts on replay", () => {
    const { container } = render(
      <HintExample
        description="Drag to move."
        code="<DragHint />"
        css=".hint {}"
      >
        {(playing) => <DragHint playing={playing} />}
      </HintExample>
    );
    const hint = container.querySelector<HTMLElement>(".gestik-drag-hint");
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));

    expect(hint?.style.getPropertyValue("--gestik-drag-hint-play-state")).toBe(
      "paused"
    );
    fireEvent.click(screen.getByRole("button", { name: "Resume" }));
    expect(container.querySelector(".gestik-drag-hint")).toBe(hint);
    expect(hint?.style.getPropertyValue("--gestik-drag-hint-play-state")).toBe(
      "running"
    );

    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    fireEvent.click(screen.getByRole("button", { name: "Replay" }));
    expect(container.querySelector(".gestik-drag-hint")).not.toBe(hint);
    expect(screen.getByRole("button", { name: "Pause" })).toBeDefined();
  });
});
