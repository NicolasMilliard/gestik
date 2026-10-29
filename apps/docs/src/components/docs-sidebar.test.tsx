/** @vitest-environment jsdom */

import {
  createMemoryHistory,
  RouterContextProvider,
} from "@tanstack/react-router";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { createDocsRouter } from "../router";
import { DocsSidebar } from "./docs-sidebar";

describe(DocsSidebar, () => {
  afterEach(() => {
    cleanup();
    window.history.replaceState(null, "", "/");
  });

  it("restores focus to the menu button while the destination page loads", () => {
    const router = createDocsRouter({
      basepath: "/gestik/",
      history: createMemoryHistory({ initialEntries: ["/gestik/"] }),
    });
    render(
      <RouterContextProvider router={router}>
        <DocsSidebar />
      </RouterContextProvider>
    );
    const toggle = screen.getByRole("button", { name: "Open navigation" });
    fireEvent.click(toggle);
    const destination = within(
      screen.getByRole("navigation", { name: "Documentation" })
    ).getByRole("link", { name: "ResizeHint" });
    destination.focus();

    fireEvent.click(destination);

    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(toggle);
  });
});
