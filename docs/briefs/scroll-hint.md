# ScrollHint

Suggest vertical movement in both directions. Keep the cue simple: a moving illustration is enough, without a content window or input-device variants.

## Design constraints

- Move the whole SVG down and back up with smooth easing, keeping it visible throughout. There is no press, fade, or hidden return.
- Keep the existing artwork and its vertical double arrow. The arrow belongs to this cue; it does not establish a convention for other gestures.
- Scale artwork, spacing, and travel together. A full finite cycle ends at the top; reduced motion keeps the same artwork stationary.
- Accompany the cue with instructions explaining what the user can explore. The bidirectional loop does not specify a one-way action.

## Visual checks

Inspect the complete down-and-up movement at small and large sizes. It should suggest vertical exploration without implying a tap or drag. Check pause/resume and the resting pose after finite playback.

Implementation: [component](../../packages/react/src/scroll-hint.tsx), [motion](../../packages/core/src/styles/scroll-hint.css).
