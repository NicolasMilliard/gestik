# ResizeHint behavior brief

## Intent

Show a person pulling a lower-right corner outward to make an element larger. Keep the upper-left corner fixed so the changing outline reads as resizing.

## Behavior

- Reuse the built-in 32px pointing hand and its translucent fill. Anchor the fingertip to the rounded lower-right edge; compress the hand slightly while pressed without moving its contact point. Keep only the resized outline and hand, with no extra corner handle.
- Use one rounded outline, growing from 32 by 24px to 56 by 42px. The corner and hand travel 24px right and 18px down together. Preserve stroke weight and corner radius while growing. Add no arrows, device variants, or miniature interface content.
- Use a 112 by 88px scene and SwipeHint's 2200ms rhythm: press and pull begin together at 8%, the hand compresses through 14%, releases from 48% to 58%, and growth finishes at 58%. Rest at the larger size until 72% (308ms), fade through 80%, reset while hidden at 81%, then reappear from 86% to 100%. Use SwipeHint's travel easing. Finite playback finishes at the initial resting pose.
- Keep motion in CSS with the usual `size`, `className`, `duration`, `iterations`, and `playing` controls. Pause and resume all layers at the current frame; changing the React `key` replays a finite cycle. Avoid extra direction, icon, or axis props until visual feedback establishes a need.
- Inherit color, with `--gestik-resize-hint-color` and `--gestik-resize-hint-frame-color` overrides. A moving silhouette cutout keeps the outline behind the hand on any background.
- Keep the hint decorative, non-focusable, and transparent to pointer events. Reduced motion shows the initial frame and hand without movement. Pair the hint with visible instructions and an accessible resize control in the consuming application.

## Visual review

The first draft finished pressing before growth began, making the gesture feel like a click followed by a separate resize. Feedback calls for overlapping press and travel, as in SwipeHint, and an end pause longer than the initial rest but shorter than the first draft's 660ms. Keep this timing decision local to ResizeHint.

Inspect the anchored corner, fingertip contact, growth, release, and hidden reset at small, default, and large sizes. Check playback, finite completion, replay, reduced motion, and contrast on light, dark, and patterned backgrounds in the docs playground. Keep resulting visual judgments local to this component.
