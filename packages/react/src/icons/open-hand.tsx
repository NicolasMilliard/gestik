import {
  OPEN_HAND_OUTLINE,
  OPEN_HAND_SILHOUETTE,
  OPEN_HAND_SURFACE,
} from "@gestik/core";

export const OpenHand = () => (
  <svg
    width="100%"
    height="100%"
    fill="currentColor"
    viewBox={OPEN_HAND_SILHOUETTE.viewBox}
    focusable="false"
  >
    <path
      fill="var(--gestik-drag-hint-surface, currentColor)"
      d={OPEN_HAND_SURFACE}
      opacity="0.2"
    />
    <path d={OPEN_HAND_OUTLINE} />
  </svg>
);
