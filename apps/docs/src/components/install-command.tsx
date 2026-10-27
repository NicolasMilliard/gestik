import { useState } from "react";

const commands = {
  bun: "bun add @gestik/react",
  npm: "npm install @gestik/react",
  pnpm: "pnpm add @gestik/react",
  yarn: "yarn add @gestik/react",
};

const packageManagers = ["npm", "pnpm", "yarn", "bun"] as const;

export const InstallCommand = () => {
  const [manager, setManager] =
    useState<(typeof packageManagers)[number]>("npm");

  return (
    <div className="max-w-xl">
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
        <fieldset
          className="flex gap-1 border-b border-zinc-200 p-2"
          aria-label="Package manager"
        >
          {packageManagers.map((name) => (
            <button
              className="rounded-md px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-orange-700 aria-pressed:bg-white aria-pressed:text-zinc-900 aria-pressed:shadow-sm"
              key={name}
              type="button"
              aria-pressed={manager === name}
              onClick={() => setManager(name)}
            >
              {name}
            </button>
          ))}
        </fieldset>
        <pre className="overflow-x-auto px-5 py-4 text-sm" aria-live="polite">
          <span className="mr-3 text-zinc-400 select-none" aria-hidden="true">
            $
          </span>
          <code>{commands[manager]}</code>
        </pre>
      </div>
      <p className="mt-3 text-xs leading-5 text-zinc-500">
        Install commands are a preview. The package is not published yet.
      </p>
    </div>
  );
};
