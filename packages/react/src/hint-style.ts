import type { CSSProperties } from "react";

/** Styles for a hint's outer span, including Gestik's CSS custom properties. */
export type HintStyle = CSSProperties &
  Record<`--gestik-${string}`, string | number | undefined>;
