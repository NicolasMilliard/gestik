import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DragHint } from '@gestik/react';
import { DragHintDemo } from '../components/DragHintDemo';

const propRows = [
  ['direction', '"right"', 'Drag left or right.'],
  ['size', '112', 'Scene width in pixels; its height scales with it.'],
  ['duration', '2800', 'Duration of one cycle in milliseconds.'],
  ['iterations', '"infinite"', 'Total number of cycles, or infinite.'],
  ['playing', 'true', 'Pause or resume at the current frame.'],
  ['icons', 'Built-in hands', 'Custom idle and grabbing illustrations.'],
  ['hotspot', '{ x: 0.44, y: 0 }', 'Interaction point in normalized icon coordinates.'],
  ['className', '—', 'A class for styling the hint.'],
] as const;

export function DragHintPage() {
  return (
    <article id="drag-hint">
      <header className="mb-8">
        <p className="mb-2 text-sm font-medium text-orange-700">Component / DragHint</p>
        <h2 className="text-3xl font-semibold tracking-tight">DragHint</h2>
        <p className="mt-3 text-zinc-600">
          Show how to drag an element from one position to another.
        </p>
      </header>

      <DragHintDemo />

      <section className="mt-16" aria-labelledby="props-title">
        <h3 className="text-2xl font-semibold tracking-tight" id="props-title">
          Props
        </h3>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Start with the defaults, then adjust the motion and illustrations to fit your interface.
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
                  <TableCell className="font-mono text-xs text-zinc-600">{defaultValue}</TableCell>
                  <TableCell className="text-zinc-600">{purpose}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="mt-16" aria-labelledby="styling-title">
        <h3 className="text-2xl font-semibold tracking-tight" id="styling-title">
          Styling
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
          Use <code>className</code> and CSS variables to color the square, destination, and icons
          independently.
        </p>

        <div className="mt-6 flex items-center gap-5 rounded-xl border border-zinc-200 p-5">
          <DragHint className="custom-drag-hint" size={84} />
          <span className="text-sm text-zinc-600">
            Example using the custom colors in <code>index.css</code>.
          </span>
        </div>

        <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
          <div className="border-b border-zinc-200 px-5 py-3 text-xs font-semibold text-zinc-500">
            CSS
          </div>
          <pre className="overflow-x-auto p-5 text-xs leading-6 sm:text-sm">
            <code>{`.custom-drag-hint {
  --gestik-drag-hint-square-stroke: #155e75;
  --gestik-drag-hint-target-stroke: #155e75;
  --gestik-drag-hint-target-stroke-opacity: 0.65;
  --gestik-drag-hint-square-fill: rgb(236 254 255 / 85%);
  --gestik-drag-hint-icon-color: #0e7490;
  --gestik-drag-hint-surface: #ecfeff;
}`}</code>
          </pre>
        </div>
      </section>

      <section className="mt-16" aria-labelledby="accessibility-title">
        <h3 className="text-2xl font-semibold tracking-tight" id="accessibility-title">
          Accessibility
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
          DragHint is decorative, so pair it with visible instructions. It stays static when the
          user prefers reduced motion.
        </p>
      </section>
    </article>
  );
}
