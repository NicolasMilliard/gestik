import {
  DragHint,
  HoldHint,
  ResizeHint,
  ScrollHint,
  ShortcutHint,
  SwipeHint,
} from "@gestik/react";
import { lazyRouteComponent } from "@tanstack/react-router";

export const components = (
  [
    {
      Page: lazyRouteComponent(
        () => import("@/pages/drag-hint-page"),
        "DragHintPage"
      ),
      Preview: DragHint,
      name: "DragHint",
      path: "/drag-hint/",
    },
    {
      Page: lazyRouteComponent(
        () => import("@/pages/hold-hint-page"),
        "HoldHintPage"
      ),
      Preview: HoldHint,
      name: "HoldHint",
      path: "/hold-hint/",
    },
    {
      Page: lazyRouteComponent(
        () => import("@/pages/resize-hint-page"),
        "ResizeHintPage"
      ),
      Preview: ResizeHint,
      name: "ResizeHint",
      path: "/resize-hint/",
    },
    {
      Page: lazyRouteComponent(
        () => import("@/pages/scroll-hint-page"),
        "ScrollHintPage"
      ),
      Preview: ScrollHint,
      name: "ScrollHint",
      path: "/scroll-hint/",
    },
    {
      Page: lazyRouteComponent(
        () => import("@/pages/shortcut-hint-page"),
        "ShortcutHintPage"
      ),
      Preview: ShortcutHint,
      name: "ShortcutHint",
      path: "/shortcut-hint/",
    },
    {
      Page: lazyRouteComponent(
        () => import("@/pages/swipe-hint-page"),
        "SwipeHintPage"
      ),
      Preview: SwipeHint,
      name: "SwipeHint",
      path: "/swipe-hint/",
    },
  ] as const
).toSorted((a, b) => a.name.localeCompare(b.name));
