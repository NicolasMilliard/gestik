import {
  createRequestHandler,
  renderRouterToString,
  RouterServer,
} from "@tanstack/react-router/ssr/server";
import { StrictMode } from "react";

import { components } from "@/lib/component-registry";

import { createDocsRouter } from "./router";

export const paths = ["/", ...components.map(({ path }) => path)];

export const render = (url: string) => {
  const handler = createRequestHandler({
    createRouter: () => createDocsRouter(),
    request: new Request(url),
  });
  return handler(({ router, responseHeaders }) =>
    renderRouterToString({
      children: (
        <html lang="en">
          <head />
          <body>
            <div id="root">
              <StrictMode>
                <RouterServer router={router} />
              </StrictMode>
            </div>
          </body>
        </html>
      ),
      responseHeaders,
      router,
    })
  );
};
