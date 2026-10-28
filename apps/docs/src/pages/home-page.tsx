import { Link } from "react-router";

import { InstallCommand } from "../components/install-command";
import { OverviewSection } from "../components/overview-section";
import { components } from "../lib/components";

export const HomePage = () => (
  <>
    <title>Gestik</title>
    <OverviewSection />
    <InstallCommand />

    <section className="mt-8" aria-label="Components">
      <ul className="grid max-w-lg grid-cols-2 gap-3 sm:gap-4 xl:max-w-none xl:grid-cols-3">
        {components.map(({ name, path, Preview }) => (
          <li key={path}>
            <Link
              className="group relative flex aspect-square items-center justify-center rounded-2xl border border-zinc-100 bg-zinc-50/70 pb-5 hover:border-brand/25 hover:bg-brand-soft/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
              to={path}
            >
              <Preview size={112} />
              <h2 className="absolute inset-x-0 bottom-4 text-center text-sm font-normal text-zinc-500 group-hover:text-brand">
                {name}
              </h2>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  </>
);
