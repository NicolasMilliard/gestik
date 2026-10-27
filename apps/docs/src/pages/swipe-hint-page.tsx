import { SwipeHint } from "@gestik/react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
] as const;

export const SwipeHintPage = () => (
  <article
    className="mt-20 scroll-mt-8 border-t border-zinc-200 pt-16"
    id="swipe-hint"
  >
    <header className="mb-8">
      <p className="mb-2 text-sm font-medium text-orange-700">
        Component / SwipeHint
      </p>
      <h2 className="text-3xl font-semibold tracking-tight">SwipeHint</h2>
      <p className="mt-3 text-zinc-600">
        Show a fingertip making contact and swiping in a direction. Use it for
        touch interactions such as browsing a carousel or moving between cards.
      </p>
    </header>

    <SwipeHintDemo />

    <section className="mt-16" aria-labelledby="swipe-hint-props-title">
      <h3
        className="text-2xl font-semibold tracking-tight"
        id="swipe-hint-props-title"
      >
        Props
      </h3>
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
    </section>

    <section className="mt-16" aria-labelledby="swipe-hint-styling-title">
      <h3
        className="text-2xl font-semibold tracking-tight"
        id="swipe-hint-styling-title"
      >
        Styling
      </h3>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
        Use CSS variables to color the hand, its surface, and the contact pulse.
        The built-in hand has a transparent interior by default; set the surface
        color to give it a solid background. A custom <code>icon</code> fills a
        32 by 32 pixel box before scaling. Set <code>hotspot</code> to its
        fingertip: coordinates run from 0 to 1 across that box. The hand
        compresses around this point during contact.
      </p>

      <div className="mt-6 flex items-center gap-5 rounded-xl border border-zinc-200 p-5">
        <SwipeHint className="custom-swipe-hint" size={84} playing={false} />
        <span className="text-sm text-zinc-600">
          Custom colors, paused at the starting pose.
        </span>
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
        <div className="border-b border-zinc-200 px-5 py-3 text-xs font-semibold text-zinc-500">
          CSS
        </div>
        <pre className="overflow-x-auto p-5 text-xs leading-6 sm:text-sm">
          <code>{`.custom-swipe-hint {
  --gestik-swipe-hint-icon-color: #0e7490;
  --gestik-swipe-hint-surface: #ecfeff;
  --gestik-swipe-hint-contact-color: #0891b2;
}`}</code>
        </pre>
      </div>
    </section>

    <section className="mt-16" aria-labelledby="swipe-hint-accessibility-title">
      <h3
        className="text-2xl font-semibold tracking-tight"
        id="swipe-hint-accessibility-title"
      >
        Accessibility
      </h3>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
        SwipeHint is decorative and ignores pointer events. Pair it with visible
        instructions and accessible controls for the actual interaction. Under
        reduced motion, the hand stays still, with no press, pulse, or travel;
        the accompanying instruction communicates direction. Custom icons should
        be static and non-interactive too.
      </p>
    </section>
  </article>
);
