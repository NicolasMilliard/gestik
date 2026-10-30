import type { ReactNode } from "react";

interface IconMaskProps {
  id: string;
  width: number;
  height: number;
  children: ReactNode;
}

// Mount inside the caller's SVG stage for SSR and reduced motion; animation belongs
// to the caller so the cutout can share the visible icon's CSS timeline.
export const IconMask = ({ id, width, height, children }: IconMaskProps) => (
  <defs>
    <mask
      id={id}
      x="0"
      y="0"
      width={width}
      height={height}
      maskUnits="userSpaceOnUse"
      maskContentUnits="userSpaceOnUse"
      style={{ maskType: "luminance" }}
    >
      <rect width={width} height={height} fill="white" />
      <g fill="black">{children}</g>
    </mask>
  </defs>
);
