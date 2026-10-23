# Contributing to Gestik

Use Bun at the version in the root `package.json`, Node.js 22.18 or newer, and `bun install --frozen-lockfile` for a fresh checkout. CI uses Node.js 24.

## Working on a change

1. Create a branch and identify the intended behavior and affected public API.
2. Implement the smallest coherent change. Update the docs example when a component's behavior or API changes.
3. Run `bun run fix`, inspect the diff, then run `bun run verify`.
4. For visual changes, inspect the docs example in a browser and describe what you checked. Include useful visual evidence in the PR when available.

## Validation commands

Run these from the repository root:

| Command | Purpose |
| --- | --- |
| `bun run check` | Ultracite lint and formatting checks; warnings also fail |
| `bun run fix` | Apply lint and formatting fixes |
| `bun run lint` | Run the shared Oxlint configuration |
| `bun run format:check` | Check formatting with the shared Oxfmt configuration |
| `bun run build` | Build the React package and its public declarations |
| `bun run typecheck` | Type-check tooling and all workspaces; build the library first |
| `bun run test` | Run the React package's Vitest suite |
| `bun run build:docs` | Type-check and build the documentation app |
| `bun run verify` | Run all of the above checks in dependency order |

The docs consume the package's built exports, so the library must be built before the docs can resolve it in a clean checkout. `verify` handles this order. Use `bun run test`, since bare `bun test` invokes a different test runner.

CI runs `bun install --frozen-lockfile` and `bun run verify` for pull requests and pushes to `main`. It uses read-only repository permissions and requires no project secrets, so the same checks can run for fork contributions. GitHub may require a maintainer to approve a first-time contributor's workflow run. Requiring the `Verify` check before merging is a separate GitHub branch ruleset setting.

## Baseline decisions

- Ultracite 8.0.2 supplies the core, React, and Vitest presets over the existing Oxlint/Oxfmt stack. The lockfile fixes resolved versions; update tooling in a dedicated change and review new diagnostics.
- One root lint configuration covers both workspaces. Nested configs can replace the root rules, so any future workspace config must explicitly inherit them.
- Adopt Ultracite's formatting and lint defaults, including quotes, wrapping, imports, arrow functions, and kebab-case filenames. Migrate existing code instead of preserving its style through overrides. Keep public component names and API behavior stable. The formatter resolves the docs app's custom Tailwind theme.
- Fast Refresh export checks apply to docs source; the Vitest environment tag is allowed in tests. These exceptions stay scoped to the files that need them.
- TypeScript checks run separately. Type-aware Oxlint analysis, browser automation, agent hooks, and specialist agent roles are deferred until a concrete need justifies their setup. CI does not assess animation clarity or visual quality.

## Evolving the rules

Feedback should reduce repeated corrections. Record the cause, the scope of the lesson, and how a future change can be checked. Prefer a lint rule or behavioral test for a deterministic requirement, and concise guidance for a judgment call. Explain an exception next to its configuration instead of silently disabling a rule. Keep product-specific timing and visual decisions local to their component unless evidence supports a shared convention.

Clear, reusable lessons can be added as part of the implementation. Keep uncertain inferences in the PR description for review. Personal editor or agent preferences belong in local settings; temporary network or sandbox failures belong in the task report. Refine existing guidance before adding more files or process.
