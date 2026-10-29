/** Omit the label for custom artwork, which uses the standard keycap width. */
export const getShortcutKeycapWidth = (label?: string) =>
  label === undefined || label === "Command"
    ? 36
    : Math.max(36, label.length * 8 + 16);

export const getShortcutSceneWidth = (keycapWidths: readonly number[]) => {
  if (keycapWidths.length < 2) {
    throw new RangeError("ShortcutHint requires at least two keycaps.");
  }

  return (
    24 +
    keycapWidths.reduce((width, keycapWidth) => width + keycapWidth, 0) +
    (keycapWidths.length - 1) * 16
  );
};

/** Percentage of the shared cycle at which a key begins its press. */
export const getShortcutPressStart = (index: number, keyCount: number) =>
  12 + (index / (keyCount - 1)) * 22;
