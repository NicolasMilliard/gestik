# @gestik/core

Framework-independent animation CSS, SVG geometry, defaults, and layout for Gestik gesture hints. Gestik demonstrates human movement; your application handles the gesture and decides when to show the hint.

React applications should install [`@gestik/react`](https://github.com/NicolasMilliard/gestik/tree/main/packages/react), which includes core and the selected styles automatically. Use core directly when building another adapter.

## Installation

```sh
bun add @gestik/core
```

## Usage

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

See the [interactive docs](https://nicolasmilliard.github.io/gestik/) and [architecture decision](https://github.com/NicolasMilliard/gestik/blob/main/docs/architecture.md) for ownership, tradeoffs, and adapter boundaries. Report bugs or propose gestures in the [issue tracker](https://github.com/NicolasMilliard/gestik/issues).

## License

MIT. See [LICENSE](LICENSE).
