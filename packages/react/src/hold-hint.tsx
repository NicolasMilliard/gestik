import { HOLD_HINT_DEFAULTS, POINTING_HAND_SILHOUETTE } from "@gestik/core";
import type { CSSProperties } from "react";
import { useId } from "react";

import "@gestik/core/styles/hold-hint.css";
import { IconMask } from "./icon-mask";
import { PointingHand } from "./icons/pointing-hand";

const { width: SCENE_WIDTH, height: SCENE_HEIGHT } = HOLD_HINT_DEFAULTS;
const ICON_SIZE = HOLD_HINT_DEFAULTS.iconSize;
// Keep the hand and its cutout anchored at the icon's fingertip (116, 16).
const ICON_X = -HOLD_HINT_DEFAULTS.hotspot.x * ICON_SIZE;
const ICON_Y = -HOLD_HINT_DEFAULTS.hotspot.y * ICON_SIZE;

type HoldHintStyle = CSSProperties & {
  "--gestik-hold-hint-duration"?: string;
  "--gestik-hold-hint-iterations"?: string;
  "--gestik-hold-hint-play-state"?: "running" | "paused";
};

export interface HoldHintProps {
  /** Scene width in pixels; all artwork and spacing scale proportionally. Defaults to 112. */
  size?: number;
  /** Class for styling the outer decorative span, including CSS variables. */
  className?: string;
  /** Duration of a complete animation cycle in milliseconds. Defaults to 3000. */
  duration?: number;
  /** CSS iteration count. Defaults to "infinite"; use whole cycles to finish at rest. */
  iterations?: "infinite" | number;
  /** Pause or resume at the current frame. Defaults to true; change React key to replay. */
  playing?: boolean;
}

export const HoldHint = ({
  size = SCENE_WIDTH,
  className,
  duration,
  iterations,
  playing,
}: HoldHintProps) => {
  const maskId = useId();
  const scale = size / SCENE_WIDTH;
  const style: HoldHintStyle = {
    height: SCENE_HEIGHT * scale,
    width: size,
    ...(duration !== undefined && {
      "--gestik-hold-hint-duration": `${duration}ms`,
    }),
    ...(iterations !== undefined && {
      "--gestik-hold-hint-iterations": String(iterations),
    }),
    ...(playing !== undefined && {
      "--gestik-hold-hint-play-state": playing ? "running" : "paused",
    }),
  };

  return (
    <span
      className={
        className ? `gestik-hold-hint ${className}` : "gestik-hold-hint"
      }
      aria-hidden="true"
      style={style}
    >
      <IconMask id={maskId} width={SCENE_WIDTH} height={SCENE_HEIGHT}>
        <g transform="translate(56 26)">
          <g className="gestik-hold-hint__press">
            <svg
              x={ICON_X}
              y={ICON_Y}
              width={ICON_SIZE}
              height={ICON_SIZE}
              viewBox={POINTING_HAND_SILHOUETTE.viewBox}
              focusable="false"
            >
              <path d={POINTING_HAND_SILHOUETTE.path} />
            </svg>
          </g>
        </g>
      </IconMask>
      <svg
        className="gestik-hold-hint__stage"
        viewBox="0 0 112 72"
        width={SCENE_WIDTH}
        height={SCENE_HEIGHT}
        fill="none"
        focusable="false"
        style={{ transform: `scale(${scale})` }}
      >
        <g mask={`url(#${maskId})`}>
          <g className="gestik-hold-hint__ring" transform="rotate(-90 56 26)">
            <circle
              className="gestik-hold-hint__track"
              cx="56"
              cy="26"
              r="12"
              strokeWidth="2"
            />
            <circle
              className="gestik-hold-hint__progress"
              cx="56"
              cy="26"
              r="12"
              pathLength="1"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        </g>
        <g transform="translate(56 26)">
          <g className="gestik-hold-hint__press">
            <svg
              x={ICON_X}
              y={ICON_Y}
              width={ICON_SIZE}
              height={ICON_SIZE}
              viewBox="0 0 32 32"
              focusable="false"
            >
              <PointingHand />
            </svg>
          </g>
        </g>
      </svg>
    </span>
  );
};
