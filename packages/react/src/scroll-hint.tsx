import {
  SCROLL_HINT_DEFAULTS,
  SCROLL_CUE_VIEW_BOX,
  SCROLL_CUE_SURFACE,
  SCROLL_CUE_OUTLINE,
} from "@gestik/core";
import type { CSSProperties } from "react";

import "@gestik/core/styles/scroll-hint.css";

const { width: SCENE_WIDTH, height: SCENE_HEIGHT } = SCROLL_HINT_DEFAULTS;

type ScrollHintStyle = CSSProperties & {
  "--gestik-scroll-hint-duration"?: string;
  "--gestik-scroll-hint-iterations"?: string;
  "--gestik-scroll-hint-play-state"?: "running" | "paused";
};

export interface ScrollHintProps {
  /** Scene width in pixels; all artwork and spacing scale proportionally. Defaults to 112. */
  size?: number;
  /** Class for styling the outer decorative span, including CSS variables. */
  className?: string;
  /** Duration of a complete animation cycle in milliseconds. Defaults to 2400. */
  duration?: number;
  /** CSS iteration count. Defaults to "infinite"; use whole cycles to finish at rest. */
  iterations?: "infinite" | number;
  /** Pause or resume at the current frame. Defaults to true; change React key to replay. */
  playing?: boolean;
}

export const ScrollHint = ({
  size = SCENE_WIDTH,
  className,
  duration,
  iterations,
  playing,
}: ScrollHintProps) => {
  const scale = size / SCENE_WIDTH;
  const style: ScrollHintStyle = {
    height: SCENE_HEIGHT * scale,
    width: size,
    ...(duration !== undefined && {
      "--gestik-scroll-hint-duration": `${duration}ms`,
    }),
    ...(iterations !== undefined && {
      "--gestik-scroll-hint-iterations": String(iterations),
    }),
    ...(playing !== undefined && {
      "--gestik-scroll-hint-play-state": playing ? "running" : "paused",
    }),
  };

  return (
    <span
      className={
        className ? `gestik-scroll-hint ${className}` : "gestik-scroll-hint"
      }
      aria-hidden="true"
      style={style}
    >
      <span
        className="gestik-scroll-hint__stage"
        style={{ transform: `scale(${scale})` }}
      >
        <svg
          className="gestik-scroll-hint__motion"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="currentColor"
          viewBox={SCROLL_CUE_VIEW_BOX}
          focusable="false"
        >
          <path d={SCROLL_CUE_SURFACE} opacity="0.2" />
          <path d={SCROLL_CUE_OUTLINE} />
        </svg>
      </span>
    </span>
  );
};
