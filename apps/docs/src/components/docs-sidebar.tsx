import { Link, NavLink } from "react-router";

import { components } from "../lib/components";

export const DocsSidebar = () => (
  <aside className="border-b border-zinc-200 bg-zinc-50 px-5 py-5 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-r lg:border-b-0 lg:py-7">
    <Link
      className="inline-flex items-center gap-2 rounded-lg text-xl font-bold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-700"
      to="/"
    >
      <span
        className="grid size-8 place-items-center rounded-lg bg-zinc-900 text-base text-white"
        aria-hidden="true"
      >
        g.
      </span>
      gestik
    </Link>

    <nav
      className="mt-5 flex flex-wrap gap-2 text-sm lg:mt-10 lg:flex-col"
      aria-label="Documentation"
    >
      <span className="hidden px-3 pb-1 text-xs font-semibold text-zinc-500 lg:block">
        Getting started
      </span>
      <NavLink
        className="rounded-lg px-3 py-2 text-zinc-600 hover:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-orange-700 aria-[current=page]:bg-zinc-200 aria-[current=page]:font-medium aria-[current=page]:text-zinc-900"
        to="/"
        end
      >
        Overview
      </NavLink>

      <span className="hidden px-3 pt-5 pb-1 text-xs font-semibold text-zinc-500 lg:block">
        Components
      </span>
      {components.map(({ name, path }) => (
        <NavLink
          className="rounded-lg px-3 py-2 text-zinc-600 hover:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-orange-700 aria-[current=page]:bg-zinc-200 aria-[current=page]:font-medium aria-[current=page]:text-zinc-900"
          key={path}
          to={path}
          end
        >
          {name}
        </NavLink>
      ))}
    </nav>

    <p className="mt-auto hidden px-3 text-xs leading-5 text-zinc-500 lg:block">
      Animated interaction hints for interfaces.
    </p>
  </aside>
);
