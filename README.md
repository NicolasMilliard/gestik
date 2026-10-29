# Gestik

[![CI](https://github.com/NicolasMilliard/gestik/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/NicolasMilliard/gestik/actions/workflows/ci.yml)

Animated gesture hints for React interfaces. Show users how to drag, hold, resize, swipe, and scroll.

Gestik demonstrates the movement a person makes to interact. Your application handles the gesture and decides when to show the hint.

**[Explore the interactive docs](https://nicolasmilliard.github.io/gestik/)** to try each animation, adjust its settings, and see its props and examples.

## Components

| Component | Movement | Playground |
| --- | --- | --- |
| `DragHint` | Drag an element from one position to another | [Try DragHint](https://nicolasmilliard.github.io/gestik/drag-hint/) |
| `HoldHint` | Press and keep a finger in place | [Try HoldHint](https://nicolasmilliard.github.io/gestik/hold-hint/) |
| `ResizeHint` | Pull a corner outward to make an element larger | [Try ResizeHint](https://nicolasmilliard.github.io/gestik/resize-hint/) |
| `ScrollHint` | Move vertically to explore content | [Try ScrollHint](https://nicolasmilliard.github.io/gestik/scroll-hint/) |
| `ShortcutHint` | Hold keys together to perform a keyboard shortcut | [Try ShortcutHint](https://nicolasmilliard.github.io/gestik/shortcut-hint/) |
| `SwipeHint` | Press and swipe left or right | [Try SwipeHint](https://nicolasmilliard.github.io/gestik/swipe-hint/) |

The hints use CSS animations, scale with their `size`, and support playback controls and custom colors. They are decorative, stay out of the accessibility tree and tab order, and become static when the user prefers reduced motion. Pair them with visible instructions and accessible controls in your application.

## Project status

Gestik is in early development. `@gestik/core` and `@gestik/react` are private workspace packages at version `0.0.0` and have not been published to npm. The install commands in the docs are a preview; use the live playgrounds or run this repository locally to explore the components.

## Usage preview

Within this repository, components are imported from `@gestik/react`:

```tsx
import { SwipeHint } from "@gestik/react";

export const SwipeInstruction = () => (
  <div>
    <p>Swipe left to see the next item.</p>
    <SwipeHint direction="left" />
  </div>
);
```

See the [component docs](https://nicolasmilliard.github.io/gestik/) for animation timing, finite playback, styling, and custom artwork where supported.

All hints share `size` (scene width in pixels), `duration` (a complete cycle in milliseconds), `iterations` (a CSS iteration count or `"infinite"`), `playing`, and `className`. Omitting playback props leaves their namespaced CSS variables in control. `playing={false}` pauses at the current frame; setting it back to `true` resumes. Change the React `key` to replay from the start, including after finite playback. Use whole iteration counts to finish in a resting pose; fractional counts stop partway through a gesture. Reduced motion takes precedence over playback props.

The default width is 112px. `ShortcutHint` instead sizes its scene to fit the key row, starting at 112px for Command + K. Explicit sizes scale the complete scene proportionally. Drag and swipe directions describe the element's or finger's travel; changing direction starts a new cycle. Changing a shortcut's key count also restarts playback.

Custom drag and swipe artwork and shortcut keycaps stay inside an inert, hidden subtree. Supply static illustrations and keep the actual interaction outside the hint. When showing a looping hint alongside other content, provide a way to pause or dismiss it, or use a finite iteration count.

Named imports include the selected hints' CSS automatically. The build preserves component modules so consumer bundlers can remove unused hints and their styles; no separate stylesheet import is needed.

## Development

Use the Bun version recorded in `package.json` and Node.js 22.18 or newer.

```sh
git clone https://github.com/NicolasMilliard/gestik.git
cd gestik
bun install --frozen-lockfile
bun run dev
```

`bun run dev` builds core, then React, before starting the Vite docs server. Open the local URL printed in the terminal.

```sh
bun run fix     # Apply lint and formatting fixes
bun run verify  # Run all CI checks locally
```

Shared CSS, SVG geometry, defaults, and layout live in `packages/core`; React components live in `packages/react`; the Vite docs app lives in `apps/docs`. React depends on core and includes its styles automatically. See [package architecture](docs/architecture.md) for the boundaries and future adapters, and the [hosting guide](apps/docs/README.md#github-pages) for production previews and GitHub Pages deployment.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) for setup, validation, and contribution guidelines. [Open an issue](https://github.com/NicolasMilliard/gestik/issues/new/choose) to report a bug or propose a gesture hint. For new hints, describe the movement a person should learn and where the hint would help.

## License

Gestik is licensed under [MIT](LICENSE). The docs' bundled fonts retain their [own licenses](apps/docs/public/fonts/README.md).
