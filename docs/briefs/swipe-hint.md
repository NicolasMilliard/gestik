# SwipeHint

Communicate horizontal finger travel. The trail records the path without an arrowhead, dragged object, or drop zone.

## Design constraints

- Support both directions while keeping the hand's orientation. Changing direction restarts the cycle; the return to the starting position stays hidden.
- Overlap press and travel, compressing around the fingertip. Release near the end so travel and scale finish together. A completed press before movement reads as a separate click.
- Keep the hotspot at the pointing hand's fingertip. Custom icons must fill their box and supply a matching normalized hotspot when needed.
- Draw the trail from the initial contact point, with the visible round cap 4px behind the fingertip at the default size. Match the hand's travel easing and scale the gap with the scene.
- Erase the oldest segment during travel using a feathered mask moving at steady speed. Mirror it for left swipes and retain full color outside the fade edge. Clear the trail shortly after travel finishes; fading the whole line loses the sense of a moving finger.
- Use literal dash offsets for smooth browser interpolation and a long enough dash gap to prevent flashes before contact or during reset. Give each mask and gradient stable instance IDs.
- Synchronize all layers under playback controls. Finite completion rests visibly at the start; reduced motion shows a static hand without a trail. Custom artwork remains static and decorative.

## Visual checks

Check both directions, several sizes, and custom hotspots. Inspect fingertip alignment, the trailing gap, early erasure, and the hidden return. Nothing should flash before contact or survive after completion; pause/resume must keep every layer aligned.

Implementation: [component](../../packages/react/src/swipe-hint.tsx), [motion](../../packages/react/src/swipe-hint.css).
