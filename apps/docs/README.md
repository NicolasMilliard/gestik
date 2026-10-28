# Gestik documentation

Interactive examples and component documentation, built with Vite and React.

Run `bun run dev` from the repository root to build `@gestik/react` and start the docs server. Run `bun run build:docs` after building the library to produce a production docs build.

The home route (`#/`) shows an alphabetical gallery of live hints and preview install commands. Each component has its own route (`#/drag-hint`, `#/scroll-hint`, `#/swipe-hint`) with its playground, code, examples, and props. Add components to `src/lib/components.ts` to include them in the routes, sidebar, and sorted gallery.

The docs use React Router's hash routing so opening or refreshing a component URL works on GitHub Pages without an SPA fallback. Vite's relative asset base keeps scripts, styles, fonts, and branding under the site's directory, including the `/gestik/` project path.

## GitHub Pages

The docs are published at <https://nicolasmilliard.github.io/gestik/> after deployment. Share a component directly with a URL such as <https://nicolasmilliard.github.io/gestik/#/drag-hint>.

To enable hosting, open the repository's **Settings → Pages** and select **GitHub Actions** as the source under **Build and deployment**. Merge the deployment workflow into `main`; every successful CI run on `main` uploads `apps/docs/dist` and deploys it to the `github-pages` environment. Pull requests run the same verification without publishing. To retry a deployment without a commit, run **CI → Run workflow** on `main` in the Actions tab.

To preview the production build, run these commands from the repository root:

```sh
bun run build
bun run build:docs
bun --filter @gestik/docs preview
```

Open the URL printed by Vite. Component links use the same hash routes locally and on GitHub Pages.

Run `bun run test` from the repository root to test both the library and docs navigation.

See the root [README](../../README.md) and [contribution guide](../../CONTRIBUTING.md) for setup and shared validation commands.
