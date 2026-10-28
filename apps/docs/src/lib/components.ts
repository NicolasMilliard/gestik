import { DragHint, ScrollHint, SwipeHint } from "@gestik/react";

import { DragHintPage } from "../pages/drag-hint-page";
import { ScrollHintPage } from "../pages/scroll-hint-page";
import { SwipeHintPage } from "../pages/swipe-hint-page";

export const components = [
  {
    Page: DragHintPage,
    Preview: DragHint,
    name: "DragHint",
    path: "/drag-hint",
  },
  {
    Page: ScrollHintPage,
    Preview: ScrollHint,
    name: "ScrollHint",
    path: "/scroll-hint",
  },
  {
    Page: SwipeHintPage,
    Preview: SwipeHint,
    name: "SwipeHint",
    path: "/swipe-hint",
  },
].toSorted((a, b) => a.name.localeCompare(b.name));
