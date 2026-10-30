import { ShortcutHint } from "@gestik/react";

import { HintStyleGuide } from "@/components/content/hint-style-guide";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    "Inline styles and --gestik-* CSS variables on the outer span.",
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
      <p className="mt-3 leading-6 text-zinc-600">
        Keys press from left to right and stay held until the whole combination
        is down. They release together, then rest before repeating. The
        animation demonstrates a combination held together, rather than a
        sequence of separate keystrokes. Change the React <code>key</code> to
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
      <p className="mt-4 leading-6 text-zinc-600">
        <code>keys</code> determines the keycap count. TypeScript requires at
        least two entries; fewer entries throw a <code>RangeError</code> at
        runtime. The label <code>Command</code> uses the built-in Command
        illustration. Other strings appear as text; pass a decorative React
        element for a custom symbol. Custom artwork is placed in the same 20px
        icon box as the built-in Command symbol and should fill that box. It
        stays static, inert, and hidden from assistive technology. Changing the
        number of keys restarts the cycle.
      </p>
    </section>

    <section className="mt-16" aria-labelledby="shortcut-hint-styling-title">
      <h2
        className="text-xl font-medium tracking-tight"
        id="shortcut-hint-styling-title"
      >
        Styling
      </h2>
      <p className="mt-3 max-w-2xl leading-6 text-zinc-600">
        Keycaps inherit the surrounding color. Override{" "}
        <code>--gestik-shortcut-hint-color</code> for the outlines, key legends,
        and key depth, and <code>--gestik-shortcut-hint-surface</code> for the
        key faces. Without <code>size</code>, longer combinations reserve more
        width while retaining the same keycap height. Setting <code>size</code>{" "}
        scales the whole row to that width.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-5 rounded-xl border border-zinc-200 p-5">
        <ShortcutHint
          keys={["Ctrl", "Shift", "K"]}
          className="custom-shortcut-hint"
          playing={false}
        />
        <span className="text-zinc-600">
          A three-key combination, paused at rest.
        </span>
      </div>
      <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
        <div className="border-b border-zinc-200 px-5 py-3 font-medium text-zinc-500">
          React + CSS
        </div>
        <pre className="overflow-x-auto p-5 leading-6">
          <code>{`<ShortcutHint
  keys={["Ctrl", "Shift", "K"]}
  className="custom-shortcut-hint"
  playing={false}
/>

.custom-shortcut-hint {
  --gestik-shortcut-hint-color: #0e7490;
  --gestik-shortcut-hint-surface: #ecfeff;
}`}</code>
        </pre>
      </div>
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
