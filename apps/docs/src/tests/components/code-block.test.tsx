/** @vitest-environment jsdom */

import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { CodeBlock } from "@/components/content/code-block";

describe(CodeBlock, () => {
  afterEach(cleanup);

  it("colors JSX while preserving the source, blank lines, and literal markup", () => {
    const source = `import { DragHint } from "@gestik/react";

<DragHint size={168} playing={false} />`;
    const { container, rerender } = render(<CodeBlock code={source} />);
    const code = container.querySelector("code");

    expect(code?.textContent).toBe(source);
    expect(code?.querySelector(".token.tag")?.getAttribute("style")).toContain(
      "color:"
    );
    expect(
      code?.querySelector(".token.string")?.getAttribute("style")
    ).toContain("color:");

    const literal = '<script>alert("example")</script>';
    rerender(<CodeBlock code={literal} />);
    expect(container.querySelector("script")).toBeNull();
    expect(code?.textContent).toBe(literal);
  });

  it("colors CSS and removes only the surrounding template indentation", () => {
    const { container } = render(
      <CodeBlock
        language="css"
        code={`
          .custom-hint {
            --gestik-hold-hint-color: #4338ca;
          }
        `}
      />
    );

    expect(container.querySelector("code")?.textContent).toBe(
      ".custom-hint {\n  --gestik-hold-hint-color: #4338ca;\n}"
    );
    expect(
      container.querySelector(".token.selector")?.getAttribute("style")
    ).toContain("color:");
  });
});
