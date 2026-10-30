import { ListIcon } from "@phosphor-icons/react/dist/csr/List";
import { lazy, Suspense, useEffect, useId, useState } from "react";

import { DocsBrand, DocsNavigation } from "@/components/layout/docs-navigation";

// Desktop navigation does not need the mobile dialog's focus and scroll handling.
const DocsMobileMenu = lazy(() => import("./docs-mobile-menu"));

export const DocsSidebar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    // Match Tailwind's lg breakpoint so resizing also releases the modal.
    const desktop = window.matchMedia("(min-width: 64rem)");
    const closeOnDesktop = () => {
      if (desktop.matches) {
        setMenuOpen(false);
      }
    };

    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <aside className="sticky top-0 z-30 border-b border-zinc-100 bg-zinc-50 px-5 py-4 lg:flex lg:h-dvh lg:flex-col lg:border-r lg:border-b-0 lg:bg-zinc-50/70 lg:py-7">
      <div className="flex items-center justify-between">
        <DocsBrand />
        <button
          className="icon-button relative isolate grid size-11 shrink-0 place-items-center rounded-lg text-zinc-500 hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-brand lg:hidden"
          type="button"
          aria-label="Open navigation"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-haspopup="dialog"
          onClick={(event) => {
            // The dialog restores this focus after dismissal, including on touch.
            event.currentTarget.focus({ preventScroll: true });
            setMenuOpen(true);
          }}
        >
          <span className="icon-button__icons size-5.5" aria-hidden="true">
            <ListIcon size={22} focusable="false" />
          </span>
        </button>
      </div>

      <DocsNavigation className="mt-10 hidden flex-col gap-1 overflow-y-auto lg:flex" />

      {menuOpen && (
        <Suspense fallback={null}>
          <DocsMobileMenu id={menuId} onClose={() => setMenuOpen(false)} />
        </Suspense>
      )}
    </aside>
  );
};
