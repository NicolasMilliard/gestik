import { ResizeHint } from "@gestik/react";
import { useState } from "react";

import { CodeBlock } from "@/components/content/code-block";
import { Button } from "@/components/ui/button";
import { CursorArtwork } from "@/playgrounds/artwork/cursor-artwork";
import {
  CURSOR_EXAMPLE,
  CURSOR_HOTSPOT,
} from "@/playgrounds/artwork/cursor-geometry";

import { formatIterationsProp, ITERATION_OPTIONS } from "./preview-options";
import type { PreviewIterations } from "./preview-options";
import { PreviewSelect } from "./preview-select";
import { PreviewSlider } from "./preview-slider";

export const ResizeHintDemo = () => {
  const [customIcon, setCustomIcon] = useState(false);
  const [size, setSize] = useState(112);
  const [duration, setDuration] = useState(2200);
  const [iterations, setIterations] = useState<PreviewIterations>("infinite");
  const [playing, setPlaying] = useState(true);
  const [previewKey, setPreviewKey] = useState(0);

  const artworkCode = customIcon
    ? `  icon={<CursorArtwork />}\n  hotspot={{ x: 4 / 32, y: 2 / 32 }}\n  style={{ color: "#0e7490" }}\n`
    : "";

  const example = `import { ResizeHint } from "@gestik/react";${customIcon ? `\n\n${CURSOR_EXAMPLE}` : ""}

<ResizeHint
${artworkCode}  size={${size}}
  duration={${duration}}
  ${formatIterationsProp(iterations)}
  playing={${playing}}
/>`;

  const replay = () => {
    setPlaying(true);
    setPreviewKey((key) => key + 1);
  };

  return (
    <section aria-label="Interactive ResizeHint preview">
      <div className="grid min-w-0 overflow-hidden rounded-2xl border border-zinc-200 lg:grid-cols-[minmax(0,1fr)_272px]">
        <div className="playground-preview flex min-h-72 flex-col items-center justify-center gap-6 px-6 py-10 sm:min-h-80">
          <ResizeHint
            key={previewKey}
            icon={customIcon ? <CursorArtwork /> : undefined}
            hotspot={customIcon ? CURSOR_HOTSPOT : undefined}
            style={customIcon ? { color: "#0e7490" } : undefined}
            size={size}
            duration={duration}
            iterations={iterations}
            playing={playing}
          />
          <p className="text-center text-zinc-600">
            Drag the corner outward to resize.
          </p>
        </div>

        <div className="border-t border-zinc-200 bg-zinc-50 p-5 lg:border-t-0 lg:border-l">
          <h2 className="mb-6 font-medium">Preview settings</h2>
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
