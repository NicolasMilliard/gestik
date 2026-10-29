import {
  SHORTCUT_HINT_DEFAULTS,
  getShortcutKeycapWidth,
  getShortcutSceneWidth,
  getShortcutPressStart,
} from "@gestik/core";
import type { CSSProperties, ReactElement } from "react";

import "@gestik/core/styles/shortcut-hint.css";
import type { HintStyle } from "./hint-style";
import { CommandKey } from "./icons/command-key";
import { INERT_PROPS } from "./inert-props";

type Keycap = string | ReactElement;

export type ShortcutHintKeys = readonly [Keycap, Keycap, ...Keycap[]];

const DEFAULT_KEYS: ShortcutHintKeys = SHORTCUT_HINT_DEFAULTS.keys;
const SCENE_HEIGHT = SHORTCUT_HINT_DEFAULTS.height;

const keycapWidth = (keycap: Keycap) =>
  getShortcutKeycapWidth(typeof keycap === "string" ? keycap : undefined);

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
  /** Styles for the outer span, including --gestik-* variables. Explicit playback props take precedence. */
  style?: HintStyle;
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
  style,
  duration,
  iterations,
  playing,
}: ShortcutHintProps) => {
  const sceneWidth = getShortcutSceneWidth(keys.map(keycapWidth));
  const width = size ?? sceneWidth;
  const scale = width / sceneWidth;
  const hintStyle: HintStyle = {
    height: SCENE_HEIGHT * scale,
    width,
    ...style,
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
      {...INERT_PROPS}
      style={hintStyle}
    >
      <span
        key={keys.length}
        className="gestik-shortcut-hint__stage"
        style={{ transform: `scale(${scale})`, width: sceneWidth }}
      >
        {keys.map((keycap, index) => {
          const content = keycap === "Command" ? <CommandKey /> : keycap;
          const pressStart = getShortcutPressStart(index, keys.length);
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
                {typeof content === "string" ? (
                  content
                ) : (
                  <span className="gestik-shortcut-hint__icon">{content}</span>
                )}
              </kbd>
            </span>
          );
        })}
      </span>
    </span>
  );
};
