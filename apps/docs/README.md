# Gestik documentation

Interactive examples and component documentation, built with Vite and React.

Run `bun run dev` from the repository root to build `@gestik/react` and start the docs server. Run `bun run build:docs` after building the library to produce a production docs build.

The home route (`/`) shows an alphabetical gallery of live hints and preview install commands. Each component has its own route (`/drag-hint`, `/swipe-hint`) with its playground, code, examples, and props. Add components to `src/lib/components.ts` to include them in the routes, sidebar, and sorted gallery.

The docs use React Router's browser history routing. When hosting `dist`, configure an SPA fallback that serves `index.html` for unknown paths so opening or refreshing a component URL works. Vite's dev and preview servers already provide this fallback.

Run `bun run test` from the repository root to test both the library and docs navigation.

See the root [README](../../README.md) and [contribution guide](../../CONTRIBUTING.md) for setup and shared validation commands.
