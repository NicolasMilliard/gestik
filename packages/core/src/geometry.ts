/** A filled SVG silhouette, independent of an icon's color or opacity. */
export interface IconSilhouette {
  path: string;
  viewBox: string;
}

/** Contact point in an icon box, normalized from 0 to 1 on each axis. */
export interface HintHotspot {
  x: number;
  y: number;
}
