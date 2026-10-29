# Docs design

Keep the interface quiet so the gesture animations carry the page. These choices apply to the docs; the React package keeps its own styling defaults.

- Use Figtree for interface text and headings, and Paper Mono for commands and code. Serve fonts locally and retain their [licenses](../../apps/docs/public/fonts/README.md). Prefer regular headings and light command text.
- Keep the overview headline “Show users how.”, square preview cards, and compact captions on the same surface. The gallery intentionally loops so visitors can compare movements. Retain the package publication notice.
- Use white content areas with soft gray cards, sidebar, and command surfaces. Ember (`#c24c24`) marks “how.”, package names, and active navigation; pale peach (`#fdf7f4`) supports selected states. Preserve readable contrast.
- Give playground stages a subtle dot grid that fades toward the edges. Keep hints and instructions above it, and let control rows wrap on narrow screens.
- Use Phosphor icons for docs controls. Mobile navigation switches between menu and close icons; select carets reflect popup state. The library stays independent of these UI dependencies.
- Keep icon-button hit areas stable while visual layers compress or swap. The copy action uses an 18px icon in a 44px target and shows its check for two seconds. Disable motion under reduced motion.
- Preserve visible keyboard focus and active-link styling. Navigation replaces ready content without page transitions.

Implementation: [theme and feedback](../../apps/docs/src/index.css), [sidebar](../../apps/docs/src/components/docs-sidebar.tsx), [copy control](../../apps/docs/src/components/install-command.tsx).
