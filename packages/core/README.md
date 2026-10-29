# @gestik/core

Framework-independent animation assets for Gestik adapters. This private workspace package is not published yet.

```ts
import {
  SWIPE_HINT_DEFAULTS,
  POINTING_HAND_OUTLINE,
  POINTING_HAND_SILHOUETTE,
  POINTING_HAND_SURFACE,
} from "@gestik/core";

import "@gestik/core/styles/swipe-hint.css";
```

The JavaScript entry point exports SVG geometry, silhouettes, normalized contact points, scene defaults, and shortcut layout calculations. It is safe to import without a browser and has no runtime dependencies. It does not render elements.

Each hint has a separate CSS export under `@gestik/core/styles/`. Adapters render the corresponding scene structure and classes, allocate unique IDs, and translate their public playback options into `--gestik-*` CSS variable overrides. Keep omitted playback options unset inline so stylesheets can supply defaults. The stylesheets also implement reduced motion.

React consumers should use `@gestik/react`, which includes the selected styles automatically. See the [architecture decision](../../docs/architecture.md) for ownership, tradeoffs, and future adapter boundaries.
