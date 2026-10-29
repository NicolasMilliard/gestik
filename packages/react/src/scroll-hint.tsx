import type { CSSProperties } from "react";

import "./scroll-hint.css";

const SCENE_WIDTH = 112;
const SCENE_HEIGHT = 88;

type ScrollHintStyle = CSSProperties & {
  "--gestik-scroll-hint-duration"?: string;
  "--gestik-scroll-hint-iterations"?: string;
  "--gestik-scroll-hint-play-state"?: "running" | "paused";
};

export interface ScrollHintProps {
  /** Scene width in pixels; all artwork and spacing scale proportionally. Defaults to 112. */
  size?: number;
  /** Class for styling the outer decorative span, including CSS variables. */
  className?: string;
  /** Duration of a complete animation cycle in milliseconds. Defaults to 2400. */
  duration?: number;
  /** CSS iteration count. Defaults to "infinite"; use whole cycles to finish at rest. */
  iterations?: "infinite" | number;
  /** Pause or resume at the current frame. Defaults to true; change React key to replay. */
  playing?: boolean;
}

export const ScrollHint = ({
  size = SCENE_WIDTH,
  className,
  duration,
  iterations,
  playing,
}: ScrollHintProps) => {
  const scale = size / SCENE_WIDTH;
  const style: ScrollHintStyle = {
    height: SCENE_HEIGHT * scale,
    width: size,
    ...(duration !== undefined && {
      "--gestik-scroll-hint-duration": `${duration}ms`,
    }),
    ...(iterations !== undefined && {
      "--gestik-scroll-hint-iterations": String(iterations),
    }),
    ...(playing !== undefined && {
      "--gestik-scroll-hint-play-state": playing ? "running" : "paused",
    }),
  };

  return (
    <span
      className={
        className ? `gestik-scroll-hint ${className}` : "gestik-scroll-hint"
      }
      aria-hidden="true"
      style={style}
    >
      <span
        className="gestik-scroll-hint__stage"
        style={{ transform: `scale(${scale})` }}
      >
        <svg
          className="gestik-scroll-hint__motion"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="currentColor"
          viewBox="0 0 256 256"
          focusable="false"
        >
          <path
            d="M200,80v96a56,56,0,0,1-56,56H112a56,56,0,0,1-56-56V80a56,56,0,0,1,56-56h32A56,56,0,0,1,200,80Z"
            opacity="0.2"
          />
          <path d="M144,16H112A64.07,64.07,0,0,0,48,80v96a64.07,64.07,0,0,0,64,64h32a64.07,64.07,0,0,0,64-64V80A64.07,64.07,0,0,0,144,16Zm48,160a48.05,48.05,0,0,1-48,48H112a48.05,48.05,0,0,1-48-48V80a48.05,48.05,0,0,1,48-48h32a48.05,48.05,0,0,1,48,48ZM136,83.31v89.38l10.34-10.35a8,8,0,0,1,11.32,11.32l-24,24a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L120,172.69V83.31L109.66,93.66A8,8,0,0,1,98.34,82.34l24-24a8,8,0,0,1,11.32,0l24,24a8,8,0,0,1-11.32,11.32Z" />
        </svg>
      </span>
    </span>
  );
};
