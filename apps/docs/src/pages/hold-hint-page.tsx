import { HoldHint } from "@gestik/react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { HintStyleGuide } from "../components/hint-style-guide";
import { HoldHintDemo } from "../components/hold-hint-demo";

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
    "Scene width in pixels; the whole illustration scales with it.",
  ],
  [
    "duration",
    "3000",
    "One press, hold, release, and rest cycle in milliseconds.",
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

export const HoldHintPage = () => (
  <article id="hold-hint">
    <title>HoldHint — Gestik</title>
    <header className="mb-8">
      <h1 className="text-3xl font-normal tracking-tight">HoldHint</h1>
      <p className="mt-3 text-sm leading-6 text-zinc-500">
        Show how to press and keep a finger in place.
      </p>
    </header>

    <HoldHintDemo />

    <section className="mt-16" aria-labelledby="hold-hint-props-title">
      <h2
        className="text-xl font-medium tracking-tight"
        id="hold-hint-props-title"
      >
        Props
      </h2>
      <p className="mt-3 text-sm leading-6 text-zinc-600">
        The hand presses once and stays still while the ring fills clockwise. It
        releases after the ring completes, then rests before repeating. The ring
        takes half of the full cycle to fill: 1500ms at the default duration.
        This is illustrative timing; your application decides how long a real
        press must last. Change the React <code>key</code> to replay a completed
        finite animation.
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

    <section className="mt-16" aria-labelledby="hold-hint-styling-title">
      <h2
        className="text-xl font-medium tracking-tight"
        id="hold-hint-styling-title"
      >
        Styling
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
        The pointing hand and ring inherit <code>currentColor</code>. Use
        <code> --gestik-hold-hint-color </code> to color both, or
        <code> --gestik-hold-hint-ring-color </code> to color only the ring. The
        32px hand compresses around its fingertip, keeping the contact point
        fixed. A silhouette cutout keeps the ring behind the transparent hand on
        any background. The 112 by 72px scene scales proportionally with{" "}
        <code>size</code>.
      </p>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-600">
        Replace the hand with <code>icon</code> and set <code>hotspot</code> to
        its contact point, using coordinates from 0 to 1. Supply an
        <code> iconMask</code> with a filled SVG <code>path</code> and
        <code> viewBox</code> to preserve the cutout behind custom artwork.
        Custom icons render without a cutout when no silhouette is supplied.
        Switching between built-in and custom artwork, or enabling or disabling
        its mask, restarts the cycle to keep all layers synchronized.
      </p>
      <div className="mt-6 flex items-center gap-5 rounded-xl border border-zinc-200 p-5">
        <HoldHint className="custom-hold-hint" size={112} playing={false} />
        <span className="text-sm text-zinc-600">
          The resting hand, paused before contact.
        </span>
      </div>
      <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
        <div className="border-b border-zinc-200 px-5 py-3 text-xs font-medium text-zinc-500">
          CSS
        </div>
        <pre className="overflow-x-auto p-5 text-xs leading-6 sm:text-sm">
          <code>{`.custom-hold-hint {
  --gestik-hold-hint-color: #0e7490;
}`}</code>
        </pre>
      </div>
    </section>

    <section className="mt-16" aria-labelledby="hold-hint-accessibility-title">
      <h2
        className="text-xl font-medium tracking-tight"
        id="hold-hint-accessibility-title"
      >
        Accessibility
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
        HoldHint is decorative and ignores pointer events. Pair it with visible
        instructions, such as “Press and hold to reveal more options,” and an
        accessible control for the same action. Under reduced motion, the hand
        stays still and the ring stays hidden. Your application handles the
        gesture and decides when to show the hint; the ring demonstrates a hold
        and does not report live progress. Custom artwork stays inside an inert,
        hidden subtree and should be static.
      </p>
    </section>
  </article>
);
