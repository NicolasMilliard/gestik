# SwipeHint behavior brief

First implementation for review. Motion timing and visual choices here are local to SwipeHint and can evolve with feedback.

## Intent

Demonstrate a horizontal touch swipe. A pointing hand makes contact, travels in the requested direction, releases, and returns for the next cycle. A subtle directional arrow explains the movement without a draggable object or drop zone. The consuming application owns gesture handling and visibility.

## First-pass contract

- Support `right` (default) and `left`. Direction describes finger travel.
- Reserve a 112 by 72 pixel scene by default. `size` sets the width and scales the scene proportionally, including the icon, travel, and contact indicator.
- Use a 2200 ms cycle, infinite iterations, and automatic playback by default. Match DragHint's `duration`, `iterations`, and `playing` controls. Duration is measured in milliseconds; pausing and resuming preserve the current frame.
- Changing direction restarts the visual cycle. Consumers can change the React `key` to replay a completed finite animation. A completed cycle rests visibly at its starting position; the return movement is hidden.
- Allow `className`, a decorative custom `icon`, and a normalized `hotspot` for its contact point. Use namespaced CSS variables for colors and playback defaults.
- Keep the hint decorative, non-focusable, and transparent to pointer events. Pair it with visible instructions and an accessible implementation of the actual interaction.
- Under reduced motion, show a static hand and directional arrow, with no contact pulse or travel animation. Custom icons must also be decorative and static.

## Review criteria

- Both directions clearly indicate a swipe; the hand keeps its orientation.
- The fingertip stays aligned with the contact indicator, including custom sizes and hotspots. The illustration stays inside its reserved scene.
- All animated parts pause together. Finite iterations end in a visible resting pose, and replay works after completion.
- Reduced motion retains a directional cue and creates no active animations.
- Documentation includes playback controls, API defaults, customization, and accessibility guidance, with unique section and control IDs.
- Validate public behavior with unit tests, inspect the motion in a browser, and run `bun run verify` before handoff.
