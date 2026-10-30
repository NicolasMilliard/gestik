# DragHint masking

Show a square being lifted, moved, and dropped. The square, shadow, and destination must disappear behind the hand, including through hollow or translucent artwork. An SVG luminance mask reveals the real application background without painting over it with an assumed color.

## Design constraints

- Keep visible artwork outside the masked background layer. An opaque silhouette cuts the full hand shape, including hollow interiors, out of that layer.
- Apply the mask directly to an SVG scene group. CSS masks referencing animated SVG on an HTML layer can leave stale cutouts in WebKit; this was reproduced in desktop Safari after the same leak was reported on iOS. Keep the destination and the moving square/shadow in native SVG masked groups. See [WebKit's related CSS mask repaint report](https://bugs.webkit.org/show_bug.cgi?id=327381).
- The hand, square, and shadow share SVG travel and lift groups. The reported iPhone recording showed drift between separate HTML and SVG layers despite identical keyframes. The square uses a local hand cutout; the stationary destination uses a cutout animated in scene coordinates.
- Keep custom HTML static inside each pose's `foreignObject`; animate the enclosing SVG group. Animating or positioning the HTML itself caused Safari to paint it offset from its SVG viewport during this fix.
- The shadow excludes the square's full stroked silhouette and lifts with it. An inset, stationary exclusion leaves a bright seam below the lifted border. Give the filter and mask explicit bounds in user units with room for the blur and offset. Keep a transparent rectangle with those bounds inside the masked group: Safari clipped the blur to the square's geometry without it, even with a larger filter and mask region.
- Built-in poses share a top-center hotspot across the square's lower edge. Keep contact consistent when changing pose or artwork.
- Read custom static inline SVG geometry through each pose wrapper. The shared React silhouette helper resolves CSS paints and transforms, rasterizes at 256px with a padded exterior, flood-fills enclosed interiors, and returns an opaque SVG path in the same 24px box. Unsupported artwork falls back without a cutout; do not reuse a built-in silhouette. No consumer mask data is needed.
- Hide the custom stage and disable its animations during SSR and cutout generation. Use stage opacity, since inherited visibility would also hide the detached SVG snapshot. Reveal and start every layer together only after both poses settle. Observe artwork mutations, discard stale async results, and restart after geometry changes without remounting the artwork and resetting its local state. Keep the browser-only helper in the adapter; core remains free of DOM access.
- Accept paths, basic shapes, groups, and transforms in one self-contained SVG with a viewBox. References, text, filters, masks, clipping, vector effects, external images, and animation are outside the initial contract. Rasterization requires canvas and data: images permitted by CSP; failure must settle into an unmasked fallback.
- The docs example uses a center hotspot (`0.5, 0.5`) to place both custom poses inside the square.
- Synchronize cutout travel, lift, and pose changes with the visible hand. Keep the cutout opaque during loop fades so the square cannot leak through a translucent icon.
- Use stable React IDs and declarative SVG geometry. Direction changes restart all layers together; playback controls affect the cutout too. Reduced motion retains the idle silhouette.

## Visual checks

Inspect both directions and pose changes at several sizes, using outline and duotone hands over dark and patterned backgrounds. Check offset hotspots, shadows, loop resets, and multiple instances for leaks or misalignment. Include Safari/WebKit and the custom-icons example with generated silhouettes; opaque artwork alone does not provide the cutout contract.

Implementation: [component](../../packages/react/src/drag-hint.tsx), [motion](../../packages/core/src/styles/drag-hint.css).
