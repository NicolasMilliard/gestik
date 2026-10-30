/** @vitest-environment jsdom */

import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
  RouterProvider,
} from "@tanstack/react-router";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import App from "@/app";
import { HomePage } from "@/pages/home-page";
import { createDocsRouter } from "@/router";

let activeRouter: ReturnType<typeof createDocsRouter> | undefined;

const renderAt = async (path: string) => {
  const pathname =
    path === "/" ? "/gestik/" : `/gestik${path.replace(/\/$/u, "")}/`;
  window.history.replaceState(null, "", pathname);
  const router = createDocsRouter({ basepath: "/gestik/" });
  activeRouter = router;
  await router.load();
  return { ...render(<RouterProvider router={router} />), router };
};

describe("Docs navigation", () => {
  beforeEach(() => {
    vi.spyOn(window, "scrollTo").mockImplementation(vi.fn());
    vi.stubGlobal("matchMedia", () =>
      Object.assign(new EventTarget(), { matches: false })
    );
  });

  afterEach(() => {
    cleanup();
    activeRouter?.history.destroy();
    activeRouter = undefined;
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    window.history.replaceState(null, "", "/");
  });

  it.each([
    ["npm", "npm install @gestik/react"],
    ["pnpm", "pnpm add @gestik/react"],
    ["yarn", "yarn add @gestik/react"],
    ["bun", "bun add @gestik/react"],
  ])("shows the install command for %s", async (manager, command) => {
    await renderAt("/");
    const button = screen.getByRole("button", { name: manager });
    fireEvent.click(button);

    expect(screen.getByText("@gestik/react").closest("code")?.textContent).toBe(
      command
    );
    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getAllByRole("button", { pressed: true })).toHaveLength(1);
  });

  it("opens and closes the mobile navigation with its button", async () => {
    await renderAt("/");
    const toggle = screen.getByRole("button", { name: "Open navigation" });

    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(toggle);
    await expect(
      screen.findByRole("dialog", { name: "Documentation menu" })
    ).resolves.toBeDefined();
    expect(toggle.getAttribute("aria-expanded")).toBe("true");

    fireEvent.click(screen.getByRole("button", { name: "Close navigation" }));
    expect(
      screen
        .getByRole("button", { name: "Open navigation" })
        .getAttribute("aria-expanded")
    ).toBe("false");
  });

  it("closes navigation with Escape and returns focus to the menu button", async () => {
    await renderAt("/");
    const toggle = screen.getByRole("button", { name: "Open navigation" });
    fireEvent.click(toggle);
    await screen.findByRole("dialog", { name: "Documentation menu" });
    within(screen.getByRole("navigation", { name: "Documentation" }))
      .getByRole("link", { name: "Overview" })
      .focus();

    fireEvent.keyDown(document.activeElement ?? document.body, {
      key: "Escape",
    });

    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    await waitFor(() => expect(document.activeElement).toBe(toggle));
  });

  it.each([
    ["Overview", "/"],
    ["DragHint", "/drag-hint"],
    ["HoldHint", "/hold-hint"],
    ["ResizeHint", "/resize-hint"],
    ["ScrollHint", "/scroll-hint"],
    ["ShortcutHint", "/shortcut-hint"],
    ["SwipeHint", "/swipe-hint"],
  ])("closes navigation after choosing %s", async (name, path) => {
    await renderAt("/");
    const toggle = screen.getByRole("button", { name: "Open navigation" });
    fireEvent.click(toggle);
    await screen.findByRole("dialog", { name: "Documentation menu" });

    fireEvent.click(
      within(
        screen.getByRole("navigation", { name: "Documentation" })
      ).getByRole("link", { name })
    );

    await (path === "/"
      ? screen.findByRole("region", { name: "Components" })
      : screen.findByRole("heading", { level: 1, name }));
    expect(window.location.pathname).toBe(
      path === "/" ? "/gestik/" : `/gestik${path}/`
    );
    expect(window.location.hash).toBe("");
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("focuses the destination content after navigating from the mobile menu", async () => {
    await renderAt("/");
    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    const menu = await screen.findByRole("dialog", {
      name: "Documentation menu",
    });

    fireEvent.click(within(menu).getByRole("link", { name: "SwipeHint" }));

    await screen.findByRole("heading", { level: 1, name: "SwipeHint" });
    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByRole("main"))
    );
  });

  it.each([
    ["/drag-hint", "DragHint"],
    ["/hold-hint", "HoldHint"],
    ["/resize-hint", "ResizeHint"],
    ["/scroll-hint", "ScrollHint"],
    ["/shortcut-hint", "ShortcutHint"],
    ["/swipe-hint", "SwipeHint"],
  ])(
    "loads the preview for a direct component URL (%s)",
    async (path, name) => {
      await renderAt(path);

      await expect(
        screen.findByRole("region", { name: `Interactive ${name} preview` })
      ).resolves.toBeDefined();
    }
  );

  it.each([
    ["/drag-hint", "DragHint"],
    ["/hold-hint", "HoldHint"],
    ["/resize-hint", "ResizeHint"],
    ["/scroll-hint", "ScrollHint"],
    ["/shortcut-hint", "ShortcutHint"],
    ["/swipe-hint", "SwipeHint"],
  ])("identifies the active page at %s", async (path, name) => {
    await renderAt(path);
    await screen.findByRole("heading", { level: 1, name });
    expect(
      screen.getByRole("link", { name }).getAttribute("aria-current")
    ).toBe("page");
    expect(
      screen
        .getByRole("link", { name: "Overview" })
        .getAttribute("aria-current")
    ).toBeNull();
  });

  it("navigates from gallery and sidebar links and focuses the new content", async () => {
    await renderAt("/");
    const gallery = screen.getByRole("region", { name: "Components" });
    fireEvent.click(within(gallery).getByRole("link", { name: "DragHint" }));

    await expect(
      screen.findByRole("heading", {
        level: 1,
        name: "DragHint",
      })
    ).resolves.toBeDefined();
    expect(window.location.pathname).toBe("/gestik/drag-hint/");
    expect(document.activeElement).toBe(screen.getByRole("main"));
    expect(window.scrollTo).toHaveBeenLastCalledWith({
      behavior: "instant",
      left: 0,
      top: 0,
    });

    fireEvent.click(screen.getByRole("link", { name: "SwipeHint" }));
    await screen.findByRole("heading", { level: 1, name: "SwipeHint" });
    expect(window.location.pathname).toBe("/gestik/swipe-hint/");
  });

  it("follows browser back and forward through component and home pages", async () => {
    await renderAt("/");
    const gallery = screen.getByRole("region", { name: "Components" });
    fireEvent.click(within(gallery).getByRole("link", { name: "DragHint" }));
    await screen.findByRole("heading", { level: 1, name: "DragHint" });
    fireEvent.click(screen.getByRole("link", { name: "SwipeHint" }));
    await screen.findByRole("heading", { level: 1, name: "SwipeHint" });

    window.history.back();
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { level: 1, name: "DragHint" })
      ).toBeDefined();
    });
    window.history.back();
    await waitFor(() => {
      expect(screen.getByRole("region", { name: "Components" })).toBeDefined();
    });
    window.history.forward();
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { level: 1, name: "DragHint" })
      ).toBeDefined();
    });
  });

  it("offers a way home from an unknown URL", async () => {
    await renderAt("/missing-component");

    expect(
      screen.getByRole("heading", { name: "Page not found" })
    ).toBeDefined();
    fireEvent.click(screen.getByRole("link", { name: "Back to overview" }));
    await screen.findByRole("region", { name: "Components" });
    expect(window.location.pathname).toBe("/gestik/");
    expect(screen.getByRole("region", { name: "Components" })).toBeDefined();
  });

  it("skips to the main content without changing the component URL", async () => {
    await renderAt("/drag-hint");
    await screen.findByRole("heading", { level: 1, name: "DragHint" });

    fireEvent.click(screen.getByRole("link", { name: "Skip to content" }));

    expect(document.activeElement).toBe(screen.getByRole("main"));
    expect(window.location.pathname).toBe("/gestik/drag-hint/");
    expect(
      screen.getByRole("heading", { level: 1, name: "DragHint" })
    ).toBeDefined();
  });

  it("retains the current page while an uncached TanStack route loads", async () => {
    let available = false;
    let requested = false;
    const DeferredPage = lazyRouteComponent(async () => {
      requested = true;
      await vi.waitUntil(() => available);
      return {
        default: () => (
          <>
            <title>Deferred page — Gestik</title>
            <h1>Deferred page</h1>
          </>
        ),
      };
    });
    const rootRoute = createRootRoute({ component: App });
    const homeRoute = createRoute({
      component: HomePage,
      getParentRoute: () => rootRoute,
      path: "/",
    });
    const nextRoute = createRoute({
      component: DeferredPage,
      getParentRoute: () => rootRoute,
      path: "/swipe-hint/",
    });
    const router = createRouter({
      basepath: "/gestik/",
      defaultPendingMs: Number.POSITIVE_INFINITY,
      history: createMemoryHistory({ initialEntries: ["/gestik/"] }),
      routeTree: rootRoute.addChildren([homeRoute, nextRoute]),
      trailingSlash: "always",
    });
    await router.load();
    render(<RouterProvider router={router} />);
    const homeContent = screen.getByRole("region", { name: "Components" });
    const homeTitle = document.title;
    fireEvent.click(
      within(screen.getByRole("region", { name: "Components" })).getByRole(
        "link",
        { name: "SwipeHint" }
      )
    );
    await vi.waitUntil(() => requested);

    expect(screen.getByRole("region", { name: "Components" })).toBe(
      homeContent
    );
    expect(document.title).toBe(homeTitle);
    available = true;
    await expect(
      screen.findByRole("heading", { name: "Deferred page" })
    ).resolves.toBeDefined();
    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByRole("main"));
    });
    router.history.destroy();
  });

  it("navigates without native view transitions", async () => {
    const transition = vi.fn<
      (update: () => Promise<void>) => { updateCallbackDone: Promise<void> }
    >((update) => ({ updateCallbackDone: update() }));
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      value: transition,
    });
    try {
      await renderAt("/");
      fireEvent.click(
        within(screen.getByRole("region", { name: "Components" })).getByRole(
          "link",
          { name: "SwipeHint" }
        )
      );
      await screen.findByRole("heading", { level: 1, name: "SwipeHint" });
      fireEvent.click(screen.getByRole("link", { name: "Overview" }));
      await screen.findByRole("region", { name: "Components" });
      expect(transition).not.toHaveBeenCalled();
    } finally {
      Reflect.deleteProperty(document, "startViewTransition");
    }
  });
});
