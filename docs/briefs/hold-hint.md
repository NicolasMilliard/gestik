# HoldHint behavior brief

The stationary press and clockwise filling ring passed visual review. Artwork and timing decisions here are local to HoldHint and can evolve with feedback.

## Intent

Demonstrate a touch press that stays in place. Reuse the pointing hand from SwipeHint so the gesture language stays consistent. Compress it once around its fixed fingertip, sustain that pose while a small ring fills clockwise, then release and rest. The steady fill communicates elapsed time; the hand must not travel, tap repeatedly, or pulse during the hold. The consuming application owns gesture handling and visibility. The ring is an illustration, not live interaction feedback.

## Behavior contract

- Reserve a 112 by 72px scene, with a 32px hand and a 12px-radius ring centered at (56, 26). `size` scales everything proportionally.
- Use a 3000ms cycle by default. Rest through 8%, press to 90% scale from 8–16%, hold through 72%, release from 72–80%, then rest. The fingertip stays fixed at SVG coordinates (116, 16) in the hand's 256-unit viewBox.
- Fade in a faint ring track during the press. Fill the foreground clockwise from 16–66% with linear timing (1500ms by default), keep it complete through 72%, and fade it out by 84%. Reset the hidden progress stroke before the next loop. Avoid a rotating spinner, repeated ripples, or a completion checkmark that could suggest another action.
- Cut the hand's full silhouette out of the ring. Keep visible and masking presses synchronized and use a unique React ID per instance. Reuse the icon's outer contour without changing SwipeHint's artwork.
- Follow the common `size`, `className`, `duration`, `iterations`, and `playing` props. Pause and resume at the current frame; changing the React `key` replays a finite cycle. Finite playback ends with the hand at rest and ring hidden. Keep the API focused on the built-in hand and playback controls.
- Inherit color, with `--gestik-hold-hint-color` and `--gestik-hold-hint-ring-color` overrides. Keep playback in namespaced CSS variables.
- Keep the hint decorative, non-focusable, and transparent to pointer events. Reduced motion disables all animations and leaves a static hand with no ring. Accompany it with visible instructions and an accessible control for the same action.

## Visual review

Review whether the stationary press and filling ring read as a sustained hold. Inspect the icon at default, small, and large sizes; the fingertip must not drift during the press. Check that the ring stays behind the hand on patterned and dark backgrounds, completes before release, fades before reset, and does not resemble a loading spinner. Check pause, resume, finite playback, replay, and reduced motion in the docs playground. Keep any resulting visual decisions local to this component.
