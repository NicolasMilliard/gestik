import { DragHint } from "@gestik/react";
import { HandIcon } from "@phosphor-icons/react/dist/csr/Hand";
import { HandGrabbingIcon } from "@phosphor-icons/react/dist/csr/HandGrabbing";

import { HintStyleGuide } from "@/components/content/hint-style-guide";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DRAG_HAND_MASKS,
  DRAG_HAND_MASKS_EXAMPLE,
} from "@/playgrounds/artwork/drag-geometry";
import { DragHintDemo } from "@/playgrounds/drag-hint-demo";
import { HintExample } from "@/playgrounds/hint-example";

const propRows = [
  ["direction", '"right"', "Drag left or right."],
  ["size", "112", "Scene width in pixels; its height scales with it."],
  ["duration", "2800", "Duration of one cycle in milliseconds."],
  ["iterations", '"infinite"', "Total number of cycles, or infinite."],
  ["playing", "true", "Pause or resume at the current frame."],
  ["icons", "Built-in hands", "Custom idle and grabbing illustrations."],
  [
    "iconMasks",
    "Built-in hand silhouettes",
    "Filled paths and viewBoxes for the idle and grabbing cutouts. Supply these with custom icons to enable masking.",
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
    "Inline styles and --gestik-* CSS variables on the outer span.",
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
      <p className="mt-3 leading-6 text-zinc-600">
        Start with the defaults, then adjust the motion and illustrations to fit
        your interface.
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

    <section className="mt-16" aria-labelledby="styling-title">
      <h2 className="text-xl font-medium tracking-tight" id="styling-title">
        Styling
      </h2>
      <p className="mt-3 max-w-2xl leading-6 text-zinc-600">
        Use <code>className</code> and CSS variables to color the square,
        destination, and icons independently. Custom icons fill a 24 by 24 pixel
        box before scaling. Set <code>hotspot</code> to the same contact point
        in both poses; the built-in hands use a shared top-center hotspot to sit
        across the square&apos;s lower edge, with the wrist aligned when
        grabbing and releasing. The surface color is rendered at 20% opacity for
        the duotone fill.
      </p>

      <p className="mt-4 max-w-2xl leading-7 text-zinc-600">
        This example pairs Phosphor&apos;s outline hands with matching{" "}
        <code>iconMasks</code> so the scene is cut away behind each hand,
        including its transparent interior. Each mask needs a filled silhouette
        path, including the hollow interior, and the icon&apos;s viewBox. Custom
        icons without silhouettes render without masking.
      </p>
      <HintExample
        description="Drag the teal square to the violet destination. The amber hand shows the gesture."
        code={`import { DragHint } from "@gestik/react";
import { HandIcon, HandGrabbingIcon } from "@phosphor-icons/react";

${DRAG_HAND_MASKS_EXAMPLE}

<DragHint
  className="custom-drag-hint"
  size={168}
  iconMasks={handMasks}
  icons={{
    idle: <HandIcon weight="regular" />,
    grabbing: <HandGrabbingIcon weight="regular" />,
  }}
/>`}
        css={`
          .custom-drag-hint {
            --gestik-drag-hint-square-stroke: #0f766e;
            --gestik-drag-hint-target-stroke: #7c3aed;
            --gestik-drag-hint-target-stroke-opacity: 0.65;
            --gestik-drag-hint-square-fill: #ccfbf1;
            --gestik-drag-hint-icon-color: #b45309;
          }
        `}
      >
        {(playing) => (
          <DragHint
            className="custom-drag-hint"
            size={168}
            iconMasks={DRAG_HAND_MASKS}
            icons={{
              grabbing: <HandGrabbingIcon weight="regular" />,
              idle: <HandIcon weight="regular" />,
            }}
            playing={playing}
          />
        )}
      </HintExample>
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
