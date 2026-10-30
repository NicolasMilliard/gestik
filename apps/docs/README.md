# Gestik docs

The Vite, React, and TanStack Router app for interactive examples at [nicolasmilliard.github.io/gestik](https://nicolasmilliard.github.io/gestik/).

## Develop and preview

Run from the repository root after following [CONTRIBUTING.md](../../CONTRIBUTING.md):

```sh
bun run dev
```

This builds `@gestik/react` once and starts the docs server. After library edits, run `bun run build` again. To preview the production site:

```sh
bun run build
bun run build:docs
bun --filter @gestik/docs preview
```

Open the printed URL under `/gestik/`.

## Maintain pages

The [component registry](src/lib/component-registry.ts) is the shared catalog for routes, sidebar links, homepage previews, and prerendered URLs. Each entry provides the name, path, `Preview`, and `Page`; add a hint there once to register it in all four places. `Page` loads the full documentation page lazily, including its controls; `Preview` supplies the small live hint in the gallery. Gallery previews load immediately and intentionally loop.

Keep route content in `src/pages/`, reusable components grouped by purpose in `src/components/` (`content`, `home`, `layout`, and `ui`), and interactive demos in `src/playgrounds/`. Demo artwork and its geometry live together in `src/playgrounds/artwork/`. Tests live under `src/tests/`, grouped into components, playgrounds, and bundles; app navigation tests stay directly in that folder. App entry files remain at the source root.

Keep each Props section limited to its table. Mark code tokens in table descriptions with `<code>` so they receive the shared inline-code background and radius.

The `playgrounds` folder owns the interactive demo feature, including its state, code generation, controls, and artwork. Keep shared preview options and their inferred types together in [preview-options.ts](src/playgrounds/preview-options.ts), and reuse `PreviewSelect` for their labeled controls. Add or change an option there instead of maintaining a type union, value conversion map, and menu markup separately in every demo. Component-specific props and types stay beside their owner; keep shared contracts scoped to the feature that uses them.

Routes preload on hover, focus, and touch. Keep the current page visible until its destination is ready, then switch without a page animation. Preserve active links, scroll restoration, and main-content focus. A failed import offers a reload action.

Ordinary text, controls, and snippets inherit the 1rem body size. Paper Mono uses `size-adjust: 90%` in its shared `@font-face` rule to balance its apparent size with Figtree across commands, snippets, inline code, and prop tables; keep this adjustment at the font definition instead of reducing font sizes in individual components. A shared rule in `src/index.css` gives inline `<code>` its rounded background, excluding code inside `<pre>`; keep token spacing outside the code element. Use `CodeBlock` for syntax-highlighted TSX and CSS; it preserves source line breaks and removes surrounding template indentation. The docs-only `prism-react-renderer` dependency handles tokenization without adding a highlighter to the library.

Use `PreviewSlider` for playground values: Base UI connects its native label and separate output to the input. Center-aligned thumbs render without waiting for browser measurements, including in prerendered HTML. Keep `Slider.Control` positioned so the thumb stays on its track. Use `HintExample` for custom artwork examples with pause and replay controls, and include the React and CSS needed to reproduce the preview. Its shared `CodeTabs` panel groups both snippets using Base UI tabs, with React selected initially; both sources remain in the prerendered HTML. Derive explicit tab/panel IDs and ARIA references from one `useId` in `CodeTabs` so those links agree before and after hydration. `CodeSnippet` owns highlighting and indentation for standalone and tabbed code panels.

The [build script](scripts/build-docs.ts) runs client and server builds, then prerenders real HTML for each route and `404.html`. Node runs prerendering; React hydrates the resulting documents in the browser. Keep JSX transforms and package conditions in production mode, including when building from tests, to avoid hydration failures.

## Validate

Run `bun run verify` before submitting. [Production tests](src/tests/bundles/docs-bundle.test.ts) check generated HTML, deferred imports, and startup/chunk budgets; [consumer tests](src/tests/bundles/library-bundle.test.ts) measure the React library separately. Read current sizes from build output rather than maintaining a size snapshot here.

Keep tests focused on interactions, accessibility, routing, and build behavior. Avoid assertions on documentation prose, gallery inventories, or fixed example snippets.

For navigation or build changes, also open a direct component URL, refresh it, and exercise its controls in the production preview. HTML checks alone do not establish working hydration.

## GitHub Pages

Vite assets and router links use the fixed `/gestik/` base. Deploy the complete `apps/docs/dist` directory, including route indexes and `404.html`, so clean links such as `/gestik/drag-hint/` work on refresh.

In **Settings → Pages**, select **GitHub Actions** as the source. Successful CI runs on `main` deploy the docs; pull requests only verify. To retry a deployment, run **CI → Run workflow** on `main`.

See the [branding brief](../../docs/briefs/branding.md) for docs design conventions.
