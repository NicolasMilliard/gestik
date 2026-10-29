import {
  POINTING_HAND_OUTLINE,
  POINTING_HAND_SILHOUETTE,
  POINTING_HAND_SURFACE,
} from "@gestik/core";

export const PointingHand = ({
  surface = "currentColor",
}: {
  surface?: string;
}) => (
  <svg
    width="100%"
    height="100%"
    fill="currentColor"
    viewBox={POINTING_HAND_SILHOUETTE.viewBox}
    focusable="false"
  >
    <path fill={surface} d={POINTING_HAND_SURFACE} opacity="0.2" />
    <path d={POINTING_HAND_OUTLINE} />
  </svg>
);
