import { DragHint, SwipeHint } from "@gestik/react";

import { DragHintPage } from "../pages/drag-hint-page";
import { SwipeHintPage } from "../pages/swipe-hint-page";

export const components = [
  {
    Page: DragHintPage,
    Preview: DragHint,
    name: "DragHint",
    path: "/drag-hint",
  },
  {
    Page: SwipeHintPage,
    Preview: SwipeHint,
    name: "SwipeHint",
    path: "/swipe-hint",
  },
].toSorted((a, b) => a.name.localeCompare(b.name));
