import { SwipeHint } from "@gestik/react";
import { useId, useState } from "react";

import { CodeBlock } from "@/components/content/code-block";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PreviewSlider } from "./preview-slider";

type Direction = "left" | "right";
type Iterations = 1 | 2 | "infinite";

const directionItems = [
  { label: "Right", value: "right" },
  { label: "Left", value: "left" },
];

const iterationItems = [
  { label: "Infinite", value: "infinite" },
  { label: "Once", value: "1" },
  { label: "Twice", value: "2" },
];

const iterationValues = { "1": 1, "2": 2, infinite: "infinite" } as const;

export const SwipeHintDemo = () => {
  const id = useId();
  const [direction, setDirection] = useState<Direction>("right");
  const [size, setSize] = useState(112);
  const [duration, setDuration] = useState(2200);
  const [iterations, setIterations] = useState<Iterations>("infinite");
  const [playing, setPlaying] = useState(true);
  const [previewKey, setPreviewKey] = useState(0);

  const iterationsCode =
    iterations === "infinite"
      ? 'iterations="infinite"'
      : `iterations={${iterations}}`;

  const example = `import { SwipeHint } from "@gestik/react";

<SwipeHint
  direction="${direction}"
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
    <section aria-label="Interactive SwipeHint preview">
      <div className="grid min-w-0 overflow-hidden rounded-2xl border border-zinc-200 lg:grid-cols-[minmax(0,1fr)_272px]">
        <div className="playground-preview flex min-h-72 flex-col items-center justify-center gap-6 px-6 py-10 sm:min-h-80">
          <SwipeHint
            key={previewKey}
            direction={direction}
            size={size}
            duration={duration}
            iterations={iterations}
            playing={playing}
          />
          <p className="text-zinc-600">Swipe to the {direction}.</p>
        </div>

        <div className="border-t border-zinc-200 bg-zinc-50 p-5 lg:border-t-0 lg:border-l">
          <h2 className="mb-6 font-medium">Preview settings</h2>

          <div className="mb-5">
            <span id={`${id}-direction-label`} className="block font-medium">
              Direction
            </span>
            <Select
              items={directionItems}
              value={direction}
              onValueChange={(value) => {
                if (value === "left" || value === "right") {
                  setDirection(value);
                }
              }}
            >
              <SelectTrigger
                aria-labelledby={`${id}-direction-label`}
                className="mt-2 w-full"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="left">Left</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <PreviewSlider
            label="Size"
            value={size}
            min={80}
            max={180}
            step={4}
            unit="px"
            onValueChange={(value) => setSize(value)}
          />

          <PreviewSlider
            label="Duration"
            value={duration}
            min={800}
            max={4000}
            step={200}
            unit="ms"
            onValueChange={(value) => setDuration(value)}
          />

          <div>
            <span id={`${id}-iterations-label`} className="block font-medium">
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

      <CodeBlock code={example} />
    </section>
  );
};
