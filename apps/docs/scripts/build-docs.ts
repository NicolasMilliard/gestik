import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { build, resolveConfig } from "vite";
import type { LogLevel } from "vite";

interface PrerenderModule {
  paths: string[];
  render: (url: string) => Promise<Response>;
}

const root = fileURLToPath(new URL("..", import.meta.url));

export const buildDocs = async ({
  outDir = path.join(root, "dist"),
  logLevel = "info",
}: { outDir?: string; logLevel?: LogLevel } = {}) => {
  const config = await resolveConfig(
    { logLevel, root },
    "build",
    "production",
    "production"
  );
  const { base } = config;
  // Vitest runs this builder too; keep package conditions and JSX in production.
  const client = await build({
    build: { outDir },
    define: { "process.env.NODE_ENV": JSON.stringify("production") },
    logLevel,
    oxc: { jsx: { development: false } },
    resolve: { conditions: ["module", "browser", "production"] },
    root,
  });
  const template = await readFile(path.join(outDir, "index.html"), "utf-8");
  const head = template
    .match(/<head>(?<head>[\s\S]*?)<\/head>/u)
    ?.groups?.head.replace(/<title>[\s\S]*?<\/title>/u, "");
  if (!head) {
    throw new Error("The client build did not produce an HTML head.");
  }
  const temporaryRoot = path.join(root, "node_modules/.tmp");
  await mkdir(temporaryRoot, { recursive: true });
  const serverDir = await mkdtemp(path.join(temporaryRoot, "prerender-"));
  try {
    await build({
      build: {
        outDir: serverDir,
        rolldownOptions: { output: { entryFileNames: "entry-server.mjs" } },
        ssr: "src/entry-server.tsx",
      },
      define: { "process.env.NODE_ENV": JSON.stringify("production") },
      logLevel,
      oxc: { jsx: { development: false } },
      root,
      ssr: { resolve: { conditions: ["module", "node", "production"] } },
    });
    const { paths, render } = (await import(
      pathToFileURL(path.join(serverDir, "entry-server.mjs")).href
    )) as PrerenderModule;
    const rendered = await Promise.allSettled(
      [...paths, "/__not-found"].map(async (routePath) => {
        const pathname =
          routePath === "/"
            ? base
            : `${base}${routePath.slice(1).replace(/\/$/u, "")}/`;
        const response = await render(`https://gestik.invalid${pathname}`);
        const notFound = routePath === "/__not-found";
        if (response.status !== (notFound ? 404 : 200)) {
          throw new Error(
            `Prerendering ${pathname} returned ${response.status}.`
          );
        }
        const file = notFound
          ? path.join(outDir, "404.html")
          : path.join(outDir, routePath.slice(1), "index.html");
        await mkdir(path.dirname(file), { recursive: true });
        const renderedHtml = await response.text();
        const html = renderedHtml.replace("</head>", `${head}</head>`);
        await writeFile(file, html);
      })
    );
    const failures = rendered.filter((result) => result.status === "rejected");
    if (failures.length > 0) {
      throw new AggregateError(
        failures.map((result) => result.reason),
        "Prerendering failed."
      );
    }
  } finally {
    await rm(serverDir, { force: true, recursive: true });
  }
  return client;
};
