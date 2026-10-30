import { ShortcutHint } from "@gestik/react";
import { CommandIcon } from "@phosphor-icons/react/dist/csr/Command";
import { OptionIcon } from "@phosphor-icons/react/dist/csr/Option";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HintExample } from "@/playgrounds/hint-example";
import { ShortcutHintDemo } from "@/playgrounds/shortcut-hint-demo";

const propRows = [
  [
    "keys",
    '["Command", "K"]',
    "At least two labels or decorative React elements, in press order. No maximum.",
  ],
  [
    "size",
    "Fits the keys (112 by default)",
    "Scene width in pixels; the entire row scales proportionally.",
  ],
  [
    "duration",
    "2400",
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

export const ShortcutHintPage = () => (
  <article id="shortcut-hint">
    <title>ShortcutHint — Gestik</title>
    <header className="mb-8">
      <h1 className="text-3xl font-normal tracking-tight">ShortcutHint</h1>
      <p className="mt-3 leading-6 text-zinc-500">
        Show how to hold keys together to perform a keyboard shortcut.
      </p>
    </header>

    <ShortcutHintDemo />

    <section className="mt-16" aria-labelledby="shortcut-hint-props-title">
      <h2
        className="text-xl font-medium tracking-tight"
        id="shortcut-hint-props-title"
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

    <section className="mt-16" aria-labelledby="shortcut-hint-example-title">
      <h2
        className="text-xl font-medium tracking-tight"
        id="shortcut-hint-example-title"
      >
        Example
      </h2>
      <HintExample
        description="Press Command + Option + K to open the command menu. Custom symbols share the mint keycaps with a text legend."
        code={`import { ShortcutHint } from "@gestik/react";
import { CommandIcon, OptionIcon } from "@phosphor-icons/react";

<ShortcutHint
  className="custom-shortcut-hint"
  keys={[
    <CommandIcon key="command" weight="bold" />,
    <OptionIcon key="option" weight="bold" />,
    "K",
  ]}
/>`}
        css={`
          .custom-shortcut-hint {
            --gestik-shortcut-hint-color: #047857;
            --gestik-shortcut-hint-surface: #ecfdf5;
          }
        `}
      >
        {(playing) => (
          <ShortcutHint
            className="custom-shortcut-hint"
            keys={[
              <CommandIcon key="command" weight="bold" />,
              <OptionIcon key="option" weight="bold" />,
              "K",
            ]}
            playing={playing}
          />
        )}
      </HintExample>
    </section>

    <section
      className="mt-16"
      aria-labelledby="shortcut-hint-accessibility-title"
    >
      <h2
        className="text-xl font-medium tracking-tight"
        id="shortcut-hint-accessibility-title"
      >
        Accessibility
      </h2>
      <p className="mt-3 max-w-2xl leading-6 text-zinc-600">
        ShortcutHint is decorative, stays out of the tab order, and ignores
        pointer events. Pair it with visible instructions such as “Press Command
        + K to open search” and an accessible control for the same action. Under
        reduced motion, every key remains still and released. Your application
        implements the shortcut and decides when the hint appears. This docs
        example does not register a keyboard shortcut.
      </p>
    </section>
  </article>
);
