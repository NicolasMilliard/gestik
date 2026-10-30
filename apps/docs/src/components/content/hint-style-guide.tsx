export const HintStyleGuide = () => (
  <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-600">
    Every hint accepts <code>style</code> for ordinary React styles and
    <code> --gestik-* </code> CSS variables, without a type assertion. Explicit
    <code> duration</code>, <code>iterations</code>, and <code>playing</code>{" "}
    props take precedence over the matching style variables. Omit a playback
    prop to let styles control it. Use <code>size</code> to scale the entire
    scene;
    <code> width</code> and <code>height</code> in <code>style</code> only
    change the outer span layout.
  </p>
);
