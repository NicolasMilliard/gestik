import { ScrollHint } from "@gestik/react";
import { MouseIcon } from "@phosphor-icons/react/dist/csr/Mouse";

import { HintStyleGuide } from "@/components/content/hint-style-guide";
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
    "Inline styles and --gestik-* CSS variables on the outer span.",
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
      <p className="mt-3 leading-6 text-zinc-600">
        The cue moves smoothly from top to bottom and back to the top. Each
        cycle includes both movements. Playback follows DragHint and SwipeHint:
        pause at the current frame, or change the React <code>key</code> to
        replay a completed finite animation.
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

    <section className="mt-16" aria-labelledby="scroll-hint-styling-title">
      <h2
        className="text-xl font-medium tracking-tight"
        id="scroll-hint-styling-title"
      >
        Styling
      </h2>
      <p className="mt-3 max-w-2xl leading-6 text-zinc-600">
        The artwork inherits <code>currentColor</code>. Override{" "}
        <code>--gestik-scroll-hint-color</code> to give the hint its own color.
        At the default size, the 32px artwork travels 24px inside a 112 by 88px
        scene. Changing <code>size</code> scales the whole scene proportionally.
        Pass <code>icon</code> to replace the scroll cue with static artwork
        that fills the same 32px box. No hotspot or silhouette is needed because
        the cue has no contact point or background cutout.
      </p>
      <p className="mt-4 max-w-2xl leading-7 text-zinc-600">
        Phosphor&apos;s duotone mouse cue suits a desktop interface. The custom
        artwork inherits the hint&apos;s color and follows the same vertical
        loop.
      </p>
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
