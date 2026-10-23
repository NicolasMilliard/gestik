export const DocsSidebar = () => (
  <aside className="border-b border-zinc-200 bg-zinc-50 px-5 py-5 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-r lg:border-b-0 lg:py-7">
    <a
      className="inline-flex items-center gap-2 text-xl font-bold tracking-tight"
      href="#top"
    >
      <span
        className="grid size-8 place-items-center rounded-lg bg-zinc-900 text-base text-white"
        aria-hidden="true"
      >
        g.
      </span>
      gestik
    </a>

    <nav
      className="mt-5 flex gap-2 text-sm lg:mt-10 lg:flex-col"
      aria-label="Documentation"
    >
      <span className="hidden px-3 pb-1 text-xs font-semibold text-zinc-500 lg:block">
        Getting started
      </span>
      <a
        className="rounded-lg px-3 py-2 text-zinc-600 hover:bg-zinc-200"
        href="#overview"
      >
        Overview
      </a>

      <span className="hidden px-3 pt-5 pb-1 text-xs font-semibold text-zinc-500 lg:block">
        Components
      </span>
      <a
        className="rounded-lg bg-zinc-200 px-3 py-2 font-medium"
        href="#drag-hint"
      >
        DragHint
      </a>
    </nav>

    <p className="mt-auto hidden px-3 text-xs leading-5 text-zinc-500 lg:block">
      Animated interaction hints for interfaces.
    </p>
  </aside>
);
