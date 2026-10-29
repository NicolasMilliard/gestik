import {
  SCROLL_HINT_DEFAULTS,
  SCROLL_CUE_VIEW_BOX,
  SCROLL_CUE_SURFACE,
  SCROLL_CUE_OUTLINE,
} from "@gestik/core";

import "@gestik/core/styles/scroll-hint.css";
import type { ReactNode } from "react";

import type { HintStyle } from "./hint-style";
import { INERT_PROPS } from "./inert-props";

const { width: SCENE_WIDTH, height: SCENE_HEIGHT } = SCROLL_HINT_DEFAULTS;

export interface ScrollHintProps {
  /** Scene width in pixels; all artwork and spacing scale proportionally. Defaults to 112. */
  size?: number;
  /** Decorative, static artwork filling a 32px box. Defaults to the built-in scroll cue. */
  icon?: ReactNode;
  /** Class for styling the outer decorative span, including CSS variables. */
  className?: string;
  /** Styles for the outer span, including --gestik-* variables. Explicit playback props take precedence. */
  style?: HintStyle;
  /** Duration of a complete animation cycle in milliseconds. Defaults to 2400. */
  duration?: number;
  /** CSS iteration count. Defaults to "infinite"; use whole cycles to finish at rest. */
  iterations?: "infinite" | number;
  /** Pause or resume at the current frame. Defaults to true; change React key to replay. */
  playing?: boolean;
}

export const ScrollHint = ({
  size = SCENE_WIDTH,
  icon,
  className,
  style,
  duration,
  iterations,
  playing,
}: ScrollHintProps) => {
  const scale = size / SCENE_WIDTH;
  const hintStyle: HintStyle = {
    height: SCENE_HEIGHT * scale,
    width: size,
    ...style,
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
      {...INERT_PROPS}
      style={hintStyle}
    >
      <span
        className="gestik-scroll-hint__stage"
        style={{ transform: `scale(${scale})` }}
      >
        {icon === undefined ? (
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
        ) : (
          <span className="gestik-scroll-hint__motion">{icon}</span>
        )}
      </span>
    </span>
  );
};
