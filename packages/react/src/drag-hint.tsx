import {
  DRAG_HINT_DEFAULTS,
  CLOSED_HAND_SILHOUETTE,
  OPEN_HAND_SILHOUETTE,
} from "@gestik/core";
import type { IconSilhouette } from "@gestik/core";
import type { ReactNode } from "react";

import "@gestik/core/styles/drag-hint.css";
import { useId } from "react";

import type { HintStyle } from "./hint-style";
import { ClosedHand } from "./icons/closed-hand";
import { OpenHand } from "./icons/open-hand";
import { INERT_PROPS } from "./inert-props";

const { width: SCENE_WIDTH, height: SCENE_HEIGHT } = DRAG_HINT_DEFAULTS;
const ICON_SIZE = DRAG_HINT_DEFAULTS.iconSize;

const DEFAULT_ICONS = { grabbing: <ClosedHand />, idle: <OpenHand /> };
const DEFAULT_ICON_MASKS = {
  grabbing: CLOSED_HAND_SILHOUETTE,
  idle: OPEN_HAND_SILHOUETTE,
};
// A shared top-center hotspot places both poses across the square's lower edge.
const DEFAULT_HOTSPOT = DRAG_HINT_DEFAULTS.hotspot;

export interface DragHintHotspot {
  x: number;
  y: number;
}

export interface DragHintProps {
  /** Direction of element travel. Defaults to "right"; changing it restarts the cycle. */
  direction?: "right" | "left";
  /** Scene width in pixels; all artwork and spacing scale proportionally. Defaults to 112. */
  size?: number;
  /** Class for styling the outer decorative span, including CSS variables. */
  className?: string;
  /** Styles for the outer span, including --gestik-* variables. Explicit playback props take precedence. */
  style?: HintStyle;
  /** Decorative, static artwork filling a 24px box in each pose. */
  icons?: {
    idle: ReactNode;
    grabbing: ReactNode;
  };
  /** Filled SVG silhouettes for custom poses. Custom icons otherwise render without cutouts. */
  iconMasks?: {
    idle: IconSilhouette;
    grabbing: IconSilhouette;
  };
  /** Contact point in the icon box, from 0 to 1 on each axis. */
  hotspot?: DragHintHotspot;
  /** Duration of a complete animation cycle in milliseconds. Defaults to 2800. */
  duration?: number;
  /** CSS iteration count. Defaults to "infinite"; use whole cycles to finish at rest. */
  iterations?: "infinite" | number;
  /** Pause or resume at the current frame. Defaults to true; change React key to replay. */
  playing?: boolean;
}

export const DragHint = ({
  direction = DRAG_HINT_DEFAULTS.direction,
  size = SCENE_WIDTH,
  className,
  style,
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

  const silhouettes =
    masks &&
    (["idle", "grabbing"] as const).map((pose) => (
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
    ));

  const hintStyle: HintStyle = {
    height: SCENE_HEIGHT * scale,
    width: size,
    ...style,
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
      {...INERT_PROPS}
      style={hintStyle}
    >
      <span
        key={`${direction}-${icons === DEFAULT_ICONS}-${Boolean(masks)}`}
        className="gestik-drag-hint__stage"
        style={{ transform: `scale(${scale})` }}
      >
        <svg
          className="gestik-drag-hint__background"
          viewBox="0 0 112 72"
          width={SCENE_WIDTH}
          height={SCENE_HEIGHT}
          fill="none"
          focusable="false"
        >
          <defs>
            {masks && (
              <>
                <mask
                  id={maskId}
                  x="0"
                  y="0"
                  width={SCENE_WIDTH}
                  height={SCENE_HEIGHT}
                  maskUnits="userSpaceOnUse"
                  style={{ maskType: "luminance" }}
                >
                  <rect
                    width={SCENE_WIDTH}
                    height={SCENE_HEIGHT}
                    fill="white"
                  />
                  <g fill="black" className="gestik-drag-hint__mask-origin">
                    <g className="gestik-drag-hint__mask-travel">
                      <g className="gestik-drag-hint__mask-lift">
                        {silhouettes}
                      </g>
                    </g>
                  </g>
                </mask>
                <mask
                  id={`${maskId}-square`}
                  x="-16"
                  y="-16"
                  width="64"
                  height="80"
                  maskUnits="userSpaceOnUse"
                  style={{ maskType: "luminance" }}
                >
                  <rect x="-16" y="-16" width="64" height="80" fill="white" />
                  <g fill="black">{silhouettes}</g>
                </mask>
              </>
            )}
            <filter
              id={`${maskId}-shadow`}
              x="-16"
              y="-16"
              width="64"
              height="80"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur stdDeviation="4" />
              <feOffset dy="5" />
              <feComposite in2="SourceGraphic" operator="out" />
            </filter>
          </defs>
          <g
            className="gestik-drag-hint__masked-scene"
            mask={masks ? `url(#${maskId})` : undefined}
          >
            <g className="gestik-drag-hint__destination">
              <rect
                x="1"
                y="1"
                width="30"
                height="30"
                rx="7"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            </g>
          </g>
          <g className="gestik-drag-hint__square-origin">
            <g className="gestik-drag-hint__drag-group">
              <g className="gestik-drag-hint__lift-group">
                <g
                  className="gestik-drag-hint__square-scene"
                  mask={masks ? `url(#${maskId}-square)` : undefined}
                >
                  {/* WebKit clips filtered pixels to the masked group's geometry bounds. */}
                  <rect
                    className="gestik-drag-hint__shadow-bounds"
                    x="-16"
                    y="-16"
                    width="64"
                    height="80"
                    fill="transparent"
                  />
                  <g opacity="0.2">
                    <rect
                      className="gestik-drag-hint__shadow"
                      x="1"
                      y="1"
                      width="30"
                      height="30"
                      rx="7"
                      fill="black"
                      stroke="black"
                      strokeWidth="2"
                      filter={`url(#${maskId}-shadow)`}
                    />
                  </g>
                  <rect
                    className="gestik-drag-hint__square"
                    x="1"
                    y="1"
                    width="30"
                    height="30"
                    rx="7"
                    strokeWidth="2"
                  />
                </g>
                <svg
                  className="gestik-drag-hint__icon-anchor"
                  x={16 - hotspot.x * ICON_SIZE}
                  y={16 - hotspot.y * ICON_SIZE}
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                  viewBox="0 0 24 24"
                  focusable="false"
                >
                  {(["idle", "grabbing"] as const).map((pose) => (
                    <g
                      key={pose}
                      className={`gestik-drag-hint__icon gestik-drag-hint__icon--${pose}`}
                    >
                      {icons === DEFAULT_ICONS ? (
                        icons[pose]
                      ) : (
                        <foreignObject width={ICON_SIZE} height={ICON_SIZE}>
                          <span className="gestik-drag-hint__custom-icon">
                            {icons[pose]}
                          </span>
                        </foreignObject>
                      )}
                    </g>
                  ))}
                </svg>
              </g>
            </g>
          </g>
        </svg>
      </span>
    </span>
  );
};
