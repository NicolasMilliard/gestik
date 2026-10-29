# DragHint masking

Show a square being lifted, moved, and dropped. The square, shadow, and destination must disappear behind the hand, including through hollow or translucent artwork. An SVG luminance mask reveals the real application background without painting over it with an assumed color.

## Design constraints

- Keep visible artwork outside the masked background layer. An opaque silhouette cuts the full hand shape, including hollow interiors, out of that layer.
- Built-in poses share a top-center hotspot across the square's lower edge. Keep contact consistent when changing pose or artwork.
- Custom `iconMasks` must match the visible icons' `viewBox`, 24px box, and hotspot. Custom artwork stays static; icons without silhouettes render without cutouts.
- Synchronize cutout travel, lift, and pose changes with the visible hand. Keep the cutout opaque during loop fades so the square cannot leak through a translucent icon.
- Use stable React IDs and declarative SVG geometry. Direction changes restart all layers together; playback controls affect the cutout too. Reduced motion retains the idle silhouette.

## Visual checks

Inspect both directions and pose changes at several sizes, using outline and duotone hands over dark and patterned backgrounds. Check offset hotspots, shadows, loop resets, and multiple instances for leaks or misalignment.

Implementation: [component](../../packages/react/src/drag-hint.tsx), [motion](../../packages/core/src/styles/drag-hint.css).
