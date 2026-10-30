import { ResizeHint } from "@gestik/react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CursorArtwork } from "@/playgrounds/artwork/cursor-artwork";
import {
  CURSOR_EXAMPLE,
  CURSOR_HOTSPOT,
} from "@/playgrounds/artwork/cursor-geometry";
import { HintExample } from "@/playgrounds/hint-example";
import { ResizeHintDemo } from "@/playgrounds/resize-hint-demo";

const propRows = [
  [
    "icon",
    "Built-in pointing hand",
    "Static inline SVG artwork with an automatic cutout in a 32px box.",
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
    <>
      Inline styles and <code>--gestik-*</code> CSS variables on the outer span.
    </>,
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
    </section>

    <section className="mt-16" aria-labelledby="resize-hint-example-title">
      <h2
        className="text-xl font-medium tracking-tight"
        id="resize-hint-example-title"
      >
        Example
      </h2>
      <HintExample
        description="Drag the corner outward to resize. The violet cursor pulls the teal frame from its lower-right corner."
        code={`import { ResizeHint } from "@gestik/react";

${CURSOR_EXAMPLE}

<ResizeHint
  className="custom-resize-hint"
  size={168}
  icon={<CursorArtwork />}
  hotspot={{ x: 4 / 32, y: 2 / 32 }}
/>`}
        css={`
          .custom-resize-hint {
            --gestik-resize-hint-color: #7c3aed;
            --gestik-resize-hint-frame-color: #0f766e;
          }
        `}
      >
        {(playing) => (
          <ResizeHint
            className="custom-resize-hint"
            size={168}
            icon={<CursorArtwork />}
            hotspot={CURSOR_HOTSPOT}
            playing={playing}
          />
        )}
      </HintExample>
    </section>

    <section className="mt-16" aria-labelledby="resize-hint-artwork-title">
      <h2
        className="text-xl font-medium tracking-tight"
        id="resize-hint-artwork-title"
      >
        Custom artwork
      </h2>
      <p className="mt-3 max-w-2xl leading-6 text-zinc-600">
        Use a static inline SVG with a viewBox. Cutouts fill enclosed holes and
        stay opaque; artwork changes restart playback. Custom hints reserve
        space until browser generation finishes. Generation requires canvas and
        CSP permission for data: images; unsupported artwork renders without
        cutouts. Built-in hands appear immediately, even without JavaScript.
      </p>
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
