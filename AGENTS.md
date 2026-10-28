# Working on Gestik

Gestik provides animations that show the movement a person makes to navigate or interact. Artwork supports the motion; Gestik is not an icon collection. The consuming application owns gesture handling and decides when to show a hint.

## Repository map

- `packages/react`: public React components, CSS, icons, and Vitest tests.
- `apps/docs`: Vite documentation and interactive component examples.
- `docs/briefs`: component behavior briefs and local visual decisions for review.
- `oxlint.config.ts` and `oxfmt.config.ts`: shared Ultracite presets and explained project overrides. Follow these configs rather than duplicating their rules here.

## Commands

Use Bun, at the version in `package.json`, and keep `bun.lock` in sync.

- `bun install --frozen-lockfile`: install the committed dependency graph.
- `bun run dev`: build the library and start the docs app.
- `bun run fix`: apply lint and formatting fixes; inspect the resulting diff.
- `bun run verify`: run the same lint, format, build, type, and test checks as CI.

The docs resolve `@gestik/react` through its built exports. Run `bun run build` before checking or building the docs in a fresh checkout. See `CONTRIBUTING.md` for individual commands and validation expectations.

## Implementation

- Keep the library independent of the docs app and its UI dependencies.
- Adopt Ultracite's lint and formatting defaults. Update code to follow the presets instead of adding overrides to preserve an old style. Add a scoped override only for a concrete compatibility or project requirement, and explain why in the config.
- Preserve public props, defaults, exports, and CSS variables unless the task calls for an API change. Update examples and documentation when behavior changes.
- Follow the existing component's structure before adding a new abstraction or dependency. Explain a new dependency's purpose in the change description.
- Keep animation styling in CSS where practical, namespace public CSS variables with `--gestik-`, and preserve proportional layout when changing component size.
- Start from the human movement the hint must communicate. Keep visual detail minimal; do not add device variants or miniature interface scenes by default. Challenge proposed motion when it suggests a different action or makes direction ambiguous, and explain the tradeoff.
- Let the gesture communicate movement. Avoid arrows by default; add a directional graphic only when it resolves a clear ambiguity.
- Keep decorative hints out of the accessibility tree and out of the tab order. Preserve reduced-motion support and explain accompanying instructions in docs.
- Use unique IDs across component demos and connect slider labels explicitly with `htmlFor`. Keep `output` values outside the label so they do not become part of the slider's accessible name; a shared wrapping label can also name the output instead of the input.

## Validation and review

- Run `bun run verify` before handing off code changes. Report any check that could not run and why; do not describe an unrun check as passing.
- Test observable behavior and public contracts. Add tests when behavior changes or a regression needs coverage; avoid tests that only repeat implementation.
- For motion or visual changes, inspect the relevant docs example in a browser, including direction, sizing, playback, and reduced motion as applicable. Unit tests and a successful build do not establish visual quality.
- Review the final diff for unintended behavior, accessibility regressions, unrelated edits, and unnecessary API growth. Never weaken a check merely to obtain a passing result. Explain any necessary rule exception at its scope.

## Learning from feedback

- After meaningful feedback or an unexpected issue, identify the cause and whether the lesson is specific to the change or reusable. Report it in the conversation or PR, including where it belongs.
- Put deterministic checks in tooling or tests; put repository-specific judgment in these instructions or `CONTRIBUTING.md`. Keep machine-specific settings and preferences that apply across projects outside the repository.
- Capture clear, reusable lessons autonomously in the narrowest relevant place, with a reason or example. Keep inferred preferences provisional in the PR until supported; a correction to one animation does not define every gesture.
- Keep instructions short. Refine existing guidance, remove stale or conflicting rules, and avoid copying the linter's rule catalogue into agent instructions.
