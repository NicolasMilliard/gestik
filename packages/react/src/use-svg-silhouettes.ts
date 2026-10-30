import type { IconSilhouette } from "@gestik/core";
import type { RefObject } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { createSvgSilhouette, snapshotSvg } from "./svg-silhouette";

const useClientLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Shared by hints' artwork wrappers; callers own placement and animation. */
export const useSvgSilhouettes = <Pose extends string>(
  sources: Record<Pose, RefObject<Element | null>>,
  enabled: boolean
) => {
  const [result, setResult] = useState<{
    silhouettes: Partial<Record<Pose, IconSilhouette | null>>;
    ready: boolean;
  }>({ ready: !enabled, silhouettes: {} });
  const request = useRef("");

  useClientLayoutEffect(() => {
    if (!enabled) {
      request.current = "";
      return;
    }
    const update = () => {
      const snapshots = (Object.keys(sources) as Pose[]).map(
        (pose) => [pose, snapshotSvg(sources[pose].current)] as const
      );
      const signature = JSON.stringify(snapshots);
      if (request.current === signature) {
        return;
      }
      request.current = signature;
      setResult({ ready: false, silhouettes: {} });
      // An unsupported pose or a blocked canvas falls back to unmasked artwork.
      const generate = async () => {
        const entries = await Promise.all(
          snapshots.map(async ([pose, snapshot]) => [
            pose,
            snapshot
              ? await createSvgSilhouette(snapshot).catch(() => null)
              : null,
          ])
        );
        if (request.current === signature) {
          setResult({
            ready: true,
            silhouettes: Object.fromEntries(entries),
          });
        }
      };
      // Every rasterization rejection is handled per pose above.
      void generate();
    };
    update();
    const observer = new MutationObserver(update);
    for (const ref of Object.values<RefObject<Element | null>>(sources)) {
      if (ref.current) {
        observer.observe(ref.current, {
          attributes: true,
          childList: true,
          subtree: true,
        });
      }
    }
    return () => observer.disconnect();
  });

  return { ...result, ready: !enabled || result.ready };
};
