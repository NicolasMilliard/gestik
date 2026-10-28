import { useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router";

import { DocsSidebar } from "./components/docs-sidebar";
import { components } from "./lib/components";
import { HomePage } from "./pages/home-page";
import { NotFoundPage } from "./pages/not-found-page";

const App = () => {
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);
  const main = useRef<HTMLElement>(null);

  useEffect(() => {
    if (previousPath.current !== pathname) {
      previousPath.current = pathname;
      main.current?.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-700 lg:grid lg:grid-cols-[216px_minmax(0,1fr)]">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:ring-2 focus:ring-brand"
        href="#main-content"
        onClick={(event) => {
          // Focus the content without replacing the hash route.
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
        <Routes>
          <Route path="/" element={<HomePage />} />
          {components.map(({ path, Page }) => (
            <Route key={path} path={path} element={<Page />} />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
