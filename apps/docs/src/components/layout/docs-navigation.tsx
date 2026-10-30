import { Link } from "@tanstack/react-router";

import { components } from "@/lib/component-registry";

export const DocsBrand = ({ onNavigate }: { onNavigate?: () => void }) => (
  <Link
    className="inline-flex items-center gap-2.5 rounded-lg text-lg font-medium tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
    to="/"
    onClick={onNavigate}
  >
    <img
      alt=""
      className="size-7"
      height={28}
      src={`${import.meta.env.BASE_URL}favicon.svg`}
      width={28}
      aria-hidden="true"
    />
    gestik
  </Link>
);

export const DocsNavigation = ({
  className,
  onNavigate,
}: {
  className: string;
  onNavigate?: () => void;
}) => (
  <nav className={className} aria-label="Documentation">
    <Link
      className="rounded-lg px-3 py-2 text-zinc-500 hover:bg-zinc-100/70 hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-brand aria-[current=page]:bg-brand-soft aria-[current=page]:text-brand"
      to="/"
      activeOptions={{ exact: true }}
      onClick={onNavigate}
    >
      Overview
    </Link>

    {components.map(({ name, path }) => (
      <Link
        className="rounded-lg px-3 py-2 text-zinc-500 hover:bg-zinc-100/70 hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-brand aria-[current=page]:bg-brand-soft aria-[current=page]:text-brand"
        key={path}
        to={path}
        activeOptions={{ exact: true }}
        onClick={onNavigate}
      >
        {name}
      </Link>
    ))}
  </nav>
);
