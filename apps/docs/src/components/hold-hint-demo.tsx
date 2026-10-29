import { HoldHint } from "@gestik/react";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  CURSOR_EXAMPLE,
  CURSOR_HOTSPOT,
  CURSOR_SILHOUETTE,
} from "../lib/cursor-artwork";
import { CursorArtwork } from "./cursor-artwork";

type Iterations = 1 | 2 | "infinite";

const iterationItems = [
  { label: "Infinite", value: "infinite" },
  { label: "Once", value: "1" },
  { label: "Twice", value: "2" },
];

const iterationValues = { "1": 1, "2": 2, infinite: "infinite" } as const;

export const HoldHintDemo = () => {
  const id = useId();
  const [customIcon, setCustomIcon] = useState(false);
  const [size, setSize] = useState(112);
  const [duration, setDuration] = useState(3000);
  const [iterations, setIterations] = useState<Iterations>("infinite");
  const [playing, setPlaying] = useState(true);
  const [previewKey, setPreviewKey] = useState(0);

  const iterationsCode =
    iterations === "infinite"
      ? 'iterations="infinite"'
      : `iterations={${iterations}}`;

  const artworkCode = customIcon
    ? `  icon={<CursorArtwork />}\n  iconMask={cursorMask}\n  hotspot={{ x: 4 / 32, y: 2 / 32 }}\n  style={{ color: "#0e7490" }}\n`
    : "";

  const example = `import { HoldHint } from "@gestik/react";${customIcon ? `\n\n${CURSOR_EXAMPLE}` : ""}

<HoldHint
${artworkCode}  size={${size}}
  duration={${duration}}
  ${iterationsCode}
  playing={${playing}}
/>`;

  const replay = () => {
    setPlaying(true);
    setPreviewKey((key) => key + 1);
  };

  return (
    <section aria-label="Interactive HoldHint preview">
      <div className="grid overflow-hidden rounded-2xl border border-zinc-200 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="playground-preview flex min-h-72 flex-col items-center justify-center gap-6 px-6 py-10 sm:min-h-80">
          <HoldHint
            key={previewKey}
            icon={customIcon ? <CursorArtwork /> : undefined}
            iconMask={customIcon ? CURSOR_SILHOUETTE : undefined}
            hotspot={customIcon ? CURSOR_HOTSPOT : undefined}
            style={customIcon ? { color: "#0e7490" } : undefined}
            size={size}
            duration={duration}
            iterations={iterations}
            playing={playing}
          />
          <p className="text-center text-sm text-zinc-600">
            Press and hold to reveal more options.
          </p>
        </div>

        <div className="border-t border-zinc-200 bg-zinc-50 p-5 lg:border-t-0 lg:border-l">
          <h2 className="mb-6 text-sm font-medium">Preview settings</h2>
          <Button
            type="button"
            className="mb-5 w-full"
            variant={customIcon ? "default" : "outline"}
            aria-pressed={customIcon}
            onClick={() => {
              setCustomIcon((current) => !current);
              setPreviewKey((key) => key + 1);
            }}
          >
            Custom icon
          </Button>

          <div className="mb-5 text-sm font-medium">
            <div className="flex items-center justify-between">
              <label htmlFor={`${id}-size`}>Size</label>
              <output
                htmlFor={`${id}-size`}
                className="font-normal text-zinc-500"
              >
                {size}px
              </output>
            </div>
            <input
              id={`${id}-size`}
              className="mt-3 w-full accent-brand"
              type="range"
              min="80"
              max="180"
              step="4"
              value={size}
              onChange={(event) => setSize(Number(event.target.value))}
            />
          </div>

          <div className="mb-5 text-sm font-medium">
            <div className="flex items-center justify-between">
              <label htmlFor={`${id}-duration`}>Duration</label>
              <output
                htmlFor={`${id}-duration`}
                className="font-normal text-zinc-500"
              >
                {duration}ms
              </output>
            </div>
            <input
              id={`${id}-duration`}
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
              id={`${id}-iterations-label`}
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
                aria-labelledby={`${id}-iterations-label`}
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
