/** @vitest-environment jsdom */

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { HashRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import App from "./app";

const renderAt = (path: string) => {
  window.history.replaceState(null, "", `/gestik/#${path}`);
  return render(
    <HashRouter>
      <App />
    </HashRouter>
  );
};

describe("Docs navigation", () => {
  beforeEach(() => {
    vi.spyOn(window, "scrollTo").mockImplementation(vi.fn());
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    window.history.replaceState(null, "", "/");
  });

  it("shows an alphabetical live gallery without playground controls on the home page", () => {
    renderAt("/");

    const gallery = screen.getByRole("region", { name: "Components" });
    const links = within(gallery).getAllByRole("link");

    expect(
      links.map((link) => [
        within(link).getByRole("heading").textContent,
        link.getAttribute("href"),
      ])
    ).toStrictEqual([
      ["DragHint", "#/drag-hint"],
      ["ScrollHint", "#/scroll-hint"],
      ["ShortcutHint", "#/shortcut-hint"],
      ["SwipeHint", "#/swipe-hint"],
    ]);
    expect(
      gallery.querySelectorAll(
        ".gestik-drag-hint, .gestik-scroll-hint, .gestik-shortcut-hint, .gestik-swipe-hint"
      )
    ).toHaveLength(4);
    expect(screen.queryByRole("slider")).toBeNull();
    expect(screen.queryByRole("heading", { name: "Props" })).toBeNull();
    expect(
      screen
        .getByRole("link", { name: "Overview" })
        .getAttribute("aria-current")
    ).toBe("page");
  });

  it.each([
    ["npm", "npm install @gestik/react"],
    ["pnpm", "pnpm add @gestik/react"],
    ["yarn", "yarn add @gestik/react"],
    ["bun", "bun add @gestik/react"],
  ])("shows the install command for %s", (manager, command) => {
    renderAt("/");
    const button = screen.getByRole("button", { name: manager });
    fireEvent.click(button);

    expect(screen.getByText("@gestik/react").closest("code")?.textContent).toBe(
      command
    );
    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getAllByRole("button", { pressed: true })).toHaveLength(1);
    expect(screen.getByText(/package is not published yet/u)).toBeDefined();
  });

  it("opens and closes the mobile navigation with its button", () => {
    renderAt("/");
    const toggle = screen.getByRole("button", { name: "Open navigation" });

    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(toggle);
    expect(
      screen
        .getByRole("button", { name: "Close navigation" })
        .getAttribute("aria-expanded")
    ).toBe("true");

    fireEvent.click(toggle);
    expect(
      screen
        .getByRole("button", { name: "Open navigation" })
        .getAttribute("aria-expanded")
    ).toBe("false");
  });

  it("closes navigation with Escape and returns focus to the menu button", () => {
    renderAt("/");
    const toggle = screen.getByRole("button", { name: "Open navigation" });
    fireEvent.click(toggle);
    within(screen.getByRole("navigation", { name: "Documentation" }))
      .getByRole("link", { name: "Overview" })
      .focus();

    fireEvent.keyDown(window, { key: "Escape" });

    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(toggle);
  });

  it.each([
    ["Overview", "/"],
    ["DragHint", "/drag-hint"],
    ["ScrollHint", "/scroll-hint"],
    ["ShortcutHint", "/shortcut-hint"],
    ["SwipeHint", "/swipe-hint"],
  ])("closes navigation after choosing %s", (name, path) => {
    renderAt("/");
    const toggle = screen.getByRole("button", { name: "Open navigation" });
    fireEvent.click(toggle);

    fireEvent.click(
      within(
        screen.getByRole("navigation", { name: "Documentation" })
      ).getByRole("link", { name })
    );

    expect(window.location.hash).toBe(`#${path}`);
    expect(window.location.pathname).toBe("/gestik/");
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  it.each([
    ["/drag-hint", "DragHint", "SwipeHint"],
    ["/scroll-hint", "ScrollHint", "SwipeHint"],
    ["/shortcut-hint", "ShortcutHint", "SwipeHint"],
    ["/swipe-hint", "SwipeHint", "DragHint"],
  ])(
    "opens %s directly with only its own documentation",
    (path, name, otherName) => {
      renderAt(path);

      expect(screen.getByRole("heading", { level: 1, name })).toBeDefined();
      expect([
        screen.queryByRole("heading", { name: otherName }),
        screen.queryByRole("heading", { name: "Show users how." }),
      ]).toStrictEqual([null, null]);
      expect(
        screen.getByRole("region", { name: `Interactive ${name} preview` })
      ).toBeDefined();
      expect(screen.getByRole("heading", { name: "Props" })).toBeDefined();
    }
  );

  it.each([
    ["/drag-hint", "DragHint"],
    ["/scroll-hint", "ScrollHint"],
    ["/shortcut-hint", "ShortcutHint"],
    ["/swipe-hint", "SwipeHint"],
  ])("identifies the active page at %s", (path, name) => {
    renderAt(path);
    expect(
      screen.getByRole("link", { name }).getAttribute("aria-current")
    ).toBe("page");
    expect(
      screen
        .getByRole("link", { name: "Overview" })
        .getAttribute("aria-current")
    ).toBeNull();
    expect(document.title).toBe(`${name} — Gestik`);
  });

  it("navigates from gallery and sidebar links and focuses the new content", () => {
    renderAt("/");
    const gallery = screen.getByRole("region", { name: "Components" });
    fireEvent.click(within(gallery).getByRole("link", { name: "DragHint" }));

    expect(window.location.hash).toBe("#/drag-hint");
    expect(
      screen.getByRole("heading", {
        name: "Filled, outline, and duotone icons",
      })
    ).toBeDefined();
    expect(document.activeElement).toBe(screen.getByRole("main"));
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);

    fireEvent.click(screen.getByRole("link", { name: "SwipeHint" }));
    expect(window.location.hash).toBe("#/swipe-hint");
  });

  it("follows browser back and forward through component and home pages", async () => {
    renderAt("/");
    const gallery = screen.getByRole("region", { name: "Components" });
    fireEvent.click(within(gallery).getByRole("link", { name: "DragHint" }));
    fireEvent.click(screen.getByRole("link", { name: "SwipeHint" }));

    window.history.back();
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { level: 1, name: "DragHint" })
      ).toBeDefined();
    });
    window.history.back();
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Show users how." })
      ).toBeDefined();
    });
    window.history.forward();
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { level: 1, name: "DragHint" })
      ).toBeDefined();
    });
  });

  it("offers a way home from an unknown URL", () => {
    renderAt("/missing-component");

    expect(
      screen.getByRole("heading", { name: "Page not found" })
    ).toBeDefined();
    fireEvent.click(screen.getByRole("link", { name: "Back to overview" }));
    expect(window.location.hash).toBe("#/");
    expect(screen.getByRole("region", { name: "Components" })).toBeDefined();
  });

  it("skips to the main content without replacing the component route", () => {
    renderAt("/drag-hint");

    fireEvent.click(screen.getByRole("link", { name: "Skip to content" }));

    expect(document.activeElement).toBe(screen.getByRole("main"));
    expect(window.location.hash).toBe("#/drag-hint");
    expect(
      screen.getByRole("heading", { level: 1, name: "DragHint" })
    ).toBeDefined();
  });
});
