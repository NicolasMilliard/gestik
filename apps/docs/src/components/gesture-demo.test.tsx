/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { DragHintDemo } from "./drag-hint-demo";
import { SwipeHintDemo } from "./swipe-hint-demo";

describe("Gesture preview controls", () => {
  afterEach(cleanup);

  it.each([DragHintDemo, SwipeHintDemo])(
    "keeps slider names stable when their displayed values change (%s)",
    (Demo) => {
      render(<Demo />);
      const size = screen.getByRole("slider", { name: "Size" });
      const duration = screen.getByRole("slider", {
        name: "Duration",
      });

      fireEvent.change(size, { target: { value: "168" } });
      fireEvent.change(duration, { target: { value: "3200" } });

      expect(screen.getByRole("slider", { name: "Size" })).toBe(size);
      expect(screen.getByRole("slider", { name: "Duration" })).toBe(duration);
      expect(screen.getByText("168px")).toBeDefined();
      expect(screen.getByText("3200ms")).toBeDefined();
    }
  );

  it("keeps labels unambiguous when the gesture previews share a page", () => {
    const { container } = render(
      <>
        <DragHintDemo />
        <SwipeHintDemo />
      </>
    );
    const ids = [...container.querySelectorAll("[id]")].map(({ id }) => id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(screen.getAllByRole("slider", { name: "Size" })).toHaveLength(2);
    expect(screen.getAllByRole("combobox", { name: "Direction" })).toHaveLength(
      2
    );
  });
});
