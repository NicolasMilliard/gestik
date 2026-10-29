# ResizeHint

Show a lower-right corner being pulled outward to enlarge an element. Keep the upper-left corner fixed so the growing outline reads as resizing.

## Design constraints

- Use only the rounded outline and pointing hand. Anchor the fingertip to the rounded corner; no extra handle, arrows, or miniature interface is needed.
- Grow the frame proportionally while its corner and the hand travel together. Preserve stroke weight and corner radius.
- Overlap press and travel. Finishing the press first makes the movement read as a click followed by a separate resize.
- Pause at the larger size longer than the initial rest, then fade and reset while hidden. A visible return would demonstrate shrinking. Keep this rhythm local to ResizeHint.
- Synchronize the hand's silhouette cutout with its motion. Finite playback and reduced motion show the initial resting frame and hand.
- Support custom artwork with `icon`, `hotspot`, and an optional `iconMask`, matching HoldHint. Keep the established direction and axis focused on pulling the lower-right corner outward.

## Visual checks

Inspect fingertip contact, the fixed corner, growth, release, and hidden reset at small and large sizes. Check outline visibility on dark and patterned backgrounds and synchronization while pausing and resuming.

Implementation: [component](../../packages/react/src/resize-hint.tsx), [motion](../../packages/core/src/styles/resize-hint.css).
