# ShortcutHint

Show keys held together as a combination. Pressing and releasing each key separately would communicate a sequence of keystrokes.

## Design constraints

- Press from left to right, retain each pressed key until the full combination is down, then release every key together and rest.
- Keep every key on one full-cycle clock. Use easing to place each press within it; animation delays would complicate synchronization across arbitrary counts and finite playback.
- Compress the solid base as each key moves downward. Keep 2px borders for legibility, and preserve the key legend without pulses or extra artwork.
- Support at least two keycaps, enforced by types and runtime validation. Changing their count restarts playback; completed cycles and reduced motion leave all keys released.
- Let labels and key count determine the natural width. Explicit `size` scales the whole row. Use system keycap typography independently of docs fonts.
- The exact `Command` label uses the built-in icon; custom keycap artwork stays static, inert, and hidden from assistive technology. The consuming application implements the shortcut; the docs do not intercept it.

## Visual checks

Inspect two-, three-, and four-key combinations for held overlap and simultaneous release. Check long labels, custom artwork, proportional sizing, and synchronization during pause/resume and finite completion.

Implementation: [component](../../packages/react/src/shortcut-hint.tsx), [motion](../../packages/core/src/styles/shortcut-hint.css).
