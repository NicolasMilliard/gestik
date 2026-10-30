/** @vitest-environment jsdom */

import {
  createMemoryHistory,
  RouterContextProvider,
} from "@tanstack/react-router";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DocsSidebar } from "@/components/layout/docs-sidebar";
import { createDocsRouter } from "@/router";

const renderSidebar = () => {
  const router = createDocsRouter({
    basepath: "/gestik/",
    history: createMemoryHistory({ initialEntries: ["/gestik/"] }),
  });
  return render(
    <RouterContextProvider router={router}>
      <DocsSidebar />
      <button type="button">Page action</button>
    </RouterContextProvider>
  );
};

describe(DocsSidebar, () => {
  beforeEach(() => {
    vi.stubGlobal("matchMedia", () =>
      Object.assign(new EventTarget(), { matches: false })
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    window.history.replaceState(null, "", "/");
  });

  it("restores focus to the menu button while the destination page loads", async () => {
    renderSidebar();
    const toggle = screen.getByRole("button", { name: "Open navigation" });
    fireEvent.click(toggle);
    await screen.findByRole("dialog", { name: "Documentation menu" });
    const destination = within(
      screen.getByRole("navigation", { name: "Documentation" })
    ).getByRole("link", { name: "ResizeHint" });
    destination.focus();

    fireEvent.click(destination);

    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    await waitFor(() => expect(document.activeElement).toBe(toggle));
  });

  it("locks page scrolling and hides page actions until the menu closes", async () => {
    renderSidebar();
    const originalOverflow = document.body.style.overflowY;
    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    await screen.findByRole("dialog", { name: "Documentation menu" });

    await waitFor(() => expect(document.body.style.overflowY).toBe("hidden"));
    expect(screen.queryByRole("button", { name: "Page action" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Close navigation" }));

    await waitFor(() =>
      expect(document.body.style.overflowY).toBe(originalOverflow)
    );
    expect(screen.getByRole("button", { name: "Page action" })).toBeDefined();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes the mobile menu and releases the page when resized to desktop", async () => {
    const desktop = Object.assign(new EventTarget(), { matches: false });
    vi.stubGlobal("matchMedia", () => desktop);
    renderSidebar();
    const originalOverflow = document.body.style.overflowY;
    const toggle = screen.getByRole("button", { name: "Open navigation" });
    fireEvent.click(toggle);
    await screen.findByRole("dialog", { name: "Documentation menu" });

    act(() => {
      desktop.matches = true;
      desktop.dispatchEvent(new Event("change"));
    });

    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("dialog")).toBeNull();
    await waitFor(() =>
      expect(document.body.style.overflowY).toBe(originalOverflow)
    );
    expect(screen.getByRole("button", { name: "Page action" })).toBeDefined();
  });

  it("releases the page scroll lock when unmounted with the menu open", async () => {
    const { unmount } = renderSidebar();
    const originalOverflow = document.body.style.overflowY;
    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    await screen.findByRole("dialog", { name: "Documentation menu" });
    await waitFor(() => expect(document.body.style.overflowY).toBe("hidden"));

    unmount();

    await waitFor(() =>
      expect(document.body.style.overflowY).toBe(originalOverflow)
    );
  });
});
