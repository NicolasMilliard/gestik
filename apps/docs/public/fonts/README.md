# Docs fonts

- **Figtree** is bundled through `@fontsource-variable/figtree`. Its license is included here as `figtree-OFL.txt` so it accompanies the published webfonts.
- **Paper Mono** is the unmodified variable WOFF2 from [Paper Mono v1.000](https://github.com/paper-design/paper-mono/releases/tag/v1.000), stored as `paper-mono-variable.woff2`. Its original SIL Open Font License is included as `paper-mono-OFL.txt`.

The shared sidebar mark and favicon in `../favicon.svg` use Figtree's “g.” glyphs outlined at weight 500, with the Ember accent and pale peach background. The outlines render without loading a font.

When updating the fonts, retain their copyright notices and licenses alongside the published assets. Font dependencies and assets belong to the docs app; the React package does not load them.
