/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { DragHintDemo } from "./drag-hint-demo";
import { HoldHintDemo } from "./hold-hint-demo";
import { ResizeHintDemo } from "./resize-hint-demo";
import { ScrollHintDemo } from "./scroll-hint-demo";
import { SwipeHintDemo } from "./swipe-hint-demo";

describe("Gesture preview controls", () => {
  afterEach(cleanup);

  it.each([
    DragHintDemo,
    HoldHintDemo,
    ResizeHintDemo,
    ScrollHintDemo,
    SwipeHintDemo,
  ])(
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

  it.each([HoldHintDemo, ResizeHintDemo, ScrollHintDemo])(
    "can preview custom artwork and restore the default (%s)",
    (Demo) => {
      const { container } = render(<Demo />);
      const toggle = screen.getByRole("button", { name: "Custom icon" });
      fireEvent.click(toggle);

      expect(toggle.getAttribute("aria-pressed")).toBe("true");
      expect(
        container.querySelector(
          '.playground-preview path[d="M4 2V26L10 20L15 30L20 27L15 17H25Z"]'
        )
      ).not.toBeNull();
      expect(container.querySelector("code")?.textContent).toContain(
        "icon={<CursorArtwork />}"
      );

      fireEvent.click(toggle);
      expect(toggle.getAttribute("aria-pressed")).toBe("false");
      expect(container.querySelector("code")?.textContent).not.toContain(
        "icon="
      );
    }
  );

  it.each([HoldHintDemo, ScrollHintDemo])(
    "keeps duplicate previews' labels and IDs distinct (%s)",
    (Demo) => {
      const { container } = render(
        <>
          <Demo />
          <Demo />
        </>
      );
      const ids = [...container.querySelectorAll("[id]")].map(({ id }) => id);

      expect(new Set(ids).size).toBe(ids.length);
      expect(screen.getAllByRole("slider", { name: "Size" })).toHaveLength(2);
      expect(screen.getAllByRole("slider", { name: "Duration" })).toHaveLength(
        2
      );
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
