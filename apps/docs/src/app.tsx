import { Outlet, Scripts, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import { DocsSidebar } from "./components/docs-sidebar";

const App = () => {
  const pathname = useRouterState({
    select: (state) =>
      state.resolvedLocation?.pathname ?? state.location.pathname,
  });
  const previousPath = useRef(pathname);
  const main = useRef<HTMLElement>(null);

  useEffect(() => {
    if (previousPath.current !== pathname) {
      previousPath.current = pathname;
      main.current?.focus({ preventScroll: true });
    }
  }, [pathname]);

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-700 lg:grid lg:grid-cols-[216px_minmax(0,1fr)]">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:ring-2 focus:ring-brand"
        href="#main-content"
        onClick={(event) => {
          // Keep the skip link local to the current page.
          event.preventDefault();
          main.current?.focus();
        }}
      >
        Skip to content
      </a>
      <DocsSidebar />

      <main
        className="mx-auto w-full max-w-4xl px-5 py-10 outline-none sm:px-8 lg:px-12 lg:py-16"
        id="main-content"
        ref={main}
        tabIndex={-1}
      >
        <Outlet />
      </main>
      <Scripts />
    </div>
  );
};

export default App;
