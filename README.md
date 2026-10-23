# Gestik

Animated interaction hints for React interfaces. Gestik demonstrates a gesture; your application handles the interaction and decides when to show the hint.

The project currently includes `DragHint` and an interactive documentation app.

## Development

Use the Bun version recorded in `package.json` and Node.js 22.18 or newer.

```sh
bun install --frozen-lockfile
bun run dev
```

`bun run dev` builds the React package before starting the Vite docs server.

```sh
bun run fix     # Apply lint and formatting fixes
bun run verify  # Run all CI checks locally
```

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) for the workflow, validation commands, and how repository conventions evolve. Coding agents should also read [AGENTS.md](AGENTS.md).

Code standards use [Ultracite](https://www.ultracite.ai/) with Oxlint and Oxfmt. Their configuration is shared by the library, docs app, editor integration, and CI.
