import { CURSOR_SILHOUETTE } from "./cursor-geometry";

export const CursorArtwork = () => (
  <svg
    width="100%"
    height="100%"
    viewBox={CURSOR_SILHOUETTE.viewBox}
    fill="currentColor"
    focusable="false"
  >
    <path d={CURSOR_SILHOUETTE.path} />
  </svg>
);
