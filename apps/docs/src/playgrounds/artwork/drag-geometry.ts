import type { IconSilhouette } from "@gestik/react";

export const DRAG_HAND_MASKS: Record<"idle" | "grabbing", IconSilhouette> = {
  grabbing: {
    path: "M188 80a27.8 27.8 0 0 0-13.36 3.4 28 28 0 0 0-46.64-11A28 28 0 0 0 80 92v20H68a28 28 0 0 0-28 28v12a88 88 0 0 0 176 0v-44a28 28 0 0 0-28-28Z",
    viewBox: "0 0 256 256",
  },
  idle: {
    path: "M188 48a27.75 27.75 0 0 0-12 2.71V44a28 28 0 0 0-54.65-8.6A28 28 0 0 0 80 60v64l-3.82-6.13a28 28 0 0 0-48.6 27.82c16 33.77 28.93 57.72 43.72 72.69C86.24 233.54 103.2 240 128 240a88.1 88.1 0 0 0 88-88V76a28 28 0 0 0-28-28Z",
    viewBox: "0 0 256 256",
  },
};

export const DRAG_HAND_MASKS_EXAMPLE = `const handMasks = {
  idle: {
    path: "${DRAG_HAND_MASKS.idle.path}",
    viewBox: "0 0 256 256",
  },
  grabbing: {
    path: "${DRAG_HAND_MASKS.grabbing.path}",
    viewBox: "0 0 256 256",
  },
};`;
