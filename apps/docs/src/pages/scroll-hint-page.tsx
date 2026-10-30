import { ScrollHint } from "@gestik/react";
import { MouseIcon } from "@phosphor-icons/react/dist/csr/Mouse";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HintExample } from "@/playgrounds/hint-example";
import { ScrollHintDemo } from "@/playgrounds/scroll-hint-demo";

const propRows = [
  [
    "icon",
    "Built-in scroll cue",
    "Static decorative artwork in a 32px box; the whole box moves vertically.",
  ],
  ["size", "112", "Scene width in pixels; artwork and movement scale with it."],
  ["duration", "2400", "A complete down-and-up cycle in milliseconds."],
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

export const ScrollHintPage = () => (
  <article id="scroll-hint">
    <title>ScrollHint — Gestik</title>
    <header className="mb-8">
      <h1 className="text-3xl font-normal tracking-tight">ScrollHint</h1>
      <p className="mt-3 leading-6 text-zinc-500">
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

    <section className="mt-16" aria-labelledby="scroll-hint-example-title">
      <h2
        className="text-xl font-medium tracking-tight"
        id="scroll-hint-example-title"
      >
        Example
      </h2>
      <HintExample
        description="Scroll to explore more. A sky-blue mouse cue moves vertically with the gesture."
        code={`import { ScrollHint } from "@gestik/react";
import { MouseIcon } from "@phosphor-icons/react";

<ScrollHint
  className="custom-scroll-hint"
  size={144}
  icon={<MouseIcon weight="duotone" />}
/>`}
        css={`
          .custom-scroll-hint {
            --gestik-scroll-hint-color: #0369a1;
          }
        `}
      >
        {(playing) => (
          <ScrollHint
            className="custom-scroll-hint"
            size={144}
            icon={<MouseIcon weight="duotone" />}
            playing={playing}
          />
        )}
      </HintExample>
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
      <p className="mt-3 max-w-2xl leading-6 text-zinc-600">
        ScrollHint is decorative and ignores pointer events. Pair it with
        visible instructions and accessible navigation in your application. The
        loop suggests vertical movement in both directions; accompanying text
        should explain what the user can explore. Under reduced motion, the cue
        stays still. Your application handles the interaction and decides when
        to show the animation. Custom artwork stays inside an inert, hidden
        subtree and should be static.
      </p>
    </section>
  </article>
);
