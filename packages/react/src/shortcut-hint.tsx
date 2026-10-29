import type { CSSProperties, ReactElement } from "react";

import "./shortcut-hint.css";
import { CommandKey } from "./icons/command-key";

type Keycap = string | ReactElement;

export type ShortcutHintKeys = readonly [Keycap, Keycap, ...Keycap[]];

const DEFAULT_KEYS: ShortcutHintKeys = ["Command", "K"];
const SCENE_HEIGHT = 72;

const keycapWidth = (keycap: Keycap) =>
  typeof keycap === "string" && keycap !== "Command"
    ? Math.max(36, keycap.length * 8 + 16)
    : 36;

type ShortcutHintStyle = CSSProperties & {
  "--gestik-shortcut-hint-duration"?: string;
  "--gestik-shortcut-hint-iterations"?: string;
  "--gestik-shortcut-hint-play-state"?: "running" | "paused";
};

type KeycapStyle = CSSProperties & {
  "--gestik-shortcut-hint-press-start": string;
  "--gestik-shortcut-hint-press-end": string;
};

export interface ShortcutHintProps {
  /** At least two keycaps, in press order. Defaults to ["Command", "K"]. Changing the count restarts playback. */
  keys?: ShortcutHintKeys;
  /** Scene width in pixels; all artwork and spacing scale proportionally. Defaults to the natural key row width. */
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

export const ShortcutHint = ({
  keys = DEFAULT_KEYS,
  size,
  className,
  duration,
  iterations,
  playing,
}: ShortcutHintProps) => {
  if (keys.length < 2) {
    throw new RangeError("ShortcutHint requires at least two keycaps.");
  }

  const sceneWidth =
    24 +
    keys.reduce((width, keycap) => width + keycapWidth(keycap), 0) +
    (keys.length - 1) * 16;
  const width = size ?? sceneWidth;
  const scale = width / sceneWidth;
  const style: ShortcutHintStyle = {
    height: SCENE_HEIGHT * scale,
    width,
    ...(duration !== undefined && {
      "--gestik-shortcut-hint-duration": `${duration}ms`,
    }),
    ...(iterations !== undefined && {
      "--gestik-shortcut-hint-iterations": String(iterations),
    }),
    ...(playing !== undefined && {
      "--gestik-shortcut-hint-play-state": playing ? "running" : "paused",
    }),
  };

  return (
    <span
      className={
        className ? `gestik-shortcut-hint ${className}` : "gestik-shortcut-hint"
      }
      aria-hidden="true"
      inert
      style={style}
    >
      <span
        key={keys.length}
        className="gestik-shortcut-hint__stage"
        style={{ transform: `scale(${scale})`, width: sceneWidth }}
      >
        {keys.map((keycap, index) => {
          const pressStart = 12 + (index / (keys.length - 1)) * 22;
          const capStyle: KeycapStyle = {
            "--gestik-shortcut-hint-press-end": `${pressStart + 6}%`,
            "--gestik-shortcut-hint-press-start": `${pressStart}%`,
            width: keycapWidth(keycap),
          };

          return (
            <span key={pressStart} className="gestik-shortcut-hint__keystroke">
              {index > 0 && (
                <span className="gestik-shortcut-hint__separator">+</span>
              )}
              <kbd className="gestik-shortcut-hint__keycap" style={capStyle}>
                {keycap === "Command" ? (
                  <span className="gestik-shortcut-hint__icon">
                    <CommandKey />
                  </span>
                ) : (
                  keycap
                )}
              </kbd>
            </span>
          );
        })}
      </span>
    </span>
  );
};
