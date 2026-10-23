import type { CSSProperties, ReactNode } from "react";

import "./drag-hint.css";
import { ClosedHand } from "./icons/closed-hand";
import { OpenHand } from "./icons/open-hand";

const SCENE_WIDTH = 112;
const SCENE_HEIGHT = 72;

const DEFAULT_ICONS = { grabbing: <ClosedHand />, idle: <OpenHand /> };
const DEFAULT_HOTSPOT = { x: 0.44, y: 0 };

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
  hotspot = DEFAULT_HOTSPOT,
  duration,
  iterations,
  playing,
}: DragHintProps) => {
  const scale = size / SCENE_WIDTH;

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
        <svg
          className="gestik-drag-hint__destination"
          viewBox="0 0 32 32"
          width="32"
          height="32"
          fill="none"
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
            >
              <rect x="1" y="1" width="30" height="30" rx="7" strokeWidth="2" />
            </svg>

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
