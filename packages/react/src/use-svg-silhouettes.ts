import type { IconSilhouette } from "@gestik/core";
import type { RefObject } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { createSvgSilhouette, snapshotSvg } from "./svg-silhouette";

const useClientLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/** The stage ref keeps readiness atomic when artwork updates without its parent. */
export const useSvgSilhouettes = <Pose extends string>(
  sources: Record<Pose, RefObject<Element | null>>,
  enabled: boolean,
  stageRef: RefObject<HTMLElement | SVGElement | null>
): {
  ready: boolean;
  silhouettes: Partial<Record<Pose, IconSilhouette | null>>;
} => {
  const [result, setResult] = useState<
    | [
        signature: string,
        silhouettes: Partial<Record<Pose, IconSilhouette | null>>,
      ]
    | null
  >(null);
  const [completedSignature, silhouettes] = result ?? [];
  const request = useRef("");

  useClientLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) {
      return;
    }
    // Reveal only after React has committed the matching mask geometry.
    stage.dataset.ready = String(
      !enabled || completedSignature === request.current
    );
    if (!enabled) {
      request.current = "";
      return;
    }
    const update = async () => {
      const snapshots = (Object.keys(sources) as Pose[]).map(
        (pose) => [pose, snapshotSvg(sources[pose].current)] as const
      );
      const signature = JSON.stringify(snapshots);
      if (request.current === signature) {
        return;
      }
      request.current = signature;
      // Observer updates can paint before React commits their pending state.
      stage.dataset.ready = "false";
      // Cancel all timelines before even a cached decode can finish.
      void stage.clientHeight;
      setResult(null);
      const entries = await Promise.all(
        snapshots.map(async ([pose, snapshot]) => [
          pose,
          snapshot
            ? await createSvgSilhouette(snapshot).catch(() => null)
            : null,
        ])
      );
      if (request.current === signature) {
        setResult([signature, Object.fromEntries(entries)]);
      }
    };
    void update();
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

  return {
    ready: !enabled || result !== null,
    silhouettes: silhouettes ?? {},
  };
};
