# ScrollHint behavior brief

## Intent

Show the vertical movement a person can make to navigate. The first version overexplained scrolling with a content window and input-device variants. Feedback clarified that Gestik provides animations of human movements; supporting artwork should stay as simple as the movement needs.

## Starting point

- Use the supplied SVG unchanged in shape, including its translucent fill and vertical double arrow. Inherit color through `currentColor`.
- Move the entire SVG from top to bottom to top, continuously and infinitely by default. Use a 2400ms round trip with `ease-in-out` and 24px of travel. Keep the artwork visible throughout; there is no hidden return, press, fade, content simulation, or input variant.
- The SVG is 32px square in a 112 by 88 pixel scene. `size` sets the scene width and scales the artwork, spacing, and travel proportionally.
- Retain the existing `duration`, `iterations`, `playing`, and `className` controls. Pause and resume at the current frame; change the React `key` to replay a completed finite cycle. A full cycle ends at the top.
- Use `--gestik-scroll-hint-color` for color and the existing namespaced playback variables. Keep motion in CSS. Reduced motion shows a static SVG with no animation.
- Keep the hint decorative, non-focusable, and transparent to pointer events. Pair it with visible instructions and accessible navigation in the consuming application.

## Review judgment

This starting point suggests vertical movement in both directions. It does not prescribe a one-way scroll action. Challenge proposed motion when it implies a different human action or leaves the intended direction ambiguous; discuss the tradeoff before adding visual detail. The double arrow is explicitly supplied for this hint and does not change the default guidance for other gestures.

Inspect the full down-and-up loop, small and large sizes, pause/resume, finite completion, replay, color, and reduced-motion rendering in the docs browser example. Cover public behavior with tests and run `bun run verify` before handoff.
