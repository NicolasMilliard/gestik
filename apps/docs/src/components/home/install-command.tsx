import { CheckIcon } from "@phosphor-icons/react/dist/csr/Check";
import { CopyIcon } from "@phosphor-icons/react/dist/csr/Copy";
import { useEffect, useState } from "react";

const packageName = "@gestik/react";

const commandPrefixes = {
  bun: "bun add",
  npm: "npm install",
  pnpm: "pnpm add",
  yarn: "yarn add",
};

const packageManagers = ["npm", "pnpm", "yarn", "bun"] as const;

export const InstallCommand = () => {
  const [manager, setManager] =
    useState<(typeof packageManagers)[number]>("npm");
  const [feedback, setFeedback] = useState<{
    command: string;
    status: "copied" | "error";
  } | null>(null);
  const commandPrefix = commandPrefixes[manager];
  const command = `${commandPrefix} ${packageName}`;
  const status = feedback?.command === command ? feedback.status : null;

  useEffect(() => {
    if (feedback?.status !== "copied") {
      return;
    }

    const timeout = window.setTimeout(() => setFeedback(null), 2000);
    return () => window.clearTimeout(timeout);
  }, [feedback]);

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setFeedback({ command, status: "copied" });
    } catch {
      setFeedback({ command, status: "error" });
    }
  };

  return (
    <div className="max-w-lg">
      <fieldset className="mb-2 flex gap-1" aria-label="Package manager">
        {packageManagers.map((name) => (
          <button
            className="rounded-md px-3 py-1.5 text-zinc-500 hover:text-zinc-800 focus-visible:outline-2 focus-visible:outline-brand aria-pressed:bg-brand-soft aria-pressed:text-brand"
            key={name}
            type="button"
            aria-pressed={manager === name}
            onClick={() => {
              setManager(name);
              setFeedback(null);
            }}
          >
            {name}
          </button>
        ))}
      </fieldset>
      <div className="flex items-center rounded-xl border border-zinc-100 bg-zinc-50/70 pr-1">
        <pre
          className="min-w-0 flex-1 overflow-x-auto px-3 py-3.5 font-extralight text-zinc-600 sm:px-4"
          aria-live="polite"
        >
          <span className="mr-3 text-zinc-400 select-none" aria-hidden="true">
            $
          </span>
          <code>
            {commandPrefix} <span className="text-brand">{packageName}</span>
          </code>
        </pre>
        <button
          className="icon-button relative isolate grid size-11 shrink-0 place-items-center rounded-lg text-zinc-500 hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-brand"
          type="button"
          data-copied={status === "copied"}
          aria-label={
            status === "copied"
              ? "Copied install command"
              : "Copy install command"
          }
          onClick={copyCommand}
        >
          <span className="icon-button__icons size-4.5" aria-hidden="true">
            <CopyIcon
              className="icon-button__default"
              size={18}
              focusable="false"
            />
            <CheckIcon
              className="icon-button__alternate"
              size={18}
              focusable="false"
            />
          </span>
        </button>
      </div>
      <output
        className={status === "error" ? "mt-2 block text-zinc-600" : "sr-only"}
        aria-live="polite"
      >
        {status === "copied" && "Install command copied."}
        {status === "error" &&
          "Could not copy. Select and copy the command manually."}
      </output>
    </div>
  );
};
