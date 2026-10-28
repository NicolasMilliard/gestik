import {
  DragHint,
  HoldHint,
  ScrollHint,
  ShortcutHint,
  SwipeHint,
} from "@gestik/react";

import { DragHintPage } from "../pages/drag-hint-page";
import { HoldHintPage } from "../pages/hold-hint-page";
import { ScrollHintPage } from "../pages/scroll-hint-page";
import { ShortcutHintPage } from "../pages/shortcut-hint-page";
import { SwipeHintPage } from "../pages/swipe-hint-page";

export const components = [
  {
    Page: DragHintPage,
    Preview: DragHint,
    name: "DragHint",
    path: "/drag-hint",
  },
  {
    Page: HoldHintPage,
    Preview: HoldHint,
    name: "HoldHint",
    path: "/hold-hint",
  },
  {
    Page: ScrollHintPage,
    Preview: ScrollHint,
    name: "ScrollHint",
    path: "/scroll-hint",
  },
  {
    Page: ShortcutHintPage,
    Preview: ShortcutHint,
    name: "ShortcutHint",
    path: "/shortcut-hint",
  },
  {
    Page: SwipeHintPage,
    Preview: SwipeHint,
    name: "SwipeHint",
    path: "/swipe-hint",
  },
].toSorted((a, b) => a.name.localeCompare(b.name));
