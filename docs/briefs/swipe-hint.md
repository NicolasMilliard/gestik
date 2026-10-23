# SwipeHint behavior brief

Updated after the first visual review; code review is still pending. Motion timing and visual choices here are local to SwipeHint and can evolve with feedback.

## Intent

Demonstrate a horizontal touch swipe. A pointing hand makes contact, travels in the requested direction, releases, and returns for the next cycle. Let the gesture explain the movement without an arrow, draggable object, or drop zone. The consuming application owns gesture handling and visibility.

## Behavior contract

- Support `right` (default) and `left`. Direction describes finger travel.
- Reserve a 112 by 72 pixel scene by default. `size` sets the width and scales the scene proportionally, including the icon, travel, and contact indicator.
- Use a 2200 ms cycle, infinite iterations, and automatic playback by default. Match DragHint's `duration`, `iterations`, and `playing` controls. Duration is measured in milliseconds; pausing and resuming preserve the current frame.
- Reinforce contact by compressing the hand to 90% around its fingertip as the circle appears. Start at 8% of the cycle and peak with the pulse at 14%. Hold through most of the travel, then restore size from 48% to 58% of the cycle, so travel and scale finish together. These percentages follow the configured duration. Releasing before travel reads as a separate click followed by a swipe; releasing after travel separates the two endings. Keep the existing travel and loop timing, which passed visual review.
- Keep the current pointing-hand icon while a replacement is designed separately.
- Changing direction restarts the visual cycle. Consumers can change the React `key` to replay a completed finite animation. A completed cycle rests visibly at its starting position; the return movement is hidden.
- Allow `className`, a decorative custom `icon`, and a normalized `hotspot` for its contact point. Use namespaced CSS variables for colors and playback defaults.
- Keep the hint decorative, non-focusable, and transparent to pointer events. Pair it with visible instructions and an accessible implementation of the actual interaction.
- Under reduced motion, show a static hand, with no press, contact pulse, or travel animation. The accompanying instruction communicates direction. Custom icons must also be decorative and static.

## Review criteria

- Both directions clearly indicate a swipe; the hand keeps its orientation.
- The hand compresses with the contact pulse and stays pressed through most of the movement. It starts growing near the end of travel, reaching full size exactly when movement ends. The fingertip stays aligned with the contact indicator through the press, including custom sizes and hotspots. The illustration stays inside its reserved scene.
- All animated parts pause together. Finite iterations end in a visible resting pose, and replay works after completion.
- Reduced motion creates no active animations; accompanying text identifies the direction.
- Documentation includes playback controls, API defaults, customization, and accessibility guidance, with unique section and control IDs.
- Validate public behavior with unit tests, inspect the motion in a browser, and run `bun run verify` before handoff.
