import { DragHint } from "@gestik/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const silhouettes = {
  grabbing: {
    path: "M6 14V9a2 2 0 0 1 4 0V8a2 2 0 0 1 4 0v1a2 2 0 0 1 4 0v2a2 2 0 0 1 4 0v3a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8 2 2 0 0 1 4 0Z",
    viewBox: "0 0 24 24",
  },
  idle: {
    path: "M6 13V6a2 2 0 0 1 4 0V4a2 2 0 0 1 4 0v2a2 2 0 0 1 4 0v2a2 2 0 0 1 4 0v6a8 8 0 0 1-8 8h-2c-3 0-5-1-7-3l-3-3a2 2 0 0 1 3-3l1 1Z",
    viewBox: "0 0 24 24",
  },
};

const styles = ["Filled", "Outline", "Duotone"] as const;

const DemoHand = ({
  pose,
  variant,
}: {
  pose: keyof typeof silhouettes;
  variant: (typeof styles)[number];
}) => (
  <svg
    viewBox={silhouettes[pose].viewBox}
    width="100%"
    height="100%"
    focusable="false"
  >
    <path
      d={silhouettes[pose].path}
      fill={variant === "Outline" ? "none" : "currentColor"}
      fillOpacity={variant === "Duotone" ? 0.2 : 1}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

export const DragHintMaskDemo = () => {
  const [playing, setPlaying] = useState(true);
  const [replay, setReplay] = useState(0);

  return (
    <section className="mt-16" aria-labelledby="drag-hint-icons-title">
      <h3 className="text-2xl font-semibold" id="drag-hint-icons-title">
        Filled, outline, and duotone icons
      </h3>
      <p className="mt-3 text-sm leading-6 text-zinc-600">
        The same silhouette works with all three styles. The square,
        destination, and shadow are cut away behind the hand, revealing the
        actual background through transparent or translucent icons.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {styles.map((variant) => (
          <div
            className="overflow-hidden rounded-xl border border-zinc-200"
            key={variant}
          >
            <div className="drag-mask-example flex min-h-44 items-center justify-center">
              <DragHint
                key={replay}
                size={168}
                className="drag-mask-example__hint"
                icons={{
                  grabbing: <DemoHand pose="grabbing" variant={variant} />,
                  idle: <DemoHand pose="idle" variant={variant} />,
                }}
                iconMasks={silhouettes}
                playing={playing}
              />
            </div>
            <p className="border-t border-zinc-200 p-3 text-center text-sm">
              {variant}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <Button variant="outline" onClick={() => setPlaying(!playing)}>
          {playing ? "Pause icon examples" : "Resume icon examples"}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setReplay(replay + 1);
            setPlaying(true);
          }}
        >
          Replay icon examples
        </Button>
      </div>
      <p className="mt-6 text-sm leading-6 text-zinc-600">
        Built-in hands include their masks. For custom icons, pass an
        <code> iconMasks </code> pair: each silhouette contains a filled SVG
        <code> path </code> and the same <code>viewBox</code> as its icon.
        Include the entire area to hide, including an outline icon&apos;s hollow
        interior. Custom icons without silhouettes render without masking.
      </p>
      <pre className="mt-3 overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-xs leading-6 sm:text-sm">
        <code>{`<DragHint
  icons={{ idle: <OpenHand />, grabbing: <ClosedHand /> }}
  iconMasks={{
    idle: { path: openHandSilhouette, viewBox: "0 0 24 24" },
    grabbing: { path: closedHandSilhouette, viewBox: "0 0 24 24" },
  }}
/>`}</code>
      </pre>
    </section>
  );
};
