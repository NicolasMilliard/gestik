import {
  CLOSED_HAND_OUTLINE,
  CLOSED_HAND_SILHOUETTE,
  CLOSED_HAND_SURFACE,
} from "@gestik/core";

export const ClosedHand = () => (
  <svg
    width="100%"
    height="100%"
    fill="currentColor"
    viewBox={CLOSED_HAND_SILHOUETTE.viewBox}
    focusable="false"
  >
    <path
      fill="var(--gestik-drag-hint-surface, currentColor)"
      d={CLOSED_HAND_SURFACE}
      opacity="0.2"
    />
    <path d={CLOSED_HAND_OUTLINE} />
  </svg>
);
