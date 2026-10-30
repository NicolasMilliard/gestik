import { ResizeHint } from "@gestik/react";

import { HintStyleGuide } from "@/components/content/hint-style-guide";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ResizeHintDemo } from "@/playgrounds/resize-hint-demo";

const propRows = [
  [
    "icon",
    "Built-in pointing hand",
    "Static decorative artwork in a 32px box.",
  ],
  [
    "iconMask",
    "Built-in hand silhouette",
    "Filled path and viewBox for the cutout. Custom icons have no cutout unless supplied.",
  ],
  [
    "hotspot",
    "{ x: 116 / 256, y: 16 / 256 }",
    "Contact point in normalized icon coordinates, shared by the artwork and its cutout.",
  ],
  [
    "size",
    "112",
    "Scene width in pixels; all artwork and travel scale with it.",
  ],
  [
    "duration",
    "2200",
    "One press, pull, release, and reset cycle in milliseconds.",
  ],
  ["iterations", '"infinite"', "Total number of complete cycles, or infinite."],
  ["playing", "true", "Pause or resume at the current frame."],
  ["className", "—", "A class for styling the hint."],
  [
    "style",
    "—",
    "Inline styles and --gestik-* CSS variables on the outer span.",
  ],
] as const;

export const ResizeHintPage = () => (
  <article id="resize-hint">
    <title>ResizeHint — Gestik</title>
    <header className="mb-8">
      <h1 className="text-3xl font-normal tracking-tight">ResizeHint</h1>
      <p className="mt-3 leading-6 text-zinc-500">
        Show how to pull a corner outward to make an element larger.
      </p>
    </header>

    <ResizeHintDemo />

    <section className="mt-16" aria-labelledby="resize-hint-props-title">
      <h2
        className="text-xl font-medium tracking-tight"
        id="resize-hint-props-title"
      >
        Props
      </h2>
      <p className="mt-3 leading-6 text-zinc-600">
        The hand presses the lower-right corner and immediately pulls diagonally
        outward, following the same press and movement timing as SwipeHint. The
        upper-left corner stays fixed as the outline grows. After release, the
        larger outline rests briefly, then fades before resetting. Finite
        playback ends at the initial resting pose. Change the React{" "}
        <code>key</code> to replay a completed animation.
      </p>
      <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200">
        <Table className="min-w-160">
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
                <TableCell className="font-mono">{name}</TableCell>
                <TableCell className="font-mono text-zinc-600">
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

    <section className="mt-16" aria-labelledby="resize-hint-styling-title">
      <h2
        className="text-xl font-medium tracking-tight"
        id="resize-hint-styling-title"
      >
        Styling
      </h2>
      <p className="mt-3 max-w-2xl leading-6 text-zinc-600">
        The hand and frame inherit <code>currentColor</code>. Use{" "}
        <code>--gestik-resize-hint-color</code> to color both, or{" "}
        <code>--gestik-resize-hint-frame-color</code> to color only the outline.
        The 112 by 88px scene scales proportionally with <code>size</code>. A
        silhouette cutout keeps the outline behind the transparent hand on any
        background.
      </p>
      <p className="mt-4 max-w-2xl leading-6 text-zinc-600">
        Replace the hand with <code>icon</code> and set <code>hotspot</code> to
        its contact point, using coordinates from 0 to 1. Supply an{" "}
        <code>iconMask</code> with a filled SVG <code>path</code> and{" "}
        <code>viewBox</code> to preserve the cutout behind custom artwork.
        Custom icons render without a cutout when no silhouette is supplied.
        Switching between built-in and custom artwork, or enabling or disabling
        its mask, restarts the cycle to keep all layers synchronized.
      </p>
      <div className="mt-6 flex items-center gap-5 rounded-xl border border-zinc-200 p-5">
        <ResizeHint className="custom-resize-hint" playing={false} />
        <span className="text-zinc-600">
          The resting artwork, paused before the pull.
        </span>
      </div>
      <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
        <div className="border-b border-zinc-200 px-5 py-3 font-medium text-zinc-500">
          CSS
        </div>
        <pre className="overflow-x-auto p-5 leading-6">
          <code>{`.custom-resize-hint {
  --gestik-resize-hint-color: #0e7490;
}`}</code>
        </pre>
      </div>
    </section>

    <section
      className="mt-16"
      aria-labelledby="resize-hint-accessibility-title"
    >
      <h2
        className="text-xl font-medium tracking-tight"
        id="resize-hint-accessibility-title"
      >
        Accessibility
      </h2>
      <p className="mt-3 max-w-2xl leading-6 text-zinc-600">
        ResizeHint is decorative and ignores pointer events. Pair it with
        visible instructions, such as “Drag the corner outward to resize,” and
        an accessible control for changing the size. Under reduced motion, the
        initial frame and hand stay still. Your application handles resizing and
        decides when to show the hint. Custom artwork stays inside an inert,
        hidden subtree and should be static.
      </p>
    </section>
  </article>
);
