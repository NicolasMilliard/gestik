import { ListIcon } from "@phosphor-icons/react/dist/csr/List";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router";

import { components } from "../lib/components";

export const DocsSidebar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <aside className="border-b border-zinc-100 bg-zinc-50/70 px-5 py-4 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-r lg:border-b-0 lg:py-7">
      <div className="flex items-center justify-between">
        <Link
          className="inline-flex items-center gap-2.5 rounded-lg text-lg font-medium tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          to="/"
          onClick={closeMenu}
        >
          <img
            alt=""
            className="size-7"
            height={28}
            src="/favicon.svg"
            width={28}
            aria-hidden="true"
          />
          gestik
        </Link>
        <button
          className="icon-button relative isolate grid size-11 shrink-0 place-items-center rounded-lg text-zinc-500 hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-brand lg:hidden"
          ref={menuButton}
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="docs-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="icon-button__icons size-[22px]" aria-hidden="true">
            <ListIcon
              className="icon-button__default"
              size={22}
              focusable="false"
            />
            <XIcon
              className="icon-button__alternate"
              size={22}
              focusable="false"
            />
          </span>
        </button>
      </div>

      <nav
        className="mt-4 hidden flex-col gap-1 text-sm data-[open=true]:flex lg:mt-10 lg:flex"
        id="docs-navigation"
        aria-label="Documentation"
        data-open={menuOpen}
      >
        <NavLink
          className="rounded-lg px-3 py-2 text-zinc-500 hover:bg-zinc-100/70 hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-brand aria-[current=page]:bg-brand-soft aria-[current=page]:text-brand"
          to="/"
          end
          onClick={closeMenu}
        >
          Overview
        </NavLink>

        {components.map(({ name, path }) => (
          <NavLink
            className="rounded-lg px-3 py-2 text-zinc-500 hover:bg-zinc-100/70 hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-brand aria-[current=page]:bg-brand-soft aria-[current=page]:text-brand"
            key={path}
            to={path}
            end
            onClick={closeMenu}
          >
            {name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
