import type { ReactNode } from "react";
import { useState } from "react";

import { CodeBlock } from "@/components/content/code-block";
import { Button } from "@/components/ui/button";

export const HintExample = ({
  description,
  code,
  css,
  children,
}: {
  description: string;
  code: string;
  css: string;
  children: (playing: boolean) => ReactNode;
}) => {
  const [playing, setPlaying] = useState(true);
  const [replay, setReplay] = useState(0);

  return (
    <div className="mt-6">
      <div className="overflow-hidden rounded-2xl border border-zinc-200">
        <div className="playground-preview flex min-h-48 flex-col items-center justify-center gap-6 p-6 sm:flex-row sm:justify-start">
          <div
            key={replay}
            className="flex shrink-0 items-center justify-center"
          >
            {children(playing)}
          </div>
          <p className="max-w-sm text-center leading-7 text-zinc-600 sm:text-left">
            {description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 border-t border-zinc-200 bg-zinc-50/70 px-5 py-3">
          <Button
            variant="outline"
            onClick={() => setPlaying((current) => !current)}
          >
            {playing ? "Pause" : "Resume"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setPlaying(true);
              setReplay((current) => current + 1);
            }}
          >
            Replay
          </Button>
        </div>
      </div>
      <CodeBlock code={code} />
      <CodeBlock code={css} language="css" />
    </div>
  );
};
