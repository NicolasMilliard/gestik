import {
  COMMAND_KEY_VIEW_BOX,
  COMMAND_KEY_SURFACE,
  COMMAND_KEY_OUTLINE,
} from "@gestik/core";

export const CommandKey = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    fill="currentColor"
    viewBox={COMMAND_KEY_VIEW_BOX}
    focusable="false"
  >
    <path d={COMMAND_KEY_SURFACE} opacity="0.2" />
    <path d={COMMAND_KEY_OUTLINE} />
  </svg>
);
