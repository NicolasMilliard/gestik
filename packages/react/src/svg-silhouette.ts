import type { IconSilhouette } from "@gestik/core";

const RESOLUTION = 256;
const SUPPORTED_ELEMENTS =
  /^(?:svg|g|path|rect|circle|ellipse|line|polyline|polygon|title|desc)$/u;
const GEOMETRY_STYLES =
  "fill-rule stroke-width stroke-linecap stroke-linejoin stroke-miterlimit stroke-dasharray stroke-dashoffset transform transform-origin transform-box".split(
    " "
  );

const opaquePaint = (paint: string, opacity: string) =>
  paint === "none" ||
  paint === "transparent" ||
  opacity === "0" ||
  /^rgba\(.*,\s*0\)$/u.test(paint)
    ? "none"
    : "black";

/** Snapshot self-contained geometry; SVG image decoding does not execute scripts. */
export const snapshotSvg = (wrapper: Element | null): string | null => {
  const svg = wrapper?.querySelector("svg");
  // SVG's own parser handles malformed geometry; only self-contained viewports qualify.
  if (
    !svg?.getAttribute("viewBox") ||
    wrapper?.querySelectorAll("svg").length !== 1
  ) {
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
    // Resolve inherited/CSS paints before detaching; opacity must not weaken a cutout.
    target.removeAttribute("style");
    for (const property of GEOMETRY_STYLES) {
      const value = style.getPropertyValue(property);
      if (value) {
        target.style.setProperty(property, value);
      }
    }
    target.style.fill = opaquePaint(style.fill, style.fillOpacity);
    target.style.stroke = opaquePaint(style.stroke, style.strokeOpacity);
    for (const property of ["opacity", "fill-opacity", "stroke-opacity"]) {
      target.style.setProperty(property, "1");
    }
    target.style.display =
      style.display === "none" || style.opacity === "0" ? "none" : "inline";
    target.style.visibility = style.visibility;
  }
  clone.setAttribute("width", String(RESOLUTION));
  clone.setAttribute("height", String(RESOLUTION));
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
