/** @vitest-environment jsdom */

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { DragHint } from "./drag-hint";

describe(DragHint, () => {
  afterEach(cleanup);

  it("is decorative and drags right by default", () => {
    const { container } = render(<DragHint />);
    const hint = container.firstElementChild as HTMLElement | null;

    expect(hint?.getAttribute("aria-hidden")).toBe("true");
    expect(hint?.hasAttribute("inert")).toBeTruthy();
    expect(hint?.dataset.direction).toBe("right");
  });

  it("reserves proportional space at a custom size", () => {
    const { container } = render(<DragHint direction="left" size={84} />);
    const hint = container.firstElementChild as HTMLElement | null;

    expect(hint?.dataset.direction).toBe("left");
    expect(hint?.style.width).toBe("84px");
    expect(hint?.style.height).toBe("54px");
  });

  it("positions both built-in poses and cutouts at the square's lower edge", () => {
    const { container } = render(<DragHint />);
    const anchor = container.querySelector<HTMLElement>(
      ".gestik-drag-hint__icon-anchor"
    );
    const icons = anchor?.querySelectorAll("svg");

    expect(anchor?.style.transform).toBe("translate(-50%, 0%)");
    expect(icons).toHaveLength(2);
    for (const icon of icons ?? []) {
      expect(
        ["width", "height", "focusable"].map((attribute) =>
          icon.getAttribute(attribute)
        )
      ).toStrictEqual(["100%", "100%", "false"]);
    }
    expect(
      [...container.querySelectorAll("mask svg")].map((mask) => [
        mask.getAttribute("x"),
        mask.getAttribute("y"),
      ])
    ).toStrictEqual([
      ["4", "16"],
      ["4", "16"],
    ]);
  });

  it("renders custom poses at the requested hotspot", () => {
    const { container } = render(
      <DragHint
        className="custom-hint"
        icons={{
          grabbing: <svg data-testid="grabbing-pose" />,
          idle: (
            <a href="#example" data-testid="idle-pose">
              Custom artwork
            </a>
          ),
        }}
        hotspot={{ x: 0.25, y: 0.75 }}
      />
    );

    expect(
      container.firstElementChild?.classList.contains("custom-hint")
    ).toBeTruthy();
    expect(
      container
        .querySelector(".gestik-drag-hint__icon--idle")
        ?.contains(screen.getByTestId("idle-pose"))
    ).toBeTruthy();
    expect(
      container
        .querySelector(".gestik-drag-hint__icon--grabbing")
        ?.contains(screen.getByTestId("grabbing-pose"))
    ).toBeTruthy();

    const anchor = container.querySelector<HTMLElement>(
      ".gestik-drag-hint__icon-anchor"
    );
    expect(anchor?.style.transform).toBe("translate(-25%, -75%)");
    expect([
      container.querySelector("mask"),
      screen.getByTestId("idle-pose").closest("[inert]"),
    ]).toStrictEqual([null, container.firstElementChild]);
  });

  it("keeps each instance's background connected to its own mask", () => {
    const { container, rerender } = render(
      <>
        <DragHint />
        <DragHint direction="left" />
      </>
    );
    const hints = container.querySelectorAll(".gestik-drag-hint");
    const maskIds = [...hints].map((hint) => {
      const mask = hint.querySelector("mask");
      const background = hint.querySelector<SVGElement>(
        ".gestik-drag-hint__masked-scene"
      );

      expect(mask).not.toBeNull();
      // Native SVG masking avoids WebKit's CSS mask repaint path on HTML.
      expect([
        background?.namespaceURI,
        background?.getAttribute("mask"),
      ]).toStrictEqual(["http://www.w3.org/2000/svg", `url(#${mask?.id})`]);
      expect(
        background?.querySelectorAll(
          ".gestik-drag-hint__square, .gestik-drag-hint__destination, .gestik-drag-hint__shadow"
        )
      ).toHaveLength(3);
      expect(
        background?.querySelector(".gestik-drag-hint__icon-anchor")
      ).toBeNull();
      return mask?.id;
    });

    expect(new Set(maskIds).size).toBe(2);

    rerender(
      <>
        <DragHint direction="left" />
        <DragHint />
      </>
    );

    expect(
      [...container.querySelectorAll("mask")].map((mask) => mask.id)
    ).toStrictEqual(maskIds);
  });

  it("positions custom silhouettes using the icon box and hotspot", () => {
    const icons = {
      grabbing: <svg data-testid="grabbing-pose" />,
      idle: <svg data-testid="idle-pose" />,
    };
    const iconMasks = {
      grabbing: { path: "M10 10h80v80H10Z", viewBox: "0 0 100 100" },
      idle: { path: "M4 4h16v16H4Z", viewBox: "0 0 24 24" },
    };
    const { container, rerender } = render(
      <DragHint
        icons={icons}
        iconMasks={iconMasks}
        hotspot={{ x: 0.25, y: 0.75 }}
      />
    );

    for (const pose of ["idle", "grabbing"] as const) {
      const silhouette = container.querySelector(
        `.gestik-drag-hint__mask--${pose}`
      );

      expect(silhouette?.getAttribute("viewBox")).toBe(iconMasks[pose].viewBox);
      expect(
        ["x", "y", "width", "height"].map((attribute) =>
          silhouette?.getAttribute(attribute)
        )
      ).toStrictEqual(["10", "-2", "24", "24"]);
      expect(silhouette?.querySelector("path")?.getAttribute("d")).toBe(
        iconMasks[pose].path
      );
      // Custom components render once, outside the mask.
      expect(screen.getAllByTestId(`${pose}-pose`)).toHaveLength(1);
    }

    rerender(<DragHint icons={icons} />);

    expect(container.querySelector("mask")).toBeNull();
    expect(
      container
        .querySelector(".gestik-drag-hint__masked-scene")
        ?.getAttribute("mask")
    ).toBeNull();
  });

  it("restarts the scene when custom artwork or its cutout is mounted", () => {
    const icons = { grabbing: <svg />, idle: <svg /> };
    const { container, rerender } = render(<DragHint />);
    const original = container.querySelector(".gestik-drag-hint__stage");

    rerender(<DragHint icons={icons} />);
    const custom = container.querySelector(".gestik-drag-hint__stage");
    expect(custom).not.toBe(original);

    rerender(
      <DragHint
        icons={icons}
        iconMasks={{
          grabbing: { path: "M0 0h24v24H0Z", viewBox: "0 0 24 24" },
          idle: { path: "M0 0h24v24H0Z", viewBox: "0 0 24 24" },
        }}
      />
    );
    expect(container.querySelector(".gestik-drag-hint__stage")).not.toBe(
      custom
    );
  });

  it("applies playback settings and can resume", () => {
    const { container, rerender } = render(
      <DragHint duration={1400} iterations={2} playing={false} />
    );
    const hint = container.firstElementChild as HTMLElement;

    expect(hint.style.getPropertyValue("--gestik-drag-hint-duration")).toBe(
      "1400ms"
    );
    expect(hint.style.getPropertyValue("--gestik-drag-hint-iterations")).toBe(
      "2"
    );
    expect(hint.style.getPropertyValue("--gestik-drag-hint-play-state")).toBe(
      "paused"
    );

    rerender(<DragHint duration={1400} iterations={2} playing />);

    expect(hint.style.getPropertyValue("--gestik-drag-hint-play-state")).toBe(
      "running"
    );
  });
});
