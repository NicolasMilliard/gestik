# React hint props

All props are optional. Every hint accepts custom static artwork, retains its built-in artwork when customization is omitted, and keeps decorative content hidden and inert. The application owns gesture handling.

## Common to every hint

| Prop | Type | Default | Purpose |
| --- | --- | --- | --- |
| `size` | `number` | `112`; ShortcutHint fits its keys | Scene width in pixels. Scales the artwork, spacing, and travel together. |
| `duration` | `number` | See below | Complete cycle duration in milliseconds. |
| `iterations` | `number \| "infinite"` | `"infinite"` | Number of cycles. Whole counts finish at rest; fractional counts stop partway through. |
| `playing` | `boolean` | `true` | Pause or resume at the current frame. Change the React `key` to replay. |
| `className` | `string` | None | Class on the outer decorative span. |
| `style` | `HintStyle` | None | Ordinary React CSS properties and `--gestik-*` variables on the outer span. |

Playback defaults come from CSS. Explicit `duration`, `iterations`, and `playing` props override their matching inline style variables. When a prop is omitted, inline style variables take precedence over class-based CSS as usual. Removing both restores stylesheet defaults. Reduced motion disables the built-in motion.

`style` can change layout, colors, opacity, and CSS variables. Use `size` to scale the complete animation: setting `style.width` or `style.height` changes only the outer layout box. Internal artwork still scales according to `size`.

```tsx
import { HoldHint } from "@gestik/react";
import type { HintStyle } from "@gestik/react";

const style: HintStyle = {
  "--gestik-hold-hint-ring-color": "#0e7490",
  marginInlineStart: 12,
};

<HoldHint size={140} duration={2400} style={style} />;
```

## Props specific to each hint

Each row lists the additional props alongside the six common props above.

| Hint | Additional props | Default duration | Default scene | Why these options |
| --- | --- | --- | --- | --- |
| `DragHint` | `direction`, `icons`, `iconMasks`, `hotspot` | `2800` | `112 × 72` | Dragging changes between idle and grabbing poses, so artwork and cutouts come as matching pairs. |
| `SwipeHint` | `direction`, `icon`, `hotspot` | `2200` | `112 × 72` | One illustration travels horizontally around a contact point. Its trail leaves a gap behind that point, so it does not need an icon cutout. |
| `HoldHint` | `icon`, `iconMask`, `hotspot` | `3000` | `112 × 72` | One illustration presses around a fixed contact point. A silhouette can hide the filling ring behind translucent or outlined artwork. |
| `ResizeHint` | `icon`, `iconMask`, `hotspot` | `2200` | `112 × 88` | One illustration presses and follows the growing lower-right corner. A silhouette can hide the frame behind the illustration. |
| `ScrollHint` | `icon` | `2400` | `112 × 88` | The whole illustration moves down and back up; it has no contact point or background requiring a cutout. |
| `ShortcutHint` | `keys` | `2400` | Fits the keys; `112 × 72` for Command + K | Each keycap has its own label or icon. Custom elements in `keys` replace legends while preserving the keycap and coordinated press. |

`direction` accepts `"right"` or `"left"`, defaulting to `"right"`. It describes element travel for drag and finger travel for swipe. Changing it restarts the cycle. Resize keeps its established outward diagonal motion; scroll keeps its bidirectional vertical loop.

## Artwork contracts

- `icon` accepts a `ReactNode`. Swipe, hold, resize, and scroll use a 32px box. Their direct SVG children fill the box; other artwork should provide its own width and height of `100%`. Passing `null` hides the icon.
- Drag's `icons` is `{ idle: ReactNode; grabbing: ReactNode }`, with a 24px box for each pose. Both poses share one contact point.
- `hotspot` is `{ x: number; y: number }`, normalized from 0 to 1 across the icon box. Drag defaults to `{ x: 0.5, y: 0 }`. Swipe, hold, and resize default to the pointing hand's fingertip, `{ x: 116 / 256, y: 16 / 256 }`. Set it to the equivalent contact point in custom artwork.
- `iconMask` is an `IconSilhouette`: `{ path: string; viewBox: string }`. Drag's `iconMasks` provides one silhouette for each pose. Include the entire filled area to hide behind the artwork, including hollow outline interiors. Built-in artwork gets its matching cutout automatically. Custom artwork only gets a cutout when one is explicitly supplied; it never uses the hand's mask.
- Hold and resize restart when switching between built-in and custom artwork, or enabling or disabling the cutout. This keeps newly mounted animation layers on the same cycle. Updating a custom icon within the same mode retains playback.
- `keys` is a readonly tuple with at least two entries. Each entry is a string or `ReactElement`. It defaults to `["Command", "K"]`; `"Command"` renders the built-in symbol. Custom elements fill a 20px icon box. Other strings render as labels and determine keycap width. Fewer than two keys throw a `RangeError`; changing the count restarts playback.

Custom artwork should stay static and decorative. The hint animates its wrapper; actual links, buttons, and instructions belong outside it.
