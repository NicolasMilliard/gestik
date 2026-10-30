import { ShortcutHint } from "@gestik/react";
import type { ShortcutHintKeys } from "@gestik/react";
import { useState } from "react";

import { CodeBlock } from "@/components/content/code-block";
import { Button } from "@/components/ui/button";

import { formatIterationsProp, ITERATION_OPTIONS } from "./preview-options";
import type { PreviewIterations } from "./preview-options";
import { PreviewSelect } from "./preview-select";
import { PreviewSlider } from "./preview-slider";

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
  const [iterations, setIterations] = useState<PreviewIterations>("infinite");
  const [playing, setPlaying] = useState(true);
  const [previewKey, setPreviewKey] = useState(0);
  const keys = shortcuts[keyCount];
  const instruction = `Press ${keys.join(" + ")}${keyCount === 2 ? " to open search" : " together"}.`;

  const example = `import { ShortcutHint } from "@gestik/react";

<ShortcutHint
  keys={${JSON.stringify(keys)}}
  size={${size}}
  duration={${duration}}
  ${formatIterationsProp(iterations)}
  playing={${playing}}
/>`;

  const replay = () => {
    setPlaying(true);
    setPreviewKey((key) => key + 1);
  };

  return (
    <section aria-label="Interactive ShortcutHint preview">
      <div className="grid min-w-0 overflow-hidden rounded-2xl border border-zinc-200 lg:grid-cols-[minmax(0,1fr)_272px]">
        <div className="playground-preview flex min-h-72 flex-col items-center justify-center gap-6 px-6 py-10 sm:min-h-80">
          <ShortcutHint
            key={previewKey}
            keys={keys}
            size={size}
            duration={duration}
            iterations={iterations}
            playing={playing}
          />
          <p className="text-center text-zinc-600">{instruction}</p>
        </div>

        <div className="border-t border-zinc-200 bg-zinc-50 p-5 lg:border-t-0 lg:border-l">
          <h2 className="mb-6 font-medium">Preview settings</h2>

          <PreviewSlider
            label="Keycaps"
            value={keyCount}
            min={2}
            max={4}
            step={1}
            unit=""
            onValueChange={(value) => {
              const count = value;
              if (count !== 2 && count !== 3 && count !== 4) {
                return;
              }
              setKeyCount(count);
              setSize(previewSizes[count]);
              setPreviewKey((key) => key + 1);
            }}
          />

          <PreviewSlider
            label="Size"
            value={size}
            min={80}
            max={280}
            step={4}
            unit="px"
            onValueChange={(value) => setSize(value)}
          />

          <PreviewSlider
            label="Duration"
            value={duration}
            min={1200}
            max={5000}
            step={200}
            unit="ms"
            onValueChange={(value) => setDuration(value)}
          />

          <PreviewSelect
            label="Iterations"
            items={ITERATION_OPTIONS}
            value={iterations}
            onValueChange={(value) => {
              setIterations(value);
              setPreviewKey((key) => key + 1);
            }}
          />

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
