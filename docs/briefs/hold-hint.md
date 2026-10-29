# HoldHint

Communicate a sustained touch press: compress the hand around a fixed fingertip, hold while a ring fills clockwise, then release and rest. The ring illustrates elapsed time; the application decides when a real hold completes.

## Design constraints

- Keep the hand stationary during the hold. Repeated taps, pulses, or travel would suggest another gesture.
- Fill the ring steadily, completing before release. Fade it out before resetting its progress; avoid a rotating spinner or completion checkmark.
- Anchor the pointing hand and its cutout at the same fingertip. Mask the full silhouette out of the ring so the hand stays clear on any background.
- Finite cycles finish with the hand at rest and ring hidden. Reduced motion shows only the resting hand.
- Keep hand and ring colors configurable independently, without inheriting another hint's styling.

## Visual checks

Check that the press reads as a hold, the fingertip never drifts, and the ring remains behind the hand. Inspect completion, release, and reset on patterned backgrounds and at several sizes; check that pause/resume keeps the visible and masking layers synchronized.

Implementation: [component](../../packages/react/src/hold-hint.tsx), [motion](../../packages/react/src/hold-hint.css).
