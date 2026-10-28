import { ScrollHint } from "@gestik/react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ScrollHintDemo } from "../components/scroll-hint-demo";

const propRows = [
  ["size", "112", "Scene width in pixels; artwork and movement scale with it."],
  ["duration", "2400", "A complete down-and-up cycle in milliseconds."],
  ["iterations", '"infinite"', "Total number of complete cycles, or infinite."],
  ["playing", "true", "Pause or resume at the current frame."],
  ["className", "—", "A class for styling the hint."],
] as const;

export const ScrollHintPage = () => (
  <article id="scroll-hint">
    <title>ScrollHint — Gestik</title>
    <header className="mb-8">
      <h1 className="text-3xl font-normal tracking-tight">ScrollHint</h1>
      <p className="mt-3 text-sm leading-6 text-zinc-500">
        Show the vertical movement used to explore content.
      </p>
    </header>

    <ScrollHintDemo />

    <section className="mt-16" aria-labelledby="scroll-hint-props-title">
      <h2
        className="text-xl font-medium tracking-tight"
        id="scroll-hint-props-title"
      >
        Props
      </h2>
      <p className="mt-3 text-sm leading-6 text-zinc-600">
        The cue moves smoothly from top to bottom and back to the top. Each
        cycle includes both movements. Playback follows DragHint and SwipeHint:
        pause at the current frame, or change the React <code>key</code> to
        replay a completed finite animation.
      </p>
      <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200">
        <Table className="min-w-160 text-sm">
          <TableHeader className="bg-zinc-50">
            <TableRow>
              <TableHead scope="col">Prop</TableHead>
              <TableHead scope="col">Default</TableHead>
              <TableHead scope="col">Purpose</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {propRows.map(([name, defaultValue, purpose]) => (
              <TableRow key={name}>
                <TableCell className="font-mono text-xs">{name}</TableCell>
                <TableCell className="font-mono text-xs text-zinc-600">
                  {defaultValue}
                </TableCell>
                <TableCell className="text-zinc-600">{purpose}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>

    <section className="mt-16" aria-labelledby="scroll-hint-styling-title">
      <h2
        className="text-xl font-medium tracking-tight"
        id="scroll-hint-styling-title"
      >
        Styling
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
        The artwork inherits <code>currentColor</code>. Override
        <code> --gestik-scroll-hint-color </code> to give the hint its own
        color. At the default size, the 32px artwork travels 24px inside a 112
        by 88px scene. Changing <code>size</code> scales the whole scene
        proportionally.
      </p>
      <div className="mt-6 flex items-center gap-5 rounded-xl border border-zinc-200 p-5">
        <ScrollHint className="custom-scroll-hint" size={84} playing={false} />
        <span className="text-sm text-zinc-600">
          Custom color, paused at the top.
        </span>
      </div>
      <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
        <div className="border-b border-zinc-200 px-5 py-3 text-xs font-medium text-zinc-500">
          CSS
        </div>
        <pre className="overflow-x-auto p-5 text-xs leading-6 sm:text-sm">
          <code>{`.custom-scroll-hint {
  --gestik-scroll-hint-color: #0e7490;
}`}</code>
        </pre>
      </div>
    </section>

    <section
      className="mt-16"
      aria-labelledby="scroll-hint-accessibility-title"
    >
      <h2
        className="text-xl font-medium tracking-tight"
        id="scroll-hint-accessibility-title"
      >
        Accessibility
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
        ScrollHint is decorative and ignores pointer events. Pair it with
        visible instructions and accessible navigation in your application. The
        loop suggests vertical movement in both directions; accompanying text
        should explain what the user can explore. Under reduced motion, the cue
        stays still. Your application handles the interaction and decides when
        to show the animation.
      </p>
    </section>
  </article>
);
