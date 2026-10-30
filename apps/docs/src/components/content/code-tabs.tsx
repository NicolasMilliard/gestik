import { Tabs } from "@base-ui/react/tabs";
import { useId } from "react";

import { CodeSnippet } from "./code-block";

const LANGUAGES = [
  { label: "React", value: "tsx" },
  { label: "CSS", value: "css" },
] as const;

export const CodeTabs = ({ code, css }: { code: string; css: string }) => {
  const id = useId();

  return (
    <Tabs.Root
      defaultValue="tsx"
      className="mt-3 min-w-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50/70"
    >
      <Tabs.List
        activateOnFocus
        aria-label="Example code language"
        className="flex gap-5 border-b border-zinc-200 px-5"
      >
        {LANGUAGES.map(({ label, value }) => (
          <Tabs.Tab
            key={value}
            value={value}
            id={`${id}-${value}-tab`}
            aria-controls={`${id}-${value}-panel`}
            className="min-h-12 border-b-2 border-transparent px-1 font-medium text-zinc-500 transition-colors hover:text-zinc-800 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-brand motion-reduce:transition-none data-active:border-brand data-active:text-zinc-900"
          >
            {label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {LANGUAGES.map(({ value }) => (
        <Tabs.Panel
          key={value}
          value={value}
          id={`${id}-${value}-panel`}
          aria-labelledby={`${id}-${value}-tab`}
          keepMounted
          className="focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
        >
          <CodeSnippet code={value === "tsx" ? code : css} language={value} />
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
};
