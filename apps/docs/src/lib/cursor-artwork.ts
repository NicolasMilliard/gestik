import type { IconSilhouette } from "@gestik/react";

export const CURSOR_SILHOUETTE: IconSilhouette = {
  path: "M4 2V26L10 20L15 30L20 27L15 17H25Z",
  viewBox: "0 0 32 32",
};

export const CURSOR_HOTSPOT = { x: 4 / 32, y: 2 / 32 };

export const CURSOR_EXAMPLE = `const cursorMask = {
  path: "${CURSOR_SILHOUETTE.path}",
  viewBox: "${CURSOR_SILHOUETTE.viewBox}",
};

const CursorArtwork = () => (
  <svg width="100%" height="100%" viewBox={cursorMask.viewBox} fill="currentColor">
    <path d={cursorMask.path} />
  </svg>
);`;
