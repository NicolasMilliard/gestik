import { HOLD_HINT_DEFAULTS, POINTING_HAND_SILHOUETTE } from "@gestik/core";
import type { HintHotspot, IconSilhouette } from "@gestik/core";
import { Fragment, useId } from "react";
import type { ReactNode } from "react";

import "@gestik/core/styles/hold-hint.css";
import type { HintStyle } from "./hint-style";
import { IconMask } from "./icon-mask";
import { PointingHand } from "./icons/pointing-hand";
import { INERT_PROPS } from "./inert-props";

const { width: SCENE_WIDTH, height: SCENE_HEIGHT } = HOLD_HINT_DEFAULTS;
const ICON_SIZE = HOLD_HINT_DEFAULTS.iconSize;
const DEFAULT_ICON = <PointingHand />;

export interface HoldHintProps {
  /** Scene width in pixels; all artwork and spacing scale proportionally. Defaults to 112. */
  size?: number;
  /** Decorative, static artwork filling a 32px box. Defaults to the built-in pointing hand. */
  icon?: ReactNode;
  /** Filled silhouette for the icon's cutout. Custom icons otherwise render without masking. */
  iconMask?: IconSilhouette;
  /** Contact point in the icon box, from 0 to 1 on each axis. Defaults to the built-in fingertip. */
  hotspot?: HintHotspot;
  /** Class for styling the outer decorative span, including CSS variables. */
  className?: string;
  /** Styles for the outer span, including --gestik-* variables. Explicit playback props take precedence. */
  style?: HintStyle;
  /** Duration of a complete animation cycle in milliseconds. Defaults to 3000. */
  duration?: number;
  /** CSS iteration count. Defaults to "infinite"; use whole cycles to finish at rest. */
  iterations?: "infinite" | number;
  /** Pause or resume at the current frame. Defaults to true; change React key to replay. */
  playing?: boolean;
}

export const HoldHint = ({
  size = SCENE_WIDTH,
  icon = DEFAULT_ICON,
  iconMask,
  hotspot = HOLD_HINT_DEFAULTS.hotspot,
  className,
  style,
  duration,
  iterations,
  playing,
}: HoldHintProps) => {
  const maskId = useId();
  const scale = size / SCENE_WIDTH;
  const isDefaultIcon = icon === DEFAULT_ICON;
  const mask =
    iconMask ?? (isDefaultIcon ? POINTING_HAND_SILHOUETTE : undefined);
  const iconX = -hotspot.x * ICON_SIZE;
  const iconY = -hotspot.y * ICON_SIZE;
  const hintStyle: HintStyle = {
    height: SCENE_HEIGHT * scale,
    width: size,
    ...style,
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
      {...INERT_PROPS}
      style={hintStyle}
    >
      <Fragment key={`${isDefaultIcon}-${Boolean(mask)}`}>
        {mask && (
          <IconMask id={maskId} width={SCENE_WIDTH} height={SCENE_HEIGHT}>
            <g transform="translate(56 26)">
              <g className="gestik-hold-hint__press">
                <svg
                  x={iconX}
                  y={iconY}
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                  viewBox={mask.viewBox}
                  focusable="false"
                >
                  <path d={mask.path} />
                </svg>
              </g>
            </g>
          </IconMask>
        )}
        <svg
          className="gestik-hold-hint__stage"
          viewBox="0 0 112 72"
          width={SCENE_WIDTH}
          height={SCENE_HEIGHT}
          fill="none"
          focusable="false"
          style={{ transform: `scale(${scale})` }}
        >
          <g mask={mask ? `url(#${maskId})` : undefined}>
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
          {isDefaultIcon && (
            <g transform="translate(56 26)">
              <g className="gestik-hold-hint__press">
                <svg
                  x={iconX}
                  y={iconY}
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                  viewBox="0 0 32 32"
                  focusable="false"
                >
                  {icon}
                </svg>
              </g>
            </g>
          )}
        </svg>
        {!isDefaultIcon && (
          <span
            className="gestik-hold-hint__stage"
            style={{ transform: `scale(${scale})` }}
          >
            <span className="gestik-hold-hint__icon-origin">
              <span className="gestik-hold-hint__press">
                <span
                  className="gestik-hold-hint__icon"
                  style={{
                    transform: `translate(${-hotspot.x * 100}%, ${-hotspot.y * 100}%)`,
                  }}
                >
                  {icon}
                </span>
              </span>
            </span>
          </span>
        )}
      </Fragment>
    </span>
  );
};
