import type { CSSProperties, ReactNode } from "react";

import "./swipe-hint.css";
import { PointingHand } from "./icons/pointing-hand";

const SCENE_WIDTH = 112;
const SCENE_HEIGHT = 72;

const DEFAULT_ICON = <PointingHand />;
const DEFAULT_HOTSPOT = { x: 11 / 24, y: 2 / 24 };

export interface SwipeHintHotspot {
  x: number;
  y: number;
}

type SwipeHintStyle = CSSProperties & {
  "--gestik-swipe-hint-duration"?: string;
  "--gestik-swipe-hint-iterations"?: string;
  "--gestik-swipe-hint-play-state"?: "running" | "paused";
};

export interface SwipeHintProps {
  direction?: "right" | "left";
  size?: number;
  className?: string;
  icon?: ReactNode;
  hotspot?: SwipeHintHotspot;
  duration?: number;
  iterations?: "infinite" | number;
  playing?: boolean;
}

export const SwipeHint = ({
  direction = "right",
  size = SCENE_WIDTH,
  className,
  icon = DEFAULT_ICON,
  hotspot = DEFAULT_HOTSPOT,
  duration,
  iterations,
  playing,
}: SwipeHintProps) => {
  const scale = size / SCENE_WIDTH;

  const style: SwipeHintStyle = {
    height: SCENE_HEIGHT * scale,
    width: size,
    ...(duration !== undefined && {
      "--gestik-swipe-hint-duration": `${duration}ms`,
    }),
    ...(iterations !== undefined && {
      "--gestik-swipe-hint-iterations": String(iterations),
    }),
    ...(playing !== undefined && {
      "--gestik-swipe-hint-play-state": playing ? "running" : "paused",
    }),
  };

  return (
    <span
      className={
        className ? `gestik-swipe-hint ${className}` : "gestik-swipe-hint"
      }
      data-direction={direction}
      aria-hidden="true"
      style={style}
    >
      <span
        key={direction}
        className="gestik-swipe-hint__stage"
        style={{ transform: `scale(${scale})` }}
      >
        <svg
          className="gestik-swipe-hint__track"
          viewBox="0 0 112 72"
          width="112"
          height="72"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          focusable="false"
        >
          <path d="M26 28h56m-6-6 6 6-6 6" />
        </svg>

        <span className="gestik-swipe-hint__gesture">
          <span className="gestik-swipe-hint__contact" />
          <span
            className="gestik-swipe-hint__icon-anchor"
            style={{
              transform: `translate(${-hotspot.x * 100}%, ${-hotspot.y * 100}%)`,
            }}
          >
            {icon}
          </span>
        </span>
      </span>
    </span>
  );
};
