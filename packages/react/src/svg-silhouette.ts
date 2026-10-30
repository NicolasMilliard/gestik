import type { IconSilhouette } from "@gestik/core";

const RESOLUTION = 256;
const SUPPORTED_ELEMENTS =
  /^(?:svg|g|path|rect|circle|ellipse|line|polyline|polygon|title|desc)$/u;
const GEOMETRY_STYLES =
  "fill stroke fill-rule stroke-width stroke-linecap stroke-linejoin stroke-miterlimit stroke-dasharray stroke-dashoffset transform transform-origin transform-box".split(
    " "
  );

/** Snapshot self-contained geometry; SVG image decoding does not execute scripts. */
export const snapshotSvg = (wrapper: Element | null): string | null => {
  const svgs = wrapper?.querySelectorAll("svg");
  const svg = svgs?.length === 1 ? svgs[0] : null;
  // SVG's own parser handles malformed geometry; only self-contained viewports qualify.
  if (!svg?.getAttribute("viewBox")) {
    return null;
  }
  const sources = [svg, ...svg.querySelectorAll("*")];
  const clone = svg.cloneNode(true) as SVGSVGElement;
  const targets = [clone, ...clone.querySelectorAll("*")];
  for (const [index, source] of sources.entries()) {
    const target = targets[index] as SVGElement;
    const style = getComputedStyle(source);
    if (
      !SUPPORTED_ELEMENTS.test(source.localName) ||
      [
        "filter",
        "clip-path",
        "mask",
        "marker-start",
        "marker-mid",
        "marker-end",
        "vector-effect",
      ].some((property) => {
        const value = style.getPropertyValue(property);
        return value && value !== "none";
      })
    ) {
      return null;
    }
    // Preserve resolved paint alpha; the filled raster becomes an opaque SVG path.
    target.removeAttribute("style");
    for (const property of GEOMETRY_STYLES) {
      target.style.setProperty(property, style.getPropertyValue(property));
    }
    for (const opacity of ["fill-opacity", "stroke-opacity"]) {
      target.style.setProperty(
        opacity,
        style.getPropertyValue(opacity) === "0" ? "0" : "1"
      );
    }
    target.style.opacity = "1";
    target.style.display =
      style.display === "none" || style.opacity === "0" ? "none" : "inline";
    target.style.visibility = style.visibility;
  }
  for (const dimension of ["width", "height"]) {
    clone.setAttribute(dimension, String(RESOLUTION));
  }
  return new XMLSerializer().serializeToString(clone);
};

/** Fill every transparent region that cannot reach the padded image's exterior. */
export const filledSilhouettePath = (
  pixels: Uint8ClampedArray,
  width: number,
  height: number
): string => {
  const outside = new Uint8Array(width * height);
  // Every boundary pixel is transparent padding, so row-edge neighbors share the exterior.
  const queue = [0];
  outside[0] = 1;
  for (const pixel of queue) {
    for (const neighbor of [
      pixel - width,
      pixel + width,
      pixel - 1,
      pixel + 1,
    ]) {
      if (
        neighbor >= 0 &&
        neighbor < outside.length &&
        !outside[neighbor] &&
        pixels[neighbor * 4 + 3] === 0
      ) {
        outside[neighbor] = 1;
        queue.push(neighbor);
      }
    }
  }
  let path = "";
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!outside[y * width + x]) {
        const left = x;
        while (x + 1 < width && !outside[y * width + x + 1]) {
          x += 1;
        }
        path += `M${left} ${y}h${x - left + 1}v1H${left}Z`;
      }
    }
  }
  return path;
};

export const createSvgSilhouette = async (
  snapshot: string
): Promise<IconSilhouette | null> => {
  const image = new Image();
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(snapshot)}`;
  await image.decode();
  const canvas = document.createElement("canvas");
  // Padding keeps edge-touching shapes separate from the flood-fill seed.
  canvas.width = RESOLUTION + 2;
  canvas.height = RESOLUTION + 2;
  const context = canvas.getContext("2d");
  if (!context) {
    return null;
  }
  context.drawImage(image, 1, 1, RESOLUTION, RESOLUTION);
  return {
    path: filledSilhouettePath(
      context.getImageData(0, 0, canvas.width, canvas.height).data,
      canvas.width,
      canvas.height
    ),
    viewBox: `1 1 ${RESOLUTION} ${RESOLUTION}`,
  };
};
