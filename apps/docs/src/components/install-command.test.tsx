/** @vitest-environment jsdom */

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InstallCommand } from "./install-command";

describe("Install command copying", () => {
  const writeText = vi.fn<(text: string) => Promise<void>>();

  beforeEach(() => {
    writeText.mockReset().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it.each([
    ["npm", "npm install @gestik/react"],
    ["pnpm", "pnpm add @gestik/react"],
    ["yarn", "yarn add @gestik/react"],
    ["bun", "bun add @gestik/react"],
  ])(
    "copies the selected %s command without the shell prompt",
    async (manager, command) => {
      render(<InstallCommand />);
      fireEvent.click(screen.getByRole("button", { name: manager }));
      fireEvent.click(
        screen.getByRole("button", { name: "Copy install command" })
      );

      await waitFor(() => {
        expect(screen.getByRole("status").textContent).toBe(
          "Install command copied."
        );
      });
      expect(writeText).toHaveBeenCalledExactlyOnceWith(command);
    }
  );

  it("clears the copy confirmation after two seconds", async () => {
    vi.useFakeTimers();
    render(<InstallCommand />);

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: "Copy install command" })
      );
      await Promise.resolve();
    });
    expect(
      screen.getByRole("button", { name: "Copied install command" })
    ).toBeDefined();

    act(() => vi.advanceTimersByTime(2000));

    expect(
      screen.getByRole("button", { name: "Copy install command" })
    ).toBeDefined();
    expect(screen.getByRole("status").textContent).toBe("");
  });

  it("explains a clipboard failure and lets the user retry", async () => {
    writeText.mockRejectedValueOnce(new Error("Clipboard unavailable"));
    render(<InstallCommand />);
    fireEvent.click(
      screen.getByRole("button", { name: "Copy install command" })
    );

    await waitFor(() => {
      expect(screen.getByRole("status").textContent).toBe(
        "Could not copy. Select and copy the command manually."
      );
    });
    expect(
      screen.queryByRole("button", { name: "Copied install command" })
    ).toBeNull();

    fireEvent.click(
      screen.getByRole("button", { name: "Copy install command" })
    );
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Copied install command" })
      ).toBeDefined();
    });
  });

  it("does not confirm a different command if the manager changes while copying", async () => {
    render(<InstallCommand />);

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: "Copy install command" })
      );
      fireEvent.click(screen.getByRole("button", { name: "bun" }));
      await Promise.resolve();
    });

    expect(writeText).toHaveBeenCalledExactlyOnceWith(
      "npm install @gestik/react"
    );
    expect(
      screen.getByRole("button", { name: "Copy install command" })
    ).toBeDefined();
    expect(screen.getByRole("status").textContent).toBe("");
  });
});
