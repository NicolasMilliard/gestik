import { SwipeHint } from "@gestik/react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { HintStyleGuide } from "../components/hint-style-guide";
import { SwipeHintDemo } from "../components/swipe-hint-demo";

const propRows = [
  ["direction", '"right"', "Finger travel: left or right."],
  [
    "size",
    "112",
    "Scene width in pixels; height and illustrations scale with it.",
  ],
  ["duration", "2200", "Duration of a complete cycle in milliseconds."],
  ["iterations", '"infinite"', "Total number of cycles, or infinite."],
  ["playing", "true", "Pause or resume at the current frame."],
  [
    "icon",
    "Built-in pointing hand",
    "A decorative illustration for the fingertip.",
  ],
  [
    "hotspot",
    "{ x: 116 / 256, y: 16 / 256 }",
    "The contact point in normalized icon coordinates.",
  ],
  ["className", "—", "A class for styling the hint."],
  [
    "style",
    "—",
    "Inline styles and --gestik-* CSS variables on the outer span.",
  ],
] as const;

export const SwipeHintPage = () => (
  <article id="swipe-hint">
    <title>SwipeHint — Gestik</title>
    <header className="mb-8">
      <h1 className="text-3xl font-normal tracking-tight">SwipeHint</h1>
      <p className="mt-3 text-sm leading-6 text-zinc-500">
        Show how to swipe through a carousel or between cards.
      </p>
    </header>

    <SwipeHintDemo />

    <section className="mt-16" aria-labelledby="swipe-hint-props-title">
      <h2
        className="text-xl font-medium tracking-tight"
        id="swipe-hint-props-title"
      >
        Props
      </h2>
      <p className="mt-3 text-sm leading-6 text-zinc-600">
        Direction describes the finger&apos;s movement. Playback controls work
        the same way as DragHint: changing direction starts a new cycle, and
        changing the React <code>key</code> replays a completed animation.
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
      <HintStyleGuide />
    </section>

    <section className="mt-16" aria-labelledby="swipe-hint-styling-title">
      <h2
        className="text-xl font-medium tracking-tight"
        id="swipe-hint-styling-title"
      >
        Styling
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
        Use CSS variables to color the hand, its surface, and trail. The trail
        matches the icon&apos;s full color and follows the fingertip with a
        small gap. Its oldest part starts fading early during the swipe, with a
        soft edge that follows the moving finger. It uses a 2px stroke with
        rounded ends and scales with the scene. Override
        <code> --gestik-swipe-hint-trail-color </code> to give it a separate
        color. The built-in hand has a duotone fill at 20% opacity; use
        <code> --gestik-swipe-hint-surface </code> to change its color. A custom{" "}
        <code>icon</code> fills a 32 by 32 pixel box before scaling. Set{" "}
        <code>hotspot</code> to its fingertip: coordinates run from 0 to 1
        across that box. The hand compresses around this point as the swipe
        begins, then returns to full size as travel ends.
      </p>

      <div className="mt-6 flex items-center gap-5 rounded-xl border border-zinc-200 p-5">
        <SwipeHint className="custom-swipe-hint" size={84} playing={false} />
        <span className="text-sm text-zinc-600">
          Custom colors, paused at the starting pose.
        </span>
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
        <div className="border-b border-zinc-200 px-5 py-3 text-xs font-medium text-zinc-500">
          CSS
        </div>
        <pre className="overflow-x-auto p-5 text-xs leading-6 sm:text-sm">
          <code>{`.custom-swipe-hint {
  --gestik-swipe-hint-icon-color: #0e7490;
  --gestik-swipe-hint-surface: #ecfeff;
}`}</code>
        </pre>
      </div>
    </section>

    <section className="mt-16" aria-labelledby="swipe-hint-accessibility-title">
      <h2
        className="text-xl font-medium tracking-tight"
        id="swipe-hint-accessibility-title"
      >
        Accessibility
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
        SwipeHint is decorative and ignores pointer events. Pair it with visible
        instructions and accessible controls for the actual interaction. Under
        reduced motion, the hand stays still, with no press, trail, or travel;
        the accompanying instruction communicates direction. Custom icons stay
        inside an inert, hidden subtree and should be static. For looping hints
        shown alongside other content, provide a pause or dismiss control, or
        choose a finite iteration count.
      </p>
    </section>
  </article>
);
