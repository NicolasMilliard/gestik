import { SwipeHint } from "@gestik/react";
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
import { SwipeHintDemo } from "@/playgrounds/swipe-hint-demo";

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
    <>
      Inline styles and <code>--gestik-*</code> CSS variables on the outer span.
    </>,
  ],
] as const;

export const SwipeHintPage = () => (
  <article id="swipe-hint">
    <title>SwipeHint — Gestik</title>
    <header className="mb-8">
      <h1 className="text-3xl font-normal tracking-tight">SwipeHint</h1>
      <p className="mt-3 leading-6 text-zinc-500">
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

    <section className="mt-16" aria-labelledby="swipe-hint-example-title">
      <h2
        className="text-xl font-medium tracking-tight"
        id="swipe-hint-example-title"
      >
        Example
      </h2>
      <HintExample
        description="Swipe left to see the next card. The rose trail follows a bold violet fingertip."
        code={`import { SwipeHint } from "@gestik/react";
import { HandPointingIcon } from "@phosphor-icons/react";

<SwipeHint
  className="custom-swipe-hint"
  size={168}
  direction="left"
  icon={<HandPointingIcon weight="bold" />}
  hotspot={{ x: 116 / 256, y: 12 / 256 }}
/>`}
        css={`
          .custom-swipe-hint {
            --gestik-swipe-hint-icon-color: #7c3aed;
            --gestik-swipe-hint-trail-color: #e11d48;
          }
        `}
      >
        {(playing) => (
          <SwipeHint
            className="custom-swipe-hint"
            size={168}
            direction="left"
            icon={<HandPointingIcon weight="bold" />}
            hotspot={{ x: 116 / 256, y: 12 / 256 }}
            playing={playing}
          />
        )}
      </HintExample>
    </section>

    <section className="mt-16" aria-labelledby="swipe-hint-accessibility-title">
      <h2
        className="text-xl font-medium tracking-tight"
        id="swipe-hint-accessibility-title"
      >
        Accessibility
      </h2>
      <p className="mt-3 max-w-2xl leading-6 text-zinc-600">
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
