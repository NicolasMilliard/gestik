import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import type { RouterHistory } from "@tanstack/react-router";

import { DocsPageError } from "@/components/layout/docs-page-error";
import { components } from "@/lib/component-registry";
import { HomePage } from "@/pages/home-page";
import { NotFoundPage } from "@/pages/not-found-page";

import App from "./app";

const rootRoute = createRootRoute({
  component: App,
  notFoundComponent: NotFoundPage,
});
const homeRoute = createRoute({
  component: HomePage,
  getParentRoute: () => rootRoute,
  path: "/",
});
const componentRoutes = components.map(({ path, Page }) =>
  createRoute({
    component: Page,
    errorComponent: DocsPageError,
    getParentRoute: () => rootRoute,
    path,
  })
);
const routeTree = rootRoute.addChildren([homeRoute, ...componentRoutes]);

export const createDocsRouter = ({
  history,
  basepath = import.meta.env.BASE_URL,
}: { history?: RouterHistory; basepath?: string } = {}) =>
  createRouter({
    basepath,
    defaultPendingMs: Number.POSITIVE_INFINITY,
    defaultPreload: "intent",
    defaultViewTransition: false,
    history,
    routeTree,
    scrollRestoration: true,
    scrollRestorationBehavior: "instant",
    trailingSlash: "always",
  });

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createDocsRouter>;
  }
}
