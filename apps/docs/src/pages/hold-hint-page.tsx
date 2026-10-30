import { HoldHint } from "@gestik/react";
import { HandPointingIcon } from "@phosphor-icons/react/dist/csr/HandPointing";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HintExample } from "@/playgrounds/hint-example";
import { HoldHintDemo } from "@/playgrounds/hold-hint-demo";

const propRows = [
  [
    "icon",
    "Built-in pointing hand",
    "Static decorative artwork in a 32px box.",
  ],
  [
    "iconMask",
    "Built-in hand silhouette",
    <>
      Filled <code>path</code> and <code>viewBox</code> for the cutout. Custom
      icons have no cutout unless supplied.
    </>,
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
    <>
      Inline styles and <code>--gestik-*</code> CSS variables on the outer span.
    </>,
  ],
] as const;

export const HoldHintPage = () => (
  <article id="hold-hint">
    <title>HoldHint — Gestik</title>
    <header className="mb-8">
      <h1 className="text-3xl font-normal tracking-tight">HoldHint</h1>
      <p className="mt-3 leading-6 text-zinc-500">
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

    <section className="mt-16" aria-labelledby="hold-hint-example-title">
      <h2
        className="text-xl font-medium tracking-tight"
        id="hold-hint-example-title"
      >
        Example
      </h2>
      <HintExample
        description="Press and hold to reveal more options. An indigo hand stays in place while the rose ring fills."
        code={`import { HoldHint } from "@gestik/react";
import { HandPointingIcon } from "@phosphor-icons/react";

<HoldHint
  className="custom-hold-hint"
  size={168}
  icon={<HandPointingIcon weight="fill" />}
  hotspot={{ x: 116 / 256, y: 16 / 256 }}
/>`}
        css={`
          .custom-hold-hint {
            --gestik-hold-hint-color: #4338ca;
            --gestik-hold-hint-ring-color: #e11d48;
          }
        `}
      >
        {(playing) => (
          <HoldHint
            className="custom-hold-hint"
            size={168}
            icon={<HandPointingIcon weight="fill" />}
            hotspot={{ x: 116 / 256, y: 16 / 256 }}
            playing={playing}
          />
        )}
      </HintExample>
    </section>

    <section className="mt-16" aria-labelledby="hold-hint-accessibility-title">
      <h2
        className="text-xl font-medium tracking-tight"
        id="hold-hint-accessibility-title"
      >
        Accessibility
      </h2>
      <p className="mt-3 max-w-2xl leading-6 text-zinc-600">
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
