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
    <div className="max-w-lg">
      <fieldset className="mb-2 flex gap-1" aria-label="Package manager">
        {packageManagers.map((name) => (
          <button
            className="rounded-md px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-800 focus-visible:outline-2 focus-visible:outline-brand aria-pressed:bg-brand-soft aria-pressed:text-brand"
            key={name}
            type="button"
            aria-pressed={manager === name}
            onClick={() => setManager(name)}
          >
            {name}
          </button>
        ))}
      </fieldset>
      <pre
        className="overflow-x-auto rounded-xl border border-zinc-100 bg-zinc-50/70 px-4 py-3.5 text-sm text-zinc-600"
        aria-live="polite"
      >
        <span className="mr-3 text-zinc-400 select-none" aria-hidden="true">
          $
        </span>
        <code>{commands[manager]}</code>
      </pre>
      <p className="mt-3 text-xs leading-5 text-zinc-500">
        Install commands are a preview. The package is not published yet.
      </p>
    </div>
  );
};
