# ShortcutHint behavior brief

The motion and 2px keycap borders passed visual review. These decisions are local to ShortcutHint and can evolve with feedback.

## Intent

Demonstrate a keyboard combination with a row of keycaps. The docs start with Command + K, using the supplied duotone Command artwork unchanged in shape and inheriting `currentColor`. No cursor, hand, or miniature application is needed. The consuming application implements the shortcut and decides when to show the hint.

## Behavior contract

- Configure keycaps through `keys`, an ordered tuple of at least two strings or decorative React elements, with no maximum. Default to `["Command", "K"]`; the exact `Command` label uses the supplied icon. Enforce the minimum in TypeScript and at runtime. Keep custom content inert and out of the accessibility tree.
- Press keys from left to right, retaining each pressed key until the full combination is down. Press starts span 12%–34% of the cycle regardless of count; each press takes 6%. Hold the complete combination through 56%, release every key together by 64%, and rest through 100%. Sequential taps would communicate a different interaction.
- Use a 2400ms cycle with infinite automatic playback by default. A 3px downward movement compresses the key's solid base from 4px to 1px; do not add a pulse or change the legend. Keep every key on the same full-cycle clock, without animation delays, so arbitrary counts and finite playback stay synchronized. CSS `linear()` easing places each press within that clock and returns every key to rest at completion.
- Reserve a 112 by 72px scene for the default combination, including two 36px keycaps and a plus separator. Use 2px borders on all four sides; the earlier 1.5px outline looked too thin on an external display. Longer text labels widen their keycaps; longer combinations reserve additional width at the same natural height. An explicit `size` is the complete scene width and scales all dimensions proportionally.
- Match the existing `duration`, `iterations`, `playing`, and `className` controls and namespaced CSS playback variables. Pause/resume preserves the frame; a new React `key` replays a finite animation. Changing key count restarts the cycle.
- Expose color and surface through `--gestik-shortcut-hint-color` and `--gestik-shortcut-hint-surface`. Use system keycap typography independent of the docs font.
- Reduced motion shows all keys static and released. Pair the decorative row with visible shortcut instructions and an accessible alternative control. The docs do not intercept Command + K.

Inspect two-, three-, and four-key combinations, the held overlap, shared release, proportional sizing, pause/resume, finite completion, replay, custom colors, and reduced motion in the browser.
