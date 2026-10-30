import { DragHint } from "@gestik/react";
import { HandIcon } from "@phosphor-icons/react/dist/csr/Hand";
import { HandGrabbingIcon } from "@phosphor-icons/react/dist/csr/HandGrabbing";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DragHintDemo } from "@/playgrounds/drag-hint-demo";
import { HintExample } from "@/playgrounds/hint-example";

const propRows = [
  ["direction", '"right"', "Drag left or right."],
  ["size", "112", "Scene width in pixels; its height scales with it."],
  ["duration", "2800", "Duration of one cycle in milliseconds."],
  ["iterations", '"infinite"', "Total number of cycles, or infinite."],
  ["playing", "true", "Pause or resume at the current frame."],
  [
    "icons",
    "Built-in hands",
    "Static inline SVG poses with automatic cutouts.",
  ],
  [
    "hotspot",
    "{ x: 0.5, y: 0 }",
    "Interaction point in normalized icon coordinates.",
  ],
  ["className", "—", "A class for styling the hint."],
  [
    "style",
    "—",
    <>
      Inline styles and <code>--gestik-*</code> CSS variables on the outer span.
    </>,
  ],
] as const;

export const DragHintPage = () => (
  <article id="drag-hint">
    <title>DragHint — Gestik</title>
    <header className="mb-8">
      <h1 className="text-3xl font-normal tracking-tight">DragHint</h1>
      <p className="mt-3 leading-6 text-zinc-500">
        Show how to drag an element from one position to another.
      </p>
    </header>

    <DragHintDemo />

    <section className="mt-16" aria-labelledby="props-title">
      <h2 className="text-xl font-medium tracking-tight" id="props-title">
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

    <section className="mt-16" aria-labelledby="example-title">
      <h2 className="text-xl font-medium tracking-tight" id="example-title">
        Example
      </h2>
      <HintExample
        description="Drag the teal square to the violet destination. The amber hand shows the gesture."
        code={`import { DragHint } from "@gestik/react";
import { HandIcon, HandGrabbingIcon } from "@phosphor-icons/react";

<DragHint
  className="custom-drag-hint"
  size={168}
  hotspot={{ x: 0.5, y: 0.5 }}
  icons={{
    idle: <HandIcon weight="regular" />,
    grabbing: <HandGrabbingIcon weight="regular" />,
  }}
/>`}
        css={`
          .custom-drag-hint {
            --gestik-drag-hint-square-stroke: #0f766e;
            --gestik-drag-hint-square-fill: #ccfbf1;
            --gestik-drag-hint-target-stroke: #7c3aed;
            --gestik-drag-hint-target-stroke-opacity: 0.65;
            --gestik-drag-hint-icon-color: #b45309;
          }
        `}
      >
        {(playing) => (
          <DragHint
            className="custom-drag-hint"
            size={168}
            hotspot={{ x: 0.5, y: 0.5 }}
            icons={{
              grabbing: <HandGrabbingIcon weight="regular" />,
              idle: <HandIcon weight="regular" />,
            }}
            playing={playing}
          />
        )}
      </HintExample>
    </section>

    <section className="mt-16" aria-labelledby="artwork-title">
      <h2 className="text-xl font-medium tracking-tight" id="artwork-title">
        Custom artwork
      </h2>
      <p className="mt-3 max-w-2xl leading-6 text-zinc-600">
        Use one static inline SVG with a viewBox per pose. Paths, basic shapes,
        groups, transforms, and CSS fills and strokes are supported. Cutouts
        fill enclosed holes and stay opaque; artwork changes rebuild them and
        restart playback.
      </p>
      <p className="mt-3 max-w-2xl leading-6 text-zinc-600">
        Custom hints reserve space until their cutouts are ready in the browser.
        Generation requires canvas and CSP permission for data: images.
        Unsupported artwork or unavailable canvas renders without cutouts.
        Built-in hands appear immediately, even without JavaScript.
      </p>
    </section>

    <section className="mt-16" aria-labelledby="accessibility-title">
      <h2
        className="text-xl font-medium tracking-tight"
        id="accessibility-title"
      >
        Accessibility
      </h2>
      <p className="mt-3 max-w-2xl leading-6 text-zinc-600">
        DragHint is decorative and ignores pointer events. Pair it with visible
        instructions and an accessible control for the same action. Custom
        artwork stays inside an inert, hidden subtree and should be static.
        Reduced motion leaves the hand and square at rest. For looping hints
        shown alongside other content, provide a pause or dismiss control, or
        choose a finite iteration count.
      </p>
    </section>
  </article>
);
