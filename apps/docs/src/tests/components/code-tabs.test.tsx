/** @vitest-environment jsdom */

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { CodeTabs } from "@/components/content/code-tabs";

describe(CodeTabs, () => {
  afterEach(cleanup);

  it("starts with React and switches to its labeled CSS panel", () => {
    render(<CodeTabs code="<DragHint />" css=".hint { color: teal; }" />);
    const cssTab = screen.getByRole("tab", { name: "CSS" });

    expect(
      within(screen.getByRole("tabpanel", { name: "React" })).getByLabelText(
        "React code example"
      ).textContent
    ).toBe("<DragHint />");

    fireEvent.click(cssTab);
    const panel = screen.getByRole("tabpanel", { name: "CSS" });

    expect(screen.queryByRole("tabpanel", { name: "React" })).toBeNull();
    expect(cssTab.getAttribute("aria-selected")).toBe("true");
    expect(panel.id).toBe(cssTab.getAttribute("aria-controls"));
    expect(within(panel).getByLabelText("CSS code example").textContent).toBe(
      ".hint { color: teal; }"
    );
  });

  it("switches languages with the arrow keys", async () => {
    render(<CodeTabs code="<DragHint />" css=".hint {}" />);
    const reactTab = screen.getByRole("tab", { name: "React" });
    const cssTab = screen.getByRole("tab", { name: "CSS" });
    reactTab.focus();

    fireEvent.keyDown(reactTab, { key: "ArrowRight" });
    await waitFor(() => {
      expect(document.activeElement).toBe(cssTab);
    });
    expect(cssTab.getAttribute("aria-selected")).toBe("true");

    fireEvent.keyDown(cssTab, { key: "ArrowLeft" });
    await waitFor(() => {
      expect(document.activeElement).toBe(reactTab);
    });
    expect(reactTab.getAttribute("aria-selected")).toBe("true");
  });

  it("keeps multiple code panels independent with unique IDs", () => {
    const { container } = render(
      <>
        <CodeTabs code="<DragHint />" css=".drag {}" />
        <CodeTabs code="<HoldHint />" css=".hold {}" />
      </>
    );
    const lists = screen.getAllByRole("tablist");
    fireEvent.click(within(lists[0]).getByRole("tab", { name: "CSS" }));
    const ids = [...container.querySelectorAll("[id]")].map(({ id }) => id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(
      within(lists[1])
        .getByRole("tab", { name: "React" })
        .getAttribute("aria-selected")
    ).toBe("true");
    expect(screen.getAllByRole("tabpanel")).toHaveLength(2);
  });
});
