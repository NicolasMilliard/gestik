import { Highlight, themes } from "prism-react-renderer";
import { Fragment } from "react";

interface CodeSnippetProps {
  code: string;
  language?: "tsx" | "css";
}

export const CodeSnippet = ({ code, language = "tsx" }: CodeSnippetProps) => {
  const lines = code.split("\n");
  const indent = Math.min(
    ...lines
      .filter((line) => line.trim())
      .map((line) => line.match(/^\s*/u)?.[0].length ?? 0)
  );
  const source = lines
    .map((line) => line.slice(indent))
    .join("\n")
    .trim();

  return (
    <Highlight code={source} language={language} theme={themes.github}>
      {({ tokens, getTokenProps }) => (
        <pre
          className="overflow-x-auto p-5 leading-7"
          aria-label={`${language === "css" ? "CSS" : "React"} code example`}
        >
          <code>
            {tokens.map((line, lineIndex) => (
              // Lines and tokens have no identity beyond their position in the source.
              <Fragment key={lineIndex}>
                {line.map((token, tokenIndex) => (
                  <span key={tokenIndex} {...getTokenProps({ token })}>
                    {token.empty ? "" : token.content}
                  </span>
                ))}
                {lineIndex < tokens.length - 1 ? "\n" : null}
              </Fragment>
            ))}
          </code>
        </pre>
      )}
    </Highlight>
  );
};

export const CodeBlock = ({ code, language = "tsx" }: CodeSnippetProps) => (
  <div className="mt-3 min-w-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50/70">
    <div className="border-b border-zinc-200 px-5 py-3 font-medium text-zinc-500">
      {language === "css" ? "CSS" : "React"}
    </div>
    <CodeSnippet code={code} language={language} />
  </div>
);
