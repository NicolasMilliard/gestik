export const DIRECTION_OPTIONS = [
  { label: "Right", value: "right" },
  { label: "Left", value: "left" },
] as const;

export const ITERATION_OPTIONS = [
  { label: "Infinite", value: "infinite" },
  { label: "Once", value: 1 },
  { label: "Twice", value: 2 },
] as const;

export type PreviewDirection = (typeof DIRECTION_OPTIONS)[number]["value"];
export type PreviewIterations = (typeof ITERATION_OPTIONS)[number]["value"];

export const formatIterationsProp = (iterations: PreviewIterations) =>
  iterations === "infinite"
    ? 'iterations="infinite"'
    : `iterations={${iterations}}`;
