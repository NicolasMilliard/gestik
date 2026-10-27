# Docs branding

The requested direction is a lighter interface: less text, smaller headings, lighter font weights, and compact component previews.

- Use Figtree for headings and interface text, with Paper Mono for install commands and code. Keep install commands at weight 200 and code examples at weight 400. Serve the fonts with the docs and preserve the existing sizes. Keep demo action rows able to wrap at narrow widths so longer labels stay inside the page.
- Avoid labels that repeat the title. `Gestik / React` and `Component / DragHint` added weight without helping users navigate.
- Let the home gallery explain the library. Keep “Show users how.” and remove the explanatory paragraph; retain the package publication notice and useful component instructions.
- Keep each home preview square, with its name on the same quiet surface. The former full-width rectangles and separate white caption strips made the containers dominate the hints.
- Give the sidebar the same soft gray surface as the cards and install command, so it stays distinct from the white content area.
- Use the Ember accent (`#c24c24`) from the color comparison, with pale peach selected surfaces (`#fdf7f4`). Keep the tint light enough for small accent text to remain readable; a stronger peach tint reduced contrast. Accent “how.” in the homepage headline, matching the preview.
- Highlight only the package name in install commands with the accent color.
- Playground animation stages use a subtle 16px dot grid that fades toward the edges; keep the instruction and hint fully visible above it.
- On small screens, keep navigation behind a three-line menu button that becomes a close icon when expanded. Match the copy button's press and icon swap feedback, with the close icon staying visible while navigation is open. Use Phosphor for docs UI icons, including the install command's copy action; the package stays independent of this docs dependency.
- Select trigger carets point up while the popup is open and down when closed, using Base UI's popup state.
- Keep the install copy icon at 18px inside a 44px click target. Compress its background and icon separately on press, then shrink and fade between copy and check. Keep the check for two seconds, and switch instantly under reduced motion. The hit area stays stable while the visual layers scale.
- Keep decorative hints out of the accessibility tree and preserve visible focus, active navigation, and readable text contrast while softening the interface.

The warm Ember accent, 36px regular desktop headline, and compact square cards are choices for review on `feat/branding`. They do not change the React package's default colors or animation behavior.
