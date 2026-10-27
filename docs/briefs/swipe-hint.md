# SwipeHint behavior brief

Updated for the fingertip's drawn trail. Motion timing and visual choices here are local to SwipeHint and can evolve with feedback.

## Intent

Demonstrate a horizontal touch swipe. A pointing hand makes contact, draws a line in the requested direction, releases, and returns for the next cycle. The line records the finger's path without an arrowhead, draggable object, or drop zone. The consuming application owns gesture handling and visibility.

## Behavior contract

- Support `right` (default) and `left`. Direction describes finger travel.
- Reserve a 112 by 72 pixel scene by default. `size` sets the width and scales the scene proportionally, including the icon, travel, contact indicator, and trail.
- Use a 2200 ms cycle, infinite iterations, and automatic playback by default. Match DragHint's `duration`, `iterations`, and `playing` controls. Duration is measured in milliseconds; pausing and resuming preserve the current frame.
- Reinforce contact by compressing the hand to 90% around its fingertip as the circle appears. Start at 8% of the cycle and peak with the pulse at 14%. Hold through most of the travel, then restore size from 48% to 58% of the cycle, so travel and scale finish together. These percentages follow the configured duration. Releasing before travel reads as a separate click followed by a swipe; releasing after travel separates the two endings. Keep the existing travel and loop timing, which passed visual review.
- Use the supplied pointing-hand icon. Its fingertip is at SVG coordinates (116, 16) in the 256 by 256 viewBox, so the default hotspot is `{ x: 116 / 256, y: 16 / 256 }`. Recheck contact alignment and press origin whenever the illustration changes.
- Draw a 2px SVG stroke with round caps at the icon's full color. The start stays at the initial contact point. Reveal it from 24% to 58% with the hand's travel easing, keeping the visible cap 4px behind the fingertip (5px to the cap's center). Keep the longer dash gap so the far end cannot flash before drawing begins. Use literal numeric dash offsets to preserve continuous browser interpolation. The optional `--gestik-swipe-hint-trail-color` defaults to the icon color.
- Begin erasing the oldest part at 31% of the cycle. Move a 12px feathered alpha mask at a steady speed, clearing the trail by 60%, just after travel finishes at 58%. The soft gradient supplies the smooth fade; a slow ease-in delays its visible onset too far into the movement. Mirror this mask for left swipes. Keep the newer segment fully colored outside the fade edge; do not fade the entire trail at the end. The mask and stroke share duration, iterations, play state, direction resets, and reduced-motion behavior. Use stable instance IDs for the mask and gradient.
- Changing direction restarts the visual cycle. Consumers can change the React `key` to replay a completed finite animation. A completed cycle rests visibly at its starting position; the return movement is hidden.
- Allow `className`, a decorative custom `icon`, and a normalized `hotspot` for its contact point. Use namespaced CSS variables for colors and playback defaults.
- Keep the hint decorative, non-focusable, and transparent to pointer events. Pair it with visible instructions and an accessible implementation of the actual interaction.
- Under reduced motion, show a static hand, with no press, contact pulse, trail, or travel animation. The accompanying instruction communicates direction. Custom icons must also be decorative and static.

## Review criteria

- Both directions clearly indicate a swipe; the hand keeps its orientation.
- The trail's starting point stays fixed and its drawn endpoint follows 4px behind the fingertip throughout travel, including custom hotspots and sizes. No completed line appears before contact, during reset, after a finite cycle, or under reduced motion.
- The oldest part fades first in both directions and is mostly erased when the hand reaches half the distance (35.9% of the cycle). Judge the visible fade rather than just its keyframe start: feathering and easing can delay the perceived onset. The fade advances smoothly while the hand is moving and the surviving segment retains the icon's color. Keep these timing choices local to SwipeHint.
- The hand compresses with the contact pulse and stays pressed through most of the movement. It starts growing near the end of travel, reaching full size exactly when movement ends. The fingertip stays aligned with the contact indicator through the press, including custom sizes and hotspots. The illustration stays inside its reserved scene.
- All animated parts pause together. Finite iterations end in a visible resting pose, and replay works after completion.
- Reduced motion creates no active animations; accompanying text identifies the direction.
- Documentation includes playback controls, API defaults, customization, and accessibility guidance, with unique section and control IDs.
- Validate public behavior with unit tests, inspect the motion in a browser, and run `bun run verify` before handoff.
