# @gestik/react

Animated gesture hints for React interfaces. Show users how to drag, hold, resize, scroll, swipe, and use keyboard shortcuts.

Gestik demonstrates the movement a person makes to interact. Your application handles the gesture and decides when to show the hint.

## Installation

```sh
bun add @gestik/react
```

Requires React 18 or 19. Named imports include the selected hints' CSS automatically; no separate stylesheet import is needed. `@gestik/core` is installed as a dependency.

## Usage

```tsx
import { SwipeHint } from "@gestik/react";

export const SwipeInstruction = () => (
  <div>
    <p>Swipe left to see the next item.</p>
    <SwipeHint direction="left" iterations={2} />
  </div>
);
```

Available components: `DragHint`, `HoldHint`, `ResizeHint`, `ScrollHint`, `ShortcutHint`, and `SwipeHint`.

All hints accept `size`, `duration`, `iterations`, `playing`, `className`, and a typed `style` object with React CSS properties and `--gestik-*` variables. Swipe, hold, resize, and scroll accept custom static artwork through `icon`; drag uses paired `icons`, and shortcut uses `keys`. Contact-based gestures accept a normalized `hotspot`. Drag, hold, and resize generate cutouts automatically from supported static inline SVG artwork.

The hints are decorative, hidden from the accessibility tree, and outside the tab order. They become static when the user prefers reduced motion. Pair them with visible instructions and accessible controls. Use finite iterations or provide a way to pause or dismiss looping hints.

Explore the [interactive docs](https://nicolasmilliard.github.io/gestik/) for each gesture, timing, styling, and custom artwork examples. See the [complete props and artwork contracts](https://github.com/NicolasMilliard/gestik/blob/main/docs/props.md) for defaults and limitations.

Source and contributions: [NicolasMilliard/gestik](https://github.com/NicolasMilliard/gestik). Report bugs or propose gestures in the [issue tracker](https://github.com/NicolasMilliard/gestik/issues).

## License

MIT. See [LICENSE](LICENSE).
