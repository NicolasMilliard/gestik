# DragHint masking

The moving square, its shadow, and the destination share a scene-sized SVG luminance mask. A white rectangle reveals the background layer; an opaque black hand silhouette cuts it away. The visible icon stays outside this layer, so filled, outline, and duotone artwork all reveal the real application background underneath. No background color needs to be sampled or painted over the square.

## Shape and animation contract

- The built-in silhouettes reuse each hand's outer contour. Keep the silhouette and outline geometry together when updating artwork.
- The default hotspot is `{ x: 0.5, y: 0 }`. Its shared top-center anchor places the hand across the square's lower edge in both poses. The filled, outline, and duotone demos inherit this default so their placement stays consistent with the main preview.
- Custom `icons` can provide `iconMasks`, an idle/grabbing pair of `IconSilhouette` values. Each contains a filled SVG `path` and the visible icon's `viewBox`. Include the area inside hollow outlines. Custom icons without masks retain their previous unmasked behavior; do not assume they have the built-in hand shape.
- The mask uses the same 24px icon box, hotspot, travel, lift, and pose keyframes as the visible icon. ViewBox origins and aspect ratios follow normal SVG sizing. Custom icons should fill their box and be static; additional transforms or animations inside a custom icon need equivalent silhouette geometry.
- Keep the cutout opaque during loop fades; fading it would reveal the square through a translucent hand. Scope shadow styling without increasing specificity above the reduced-motion and playback overrides.
- Keep masking declarative. No DOM cloning, rasterization, observers, state updates, or JavaScript frame loops are needed. Each instance uses a stable React-generated ID, including server rendering.
- Direction changes restart every layer together. Pause, resume, finite iterations, and reduced motion apply to the cutout as well as the visible artwork. Reduced motion leaves the idle silhouette in place.

## Visual review

Check filled, outline, and duotone examples over patterned and dark backgrounds. Use an offset hotspot so the hand intersects the square border. Inspect both pose transitions, travel, drop, and loop reset in both directions and at multiple sizes. The destination and shadow must not leak through the cutout, and masking must not affect other instances.
