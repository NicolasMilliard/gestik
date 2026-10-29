# Contributing to Gestik

Bug fixes, clearer gesture animations, and better examples are welcome. For a new hint, describe the movement it should teach and where it would help.

## Get started

Use the Bun version in `package.json` and Node.js 22.18 or newer. From the repository root:

```sh
bun install --frozen-lockfile
bun run dev
```

Open the local URL printed in the terminal. The docs use the library's built exports: `dev` builds them once, so run `bun run build` in another terminal after editing library code.

## Find your way

- `packages/react`: public components, CSS, artwork, and unit tests.
- `apps/docs`: documentation pages and interactive playgrounds.
- `docs/briefs`: gesture behavior and visual decisions.

## Make a change

Create a branch and keep the change focused. Follow the existing component structure and root lint and formatting configurations.

- Preserve public props, defaults, exports, and CSS variables unless changing them is the purpose of the work. Update examples and behavior tests together.
- Keep animation styling in CSS, use `--gestik-` variables, and scale the whole scene proportionally. Keep each hint's styling independent when sharing artwork.
- Fit artwork to its icon box and keep the contact point consistent between poses.
- Keep hints decorative, outside the accessibility tree and tab order, with reduced-motion support. The consuming application handles the actual gesture.

## Check your work

```sh
bun run fix
bun run verify
```

Inspect the fixes before submitting. `verify` runs lint, formatting, builds, type checks, and tests, including bundle checks, in the same order as CI.

For a quicker test run, build the library first and use `bun run test`; bare `bun test` invokes a different runner. For visual changes, check the docs in a browser, including sizing, direction, playback, and reduced motion as applicable.

## Open a pull request

Explain the problem, resulting behavior, and any public API changes. Report verification results and anything you could not check; include useful screenshots or recordings for visual changes.

See [AGENTS.md](AGENTS.md) for detailed implementation conventions and the [docs guide](apps/docs/README.md) for production previews and hosting.
