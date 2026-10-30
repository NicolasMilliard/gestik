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

Routes preload on hover, focus, and touch. Keep the current page visible until its destination is ready, then switch without a page animation. Preserve active links, scroll restoration, and main-content focus. A failed import offers a reload action.

The [build script](scripts/build-docs.ts) runs client and server builds, then prerenders real HTML for each route and `404.html`. Node runs prerendering; React hydrates the resulting documents in the browser. Keep JSX transforms and package conditions in production mode, including when building from tests, to avoid hydration failures.

## Validate

Run `bun run verify` before submitting. [Production tests](src/tests/bundles/docs-bundle.test.ts) check generated HTML, deferred imports, and startup/chunk budgets; [consumer tests](src/tests/bundles/library-bundle.test.ts) measure the React library separately. Read current sizes from build output rather than maintaining a size snapshot here.

For navigation or build changes, also open a direct component URL, refresh it, and exercise its controls in the production preview. HTML checks alone do not establish working hydration.

## GitHub Pages

Vite assets and router links use the fixed `/gestik/` base. Deploy the complete `apps/docs/dist` directory, including route indexes and `404.html`, so clean links such as `/gestik/drag-hint/` work on refresh.

In **Settings → Pages**, select **GitHub Actions** as the source. Successful CI runs on `main` deploy the docs; pull requests only verify. To retry a deployment, run **CI → Run workflow** on `main`.

See the [branding brief](../../docs/briefs/branding.md) for docs design conventions.
