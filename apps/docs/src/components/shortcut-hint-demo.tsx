import { ShortcutHint } from "@gestik/react";
import type { ShortcutHintKeys } from "@gestik/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Iterations = 1 | 2 | "infinite";

const iterationItems = [
  { label: "Infinite", value: "infinite" },
  { label: "Once", value: "1" },
  { label: "Twice", value: "2" },
];

const iterationValues = { "1": 1, "2": 2, infinite: "infinite" } as const;
const shortcuts: Record<2 | 3 | 4, ShortcutHintKeys> = {
  2: ["Command", "K"],
  3: ["Command", "Shift", "K"],
  4: ["Command", "Shift", "Alt", "K"],
};
const previewSizes = { 2: 112, 3: 184, 4: 240 };

export const ShortcutHintDemo = () => {
  const [keyCount, setKeyCount] = useState<2 | 3 | 4>(2);
  const [size, setSize] = useState(112);
  const [duration, setDuration] = useState(2400);
  const [iterations, setIterations] = useState<Iterations>("infinite");
  const [playing, setPlaying] = useState(true);
  const [previewKey, setPreviewKey] = useState(0);
  const keys = shortcuts[keyCount];
  const instruction = `Press ${keys.join(" + ")}${keyCount === 2 ? " to open search" : " together"}.`;

  const iterationsCode =
    iterations === "infinite"
      ? 'iterations="infinite"'
      : `iterations={${iterations}}`;
  const example = `import { ShortcutHint } from "@gestik/react";

<ShortcutHint
  keys={${JSON.stringify(keys)}}
  size={${size}}
  duration={${duration}}
  ${iterationsCode}
  playing={${playing}}
/>`;

  const replay = () => {
    setPlaying(true);
    setPreviewKey((key) => key + 1);
  };

  return (
    <section aria-label="Interactive ShortcutHint preview">
      <div className="grid overflow-hidden rounded-2xl border border-zinc-200 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="playground-preview flex min-h-72 flex-col items-center justify-center gap-6 px-6 py-10 sm:min-h-80">
          <ShortcutHint
            key={previewKey}
            keys={keys}
            size={size}
            duration={duration}
            iterations={iterations}
            playing={playing}
          />
          <p className="text-center text-sm text-zinc-600">{instruction}</p>
        </div>

        <div className="border-t border-zinc-200 bg-zinc-50 p-5 lg:border-t-0 lg:border-l">
          <h2 className="mb-6 text-sm font-medium">Preview settings</h2>

          <div className="mb-5 text-sm font-medium">
            <div className="flex items-center justify-between">
              <label htmlFor="shortcut-hint-key-count">Keycaps</label>
              <output
                htmlFor="shortcut-hint-key-count"
                className="font-normal text-zinc-500"
              >
                {keyCount}
              </output>
            </div>
            <input
              id="shortcut-hint-key-count"
              className="mt-3 w-full accent-brand"
              type="range"
              min="2"
              max="4"
              step="1"
              value={keyCount}
              onChange={(event) => {
                const count = Number(event.target.value);
                if (count !== 2 && count !== 3 && count !== 4) {
                  return;
                }
                setKeyCount(count);
                setSize(previewSizes[count]);
                setPreviewKey((key) => key + 1);
              }}
            />
          </div>

          <div className="mb-5 text-sm font-medium">
            <div className="flex items-center justify-between">
              <label htmlFor="shortcut-hint-size">Size</label>
              <output
                htmlFor="shortcut-hint-size"
                className="font-normal text-zinc-500"
              >
                {size}px
              </output>
            </div>
            <input
              id="shortcut-hint-size"
              className="mt-3 w-full accent-brand"
              type="range"
              min="80"
              max="280"
              step="4"
              value={size}
              onChange={(event) => setSize(Number(event.target.value))}
            />
          </div>

          <div className="mb-5 text-sm font-medium">
            <div className="flex items-center justify-between">
              <label htmlFor="shortcut-hint-duration">Duration</label>
              <output
                htmlFor="shortcut-hint-duration"
                className="font-normal text-zinc-500"
              >
                {duration}ms
              </output>
            </div>
            <input
              id="shortcut-hint-duration"
              className="mt-3 w-full accent-brand"
              type="range"
              min="1200"
              max="5000"
              step="200"
              value={duration}
              onChange={(event) => setDuration(Number(event.target.value))}
            />
          </div>

          <div>
            <span
              id="shortcut-hint-iterations-label"
              className="block text-sm font-medium"
            >
              Iterations
            </span>
            <Select
              items={iterationItems}
              value={String(iterations)}
              onValueChange={(value) => {
                if (value !== "infinite" && value !== "1" && value !== "2") {
                  return;
                }
                setIterations(iterationValues[value]);
                setPreviewKey((key) => key + 1);
              }}
            >
              <SelectTrigger
                aria-labelledby="shortcut-hint-iterations-label"
                className="mt-2 w-full"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectItem value="infinite">Infinite</SelectItem>
                <SelectItem value="1">Once</SelectItem>
                <SelectItem value="2">Twice</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-7 flex gap-2">
            <Button
              className="flex-1"
              variant="outline"
              type="button"
              onClick={() => setPlaying((current) => !current)}
            >
              {playing ? "Pause" : "Resume"}
            </Button>
            <Button
              className="flex-1"
              variant="outline"
              type="button"
              onClick={replay}
            >
              Replay
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
        <div className="border-b border-zinc-200 px-5 py-3 text-xs font-medium text-zinc-500">
          React
        </div>
        <pre className="overflow-x-auto p-5 text-xs leading-6 sm:text-sm">
          <code>{example}</code>
        </pre>
      </div>
    </section>
  );
};
