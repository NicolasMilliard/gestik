import { SWIPE_HINT_DEFAULTS } from "@gestik/core";
import type { ReactNode } from "react";
import { useId } from "react";

import "@gestik/core/styles/swipe-hint.css";
import type { HintStyle } from "./hint-style";
import { PointingHand } from "./icons/pointing-hand";
import { INERT_PROPS } from "./inert-props";

const { width: SCENE_WIDTH, height: SCENE_HEIGHT } = SWIPE_HINT_DEFAULTS;

const DEFAULT_ICON = (
  <PointingHand surface="var(--gestik-swipe-hint-surface, currentColor)" />
);
// The fingertip in the icon's 256-unit viewBox.
const DEFAULT_HOTSPOT = SWIPE_HINT_DEFAULTS.hotspot;

export interface SwipeHintHotspot {
  x: number;
  y: number;
}

export interface SwipeHintProps {
  /** Direction of finger travel. Defaults to "right"; changing it restarts the cycle. */
  direction?: "right" | "left";
  /** Scene width in pixels; all artwork and spacing scale proportionally. Defaults to 112. */
  size?: number;
  /** Class for styling the outer decorative span, including CSS variables. */
  className?: string;
  /** Styles for the outer span, including --gestik-* variables. Explicit playback props take precedence. */
  style?: HintStyle;
  /** Decorative, static artwork filling a 32px box. */
  icon?: ReactNode;
  /** Contact point in the icon box, from 0 to 1 on each axis. */
  hotspot?: SwipeHintHotspot;
  /** Duration of a complete animation cycle in milliseconds. Defaults to 2200. */
  duration?: number;
  /** CSS iteration count. Defaults to "infinite"; use whole cycles to finish at rest. */
  iterations?: "infinite" | number;
  /** Pause or resume at the current frame. Defaults to true; change React key to replay. */
  playing?: boolean;
}

export const SwipeHint = ({
  direction = SWIPE_HINT_DEFAULTS.direction,
  size = SCENE_WIDTH,
  className,
  style,
  icon = DEFAULT_ICON,
  hotspot = DEFAULT_HOTSPOT,
  duration,
  iterations,
  playing,
}: SwipeHintProps) => {
  const trailId = useId();
  const scale = size / SCENE_WIDTH;

  const hintStyle: HintStyle = {
    height: SCENE_HEIGHT * scale,
    width: size,
    ...style,
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
      {...INERT_PROPS}
      style={hintStyle}
    >
      <span
        key={direction}
        className="gestik-swipe-hint__stage"
        style={{ transform: `scale(${scale})` }}
      >
        <svg
          className="gestik-swipe-hint__trail"
          viewBox="0 0 112 72"
          width={SCENE_WIDTH}
          height={SCENE_HEIGHT}
          fill="none"
          focusable="false"
        >
          <defs>
            <linearGradient
              id={`${trailId}-fade`}
              gradientUnits="userSpaceOnUse"
              x1="0"
              x2="12"
            >
              <stop offset="0" stopColor="white" stopOpacity="0" />
              <stop offset="0.25" stopColor="white" stopOpacity="0.15625" />
              <stop offset="0.5" stopColor="white" stopOpacity="0.5" />
              <stop offset="0.75" stopColor="white" stopOpacity="0.84375" />
              <stop offset="1" stopColor="white" />
            </linearGradient>
            <mask
              id={`${trailId}-mask`}
              x="0"
              y="0"
              width={SCENE_WIDTH}
              height={SCENE_HEIGHT}
              maskUnits="userSpaceOnUse"
              maskContentUnits="userSpaceOnUse"
              style={{ maskType: "alpha" }}
            >
              <g
                transform={
                  direction === "left"
                    ? "translate(108 0) scale(-1 1)"
                    : undefined
                }
              >
                <g className="gestik-swipe-hint__trail-fade">
                  <rect
                    x="-112"
                    width="336"
                    height={SCENE_HEIGHT}
                    fill={`url(#${trailId}-fade)`}
                  />
                </g>
              </g>
            </mask>
          </defs>
          <path
            d={direction === "left" ? "M82 28H26" : "M26 28H82"}
            pathLength="1"
            strokeWidth="2"
            strokeLinecap="round"
            mask={`url(#${trailId}-mask)`}
          />
        </svg>
        <span className="gestik-swipe-hint__gesture">
          <span
            className="gestik-swipe-hint__icon-anchor"
            style={{
              transform: `translate(${-hotspot.x * 100}%, ${-hotspot.y * 100}%)`,
            }}
          >
            <span
              className="gestik-swipe-hint__icon"
              style={{
                transformOrigin: `${hotspot.x * 100}% ${hotspot.y * 100}%`,
              }}
            >
              {icon}
            </span>
          </span>
        </span>
      </span>
    </span>
  );
};
