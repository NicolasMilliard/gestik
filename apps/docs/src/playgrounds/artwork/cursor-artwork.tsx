import { CURSOR_PATH } from "./cursor-geometry";

export const CursorArtwork = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 32 32"
    fill="currentColor"
    focusable="false"
  >
    <path d={CURSOR_PATH} />
  </svg>
);
