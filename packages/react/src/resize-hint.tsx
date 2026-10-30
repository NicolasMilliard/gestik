import { RESIZE_HINT_DEFAULTS, POINTING_HAND_SILHOUETTE } from "@gestik/core";
import type { HintHotspot } from "@gestik/core";
import { useId, useRef } from "react";
import type { ReactNode } from "react";

import "@gestik/core/styles/resize-hint.css";
import type { HintStyle } from "./hint-style";
import { IconMask } from "./icon-mask";
import { PointingHand } from "./icons/pointing-hand";
import { INERT_PROPS } from "./inert-props";
import { useSvgSilhouettes } from "./use-svg-silhouettes";

const { width: SCENE_WIDTH, height: SCENE_HEIGHT } = RESIZE_HINT_DEFAULTS;
const ICON_SIZE = RESIZE_HINT_DEFAULTS.iconSize;
const DEFAULT_ICON = <PointingHand />;

export interface ResizeHintProps {
  /** Scene width in pixels; all artwork and spacing scale proportionally. Defaults to 112. */
  size?: number;
  /** Static inline SVG artwork filling a 32px box; cutouts are generated automatically. Defaults to the built-in pointing hand. */
  icon?: ReactNode;
  /** Contact point in the icon box, from 0 to 1 on each axis. Defaults to the built-in fingertip. */
  hotspot?: HintHotspot;
  /** Class for styling the outer decorative span, including CSS variables. */
  className?: string;
  /** Styles for the outer span, including --gestik-* variables. Explicit playback props take precedence. */
  style?: HintStyle;
  /** Duration of a complete animation cycle in milliseconds. Defaults to 2200. */
  duration?: number;
  /** CSS iteration count. Defaults to "infinite"; use whole cycles to finish at rest. */
  iterations?: "infinite" | number;
  /** Pause or resume at the current frame. Defaults to true; change React key to replay. */
  playing?: boolean;
}

export const ResizeHint = ({
  size = SCENE_WIDTH,
  icon = DEFAULT_ICON,
  hotspot = RESIZE_HINT_DEFAULTS.hotspot,
  className,
  style,
  duration,
  iterations,
  playing,
}: ResizeHintProps) => {
  const maskId = useId();
  const scale = size / SCENE_WIDTH;
  const isDefaultIcon = icon === DEFAULT_ICON;
  const artworkRef = useRef<SVGGElement>(null);
  const stageRef = useRef<SVGSVGElement>(null);
  const hasCustomIcon =
    !isDefaultIcon && icon !== null && typeof icon !== "boolean";
  const generated = useSvgSilhouettes(
    { icon: artworkRef },
    hasCustomIcon,
    stageRef
  );
  const mask = isDefaultIcon
    ? POINTING_HAND_SILHOUETTE
    : hasCustomIcon && generated.silhouettes.icon;
  const iconX = -hotspot.x * ICON_SIZE;
  const iconY = -hotspot.y * ICON_SIZE;
  const hintStyle: HintStyle = {
    height: SCENE_HEIGHT * scale,
    width: size,
    ...style,
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
      {...INERT_PROPS}
      style={hintStyle}
    >
      <svg
        key={String(isDefaultIcon)}
        ref={stageRef}
        data-ready={generated.ready}
        className="gestik-resize-hint__stage"
        viewBox="0 0 112 88"
        width={SCENE_WIDTH}
        height={SCENE_HEIGHT}
        fill="none"
        focusable="false"
        style={{ transform: `scale(${scale})` }}
      >
        {mask && (
          <IconMask id={maskId} width={SCENE_WIDTH} height={SCENE_HEIGHT}>
            <g transform="translate(54.5 34.5)">
              <g className="gestik-resize-hint__travel">
                <g className="gestik-resize-hint__press">
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
            </g>
          </IconMask>
        )}
        <g className="gestik-resize-hint__artwork">
          <g mask={mask ? `url(#${maskId})` : undefined}>
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
                  className="gestik-resize-hint__icon-anchor"
                  x={iconX}
                  y={iconY}
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                  viewBox="0 0 32 32"
                  fill="black"
                  focusable="false"
                >
                  <g ref={artworkRef}>
                    {isDefaultIcon ? (
                      icon
                    ) : (
                      <foreignObject width={ICON_SIZE} height={ICON_SIZE}>
                        <span className="gestik-resize-hint__icon">{icon}</span>
                      </foreignObject>
                    )}
                  </g>
                </svg>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </span>
  );
};
