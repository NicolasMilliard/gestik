import type { CSSProperties, ReactNode } from "react";
import { useId } from "react";

import "./drag-hint.css";
import type { IconSilhouette } from "./icon-mask";
import { IconMask } from "./icon-mask";
import { CLOSED_HAND_SILHOUETTE, ClosedHand } from "./icons/closed-hand";
import { OPEN_HAND_SILHOUETTE, OpenHand } from "./icons/open-hand";

const SCENE_WIDTH = 112;
const SCENE_HEIGHT = 72;
const ICON_SIZE = 24;

const DEFAULT_ICONS = { grabbing: <ClosedHand />, idle: <OpenHand /> };
const DEFAULT_ICON_MASKS = {
  grabbing: CLOSED_HAND_SILHOUETTE,
  idle: OPEN_HAND_SILHOUETTE,
};
// Both poses share this palm point and the same wrist position.
const DEFAULT_HOTSPOT = { x: 128 / 256, y: 152 / 256 };

export interface DragHintHotspot {
  x: number;
  y: number;
}

type DragHintStyle = CSSProperties & {
  "--gestik-drag-hint-duration"?: string;
  "--gestik-drag-hint-iterations"?: string;
  "--gestik-drag-hint-play-state"?: "running" | "paused";
};

export interface DragHintProps {
  direction?: "right" | "left";
  size?: number;
  className?: string;
  icons?: {
    idle: ReactNode;
    grabbing: ReactNode;
  };
  iconMasks?: {
    idle: IconSilhouette;
    grabbing: IconSilhouette;
  };
  hotspot?: DragHintHotspot;
  duration?: number;
  iterations?: "infinite" | number;
  playing?: boolean;
}

export const DragHint = ({
  direction = "right",
  size = SCENE_WIDTH,
  className,
  icons = DEFAULT_ICONS,
  iconMasks,
  hotspot = DEFAULT_HOTSPOT,
  duration,
  iterations,
  playing,
}: DragHintProps) => {
  const maskId = useId();
  const scale = size / SCENE_WIDTH;
  const masks =
    iconMasks ?? (icons === DEFAULT_ICONS ? DEFAULT_ICON_MASKS : undefined);

  const style: DragHintStyle = {
    height: SCENE_HEIGHT * scale,
    width: size,
    ...(duration !== undefined && {
      "--gestik-drag-hint-duration": `${duration}ms`,
    }),
    ...(iterations !== undefined && {
      "--gestik-drag-hint-iterations": String(iterations),
    }),
    ...(playing !== undefined && {
      "--gestik-drag-hint-play-state": playing ? "running" : "paused",
    }),
  };

  return (
    <span
      className={
        className ? `gestik-drag-hint ${className}` : "gestik-drag-hint"
      }
      data-direction={direction}
      aria-hidden="true"
      style={style}
    >
      <span
        key={direction}
        className="gestik-drag-hint__stage"
        style={{ transform: `scale(${scale})` }}
      >
        {masks && (
          <IconMask id={maskId} width={SCENE_WIDTH} height={SCENE_HEIGHT}>
            <g className="gestik-drag-hint__mask-origin">
              <g className="gestik-drag-hint__mask-travel">
                <g className="gestik-drag-hint__mask-lift">
                  {(["idle", "grabbing"] as const).map((pose) => (
                    <svg
                      key={pose}
                      className={`gestik-drag-hint__mask--${pose}`}
                      x={16 - hotspot.x * ICON_SIZE}
                      y={16 - hotspot.y * ICON_SIZE}
                      width={ICON_SIZE}
                      height={ICON_SIZE}
                      viewBox={masks[pose].viewBox}
                      focusable="false"
                    >
                      <path d={masks[pose].path} />
                    </svg>
                  ))}
                </g>
              </g>
            </g>
          </IconMask>
        )}

        <span
          className="gestik-drag-hint__background"
          style={masks ? { mask: `url(#${maskId})` } : undefined}
        >
          <svg
            className="gestik-drag-hint__destination"
            viewBox="0 0 32 32"
            width="32"
            height="32"
            fill="none"
            focusable="false"
          >
            <rect
              x="1"
              y="1"
              width="30"
              height="30"
              rx="7"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </svg>

          <span className="gestik-drag-hint__drag-group">
            <span className="gestik-drag-hint__lift-group">
              <svg
                className="gestik-drag-hint__square"
                viewBox="0 0 32 32"
                width="32"
                height="32"
                fill="none"
                focusable="false"
              >
                <rect
                  x="1"
                  y="1"
                  width="30"
                  height="30"
                  rx="7"
                  strokeWidth="2"
                />
              </svg>
            </span>
          </span>
        </span>

        <span className="gestik-drag-hint__drag-group">
          <span className="gestik-drag-hint__lift-group">
            <span
              className="gestik-drag-hint__icon-anchor"
              style={{
                transform: `translate(${-hotspot.x * 100}%, ${-hotspot.y * 100}%)`,
              }}
            >
              <span className="gestik-drag-hint__icon gestik-drag-hint__icon--idle">
                {icons.idle}
              </span>
              <span className="gestik-drag-hint__icon gestik-drag-hint__icon--grabbing">
                {icons.grabbing}
              </span>
            </span>
          </span>
        </span>
      </span>
    </span>
  );
};
