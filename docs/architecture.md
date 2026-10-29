# Package architecture

Gestik separates the animation definition from the framework that renders it. The application still owns gesture handling and decides when to show a hint.

| Package | Responsibility | Status |
| --- | --- | --- |
| `@gestik/core` | Animation CSS, SVG path data and silhouettes, scene defaults, and pure layout calculations | Implemented |
| `@gestik/react` | React components, hooks, instance IDs, and React content customization | Implemented |
| `@gestik/vanilla` | DOM rendering, instance lifecycle, and JavaScript playback controls | Future |
| `@gestik/vue` | Vue components and Vue content customization | Future |
| `@gestik/angular` | Angular components and Angular content customization | Future |

Every adapter depends on core. Adapters do not depend on one another. The docs depend on React and receive core through React's dependency; there is no need for the docs to import core directly unless they use it directly.

## Why this boundary

The existing React package already had a useful separation: CSS drives motion, components render decorative markup, and the consuming application handles the gesture. Extracting the framework-independent assets lets other renderers reuse the same motion and artwork without importing React.

Core is a collection of assets and pure calculations. Its JavaScript entry point has no framework dependency, DOM access, stylesheet import, ID allocation, or mutable playback state. Its TypeScript configuration excludes DOM libraries and ambient framework types. SVG geometry is data; components that render that data remain in their adapter. CSS is exported separately for each hint, with reduced motion, keyframes, and playback defaults kept together.

React continues to import each selected hint's stylesheet automatically. Omitting a playback prop leaves the CSS variable unset inline, so consumer styles can override the default. Moving those defaults into React parameter initializers would change that behavior. CSS remains the source of truth for timing, iterations, and play state; core's JavaScript provides scene dimensions, default directions, contact points, and shortcut labels and layout.

Core is a regular dependency of React. Consumers need only install their adapter. The build preserves that dependency instead of embedding a second copy of core. Core and React have explicit package exports, and core's JavaScript entry point does not import every stylesheet. Production consumer tests check that importing one React hint includes only that hint and its styles within the existing bundle budget.

## Alternatives and tradeoffs

- Keeping everything in React is simpler for a React-only library. The planned additional adapters justify extracting the assets that are already independent.
- Making every adapter use vanilla would centralize markup, but would give React, Vue, and Angular an imperative DOM lifecycle to coordinate with their own rendering and server rendering. Keep vanilla a sibling adapter.
- A shared scene graph or renderer could reduce repeated markup. It would also introduce a second rendering abstraction before another adapter establishes its requirements. Keep JSX and the existing scene element hierarchy in React for now, including its SVG primitives, masks, and gradients.

This choice shares motion and artwork while accepting some future markup duplication. A second adapter should demonstrate parity for scene structure, instance IDs, direction changes, custom artwork, finite playback, sizing, and reduced motion. Revisit a shared scene description only if that implementation reveals recurring structural drift. Do not create empty future packages now.

## Build and validation

Build core before React, then build or run the docs. Packages consume one another through their built exports rather than source aliases. `bun run verify` checks the packages, production tree shaking, and docs prerendering.

For an extraction, compare rendered markup and animation CSS against the previous build and inspect the docs in a browser. Moving files should preserve React's props, exports, DOM, CSS variables, default artwork, animation timelines, and accessibility behavior.

## Tooling references

- [Node.js package exports](https://nodejs.org/api/packages.html#package-entry-points) define the public package entry points.
- [tsdown dependency handling](https://tsdown.dev/options/dependencies) preserves declared runtime dependencies as external imports.
- [tsdown CSS handling](https://tsdown.dev/options/css) explains automatic CSS imports and per-module stylesheet splitting. Core copies its CSS unchanged; the consuming application processes those styles.
