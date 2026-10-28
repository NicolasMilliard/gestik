import type { CSSProperties } from "react";
import { useId } from "react";

import "./resize-hint.css";
import { IconMask } from "./icon-mask";
import { POINTING_HAND_SILHOUETTE, PointingHand } from "./icons/pointing-hand";

const SCENE_WIDTH = 112;
const SCENE_HEIGHT = 88;
const ICON_SIZE = 32;
// Anchor the fingertip and cutout on the rounded edge, slightly inside the
// frame's geometric corner now that there is no separate handle.
const ICON_X = -(116 / 256) * ICON_SIZE;
const ICON_Y = -(16 / 256) * ICON_SIZE;

type ResizeHintStyle = CSSProperties & {
  "--gestik-resize-hint-duration"?: string;
  "--gestik-resize-hint-iterations"?: string;
  "--gestik-resize-hint-play-state"?: "running" | "paused";
};

export interface ResizeHintProps {
  size?: number;
  className?: string;
  duration?: number;
  iterations?: "infinite" | number;
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
