import { Link, NavLink } from "react-router";

import { components } from "../lib/components";

export const DocsSidebar = () => (
  <aside className="border-b border-zinc-100 bg-zinc-50/70 px-5 py-5 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-r lg:border-b-0 lg:py-7">
    <Link
      className="inline-flex items-center gap-2.5 rounded-lg text-lg font-medium tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
      to="/"
    >
      <span
        className="grid size-7 place-items-center rounded-lg bg-brand-soft text-base text-brand"
        aria-hidden="true"
      >
        g.
      </span>
      gestik
    </Link>

    <nav
      className="mt-5 flex flex-wrap gap-1 text-sm lg:mt-10 lg:flex-col"
      aria-label="Documentation"
    >
      <NavLink
        className="rounded-lg px-3 py-2 text-zinc-500 hover:bg-zinc-100/70 hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-brand aria-[current=page]:bg-brand-soft aria-[current=page]:text-brand"
        to="/"
        end
      >
        Overview
      </NavLink>

      {components.map(({ name, path }) => (
        <NavLink
          className="rounded-lg px-3 py-2 text-zinc-500 hover:bg-zinc-100/70 hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-brand aria-[current=page]:bg-brand-soft aria-[current=page]:text-brand"
          key={path}
          to={path}
          end
        >
          {name}
        </NavLink>
      ))}
    </nav>
  </aside>
);
