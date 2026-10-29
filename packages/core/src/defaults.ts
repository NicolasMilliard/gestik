// Playback defaults live in the stylesheets. Adapters only set inline CSS
// variables for explicit overrides, so consumer CSS stays in control.
export const DRAG_HINT_DEFAULTS = {
  direction: "right",
  height: 72,
  hotspot: { x: 0.5, y: 0 },
  iconSize: 24,
  width: 112,
} as const;

// The pointing hand's fingertip in its 256-unit viewBox.
export const POINTING_HAND_HOTSPOT = { x: 116 / 256, y: 16 / 256 } as const;

export const SWIPE_HINT_DEFAULTS = {
  direction: "right",
  height: 72,
  hotspot: POINTING_HAND_HOTSPOT,
  iconSize: 32,
  width: 112,
} as const;

export const HOLD_HINT_DEFAULTS = {
  height: 72,
  hotspot: POINTING_HAND_HOTSPOT,
  iconSize: 32,
  width: 112,
} as const;

export const RESIZE_HINT_DEFAULTS = {
  height: 88,
  hotspot: POINTING_HAND_HOTSPOT,
  iconSize: 32,
  width: 112,
} as const;

export const SCROLL_HINT_DEFAULTS = { height: 88, width: 112 } as const;

export const SHORTCUT_HINT_DEFAULTS = {
  height: 72,
  keys: ["Command", "K"],
} as const;
