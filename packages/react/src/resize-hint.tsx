import { RESIZE_HINT_DEFAULTS, POINTING_HAND_SILHOUETTE } from "@gestik/core";
import type { CSSProperties } from "react";
import { useId } from "react";

import "@gestik/core/styles/resize-hint.css";
import { IconMask } from "./icon-mask";
import { PointingHand } from "./icons/pointing-hand";

const { width: SCENE_WIDTH, height: SCENE_HEIGHT } = RESIZE_HINT_DEFAULTS;
const ICON_SIZE = RESIZE_HINT_DEFAULTS.iconSize;
// Anchor the fingertip and cutout on the rounded edge, slightly inside the
// frame's geometric corner now that there is no separate handle.
const ICON_X = -RESIZE_HINT_DEFAULTS.hotspot.x * ICON_SIZE;
const ICON_Y = -RESIZE_HINT_DEFAULTS.hotspot.y * ICON_SIZE;

type ResizeHintStyle = CSSProperties & {
  "--gestik-resize-hint-duration"?: string;
  "--gestik-resize-hint-iterations"?: string;
  "--gestik-resize-hint-play-state"?: "running" | "paused";
};

export interface ResizeHintProps {
  /** Scene width in pixels; all artwork and spacing scale proportionally. Defaults to 112. */
  size?: number;
  /** Class for styling the outer decorative span, including CSS variables. */
  className?: string;
  /** Duration of a complete animation cycle in milliseconds. Defaults to 2200. */
  duration?: number;
  /** CSS iteration count. Defaults to "infinite"; use whole cycles to finish at rest. */
  iterations?: "infinite" | number;
  /** Pause or resume at the current frame. Defaults to true; change React key to replay. */
  playing?: boolean;
}

export const ResizeHint = ({
  size = SCENE_WIDTH,
  className,
  duration,
  iterations,
  playing,
}: ResizeHintProps) => {
  const maskId = useId();
  const scale = size / SCENE_WIDTH;
  const style: ResizeHintStyle = {
    height: SCENE_HEIGHT * scale,
    width: size,
    ...(duration !== undefined && {
      "--gestik-resize-hint-duration": `${duration}ms`,
    }),
    ...(iterations !== undefined && {
      "--gestik-resize-hint-iterations": String(iterations),
    }),
    ...(playing !== undefined && {
      "--gestik-resize-hint-play-state": playing ? "running" : "paused",
    }),
  };

  return (
    <span
      className={
        className ? `gestik-resize-hint ${className}` : "gestik-resize-hint"
      }
      aria-hidden="true"
      style={style}
    >
      <IconMask id={maskId} width={SCENE_WIDTH} height={SCENE_HEIGHT}>
        <g transform="translate(54.5 34.5)">
          <g className="gestik-resize-hint__travel">
            <g className="gestik-resize-hint__press">
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
        </g>
      </IconMask>
      <svg
        className="gestik-resize-hint__stage"
        viewBox="0 0 112 88"
        width={SCENE_WIDTH}
        height={SCENE_HEIGHT}
        fill="none"
        focusable="false"
        style={{ transform: `scale(${scale})` }}
      >
        <g className="gestik-resize-hint__artwork">
          <g mask={`url(#${maskId})`}>
            <rect
              className="gestik-resize-hint__frame"
              x="24"
              y="12"
              width="32"
              height="24"
              rx="5"
              strokeWidth="2"
            />
          </g>
          <g transform="translate(54.5 34.5)">
            <g className="gestik-resize-hint__travel">
              <g className="gestik-resize-hint__press">
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
          </g>
        </g>
      </svg>
    </span>
  );
};
