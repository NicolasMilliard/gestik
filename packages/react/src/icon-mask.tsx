import type { ReactNode } from "react";

/** A filled SVG silhouette, independent of an icon's color or opacity. */
export interface IconSilhouette {
  path: string;
  viewBox: string;
}

interface IconMaskProps {
  id: string;
  width: number;
  height: number;
  children: ReactNode;
}

// Keep the definition mounted for SSR and reduced motion; animation belongs
// to the caller so the cutout can share the visible icon's CSS timeline.
export const IconMask = ({ id, width, height, children }: IconMaskProps) => (
  <svg
    width="0"
    height="0"
    aria-hidden="true"
    focusable="false"
    style={{ position: "absolute" }}
  >
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
  </svg>
);
