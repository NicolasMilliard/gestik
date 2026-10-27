import { Link } from "react-router";

import { InstallCommand } from "../components/install-command";
import { OverviewSection } from "../components/overview-section";
import { components } from "../lib/components";

export const HomePage = () => (
  <>
    <title>Gestik — Animated interaction hints for React</title>
    <OverviewSection />
    <InstallCommand />

    <section className="mt-12" aria-label="Components">
      <ul className="grid gap-4 sm:grid-cols-2">
        {components.map(({ name, path, Preview }) => (
          <li key={path}>
            <Link
              className="group block overflow-hidden rounded-2xl border border-zinc-200 hover:border-zinc-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-700"
              to={path}
            >
              <div className="flex min-h-60 items-center justify-center bg-zinc-50 group-hover:bg-zinc-100">
                <Preview size={140} />
              </div>
              <h2 className="border-t border-zinc-200 px-5 py-4 text-sm font-medium">
                {name}
              </h2>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  </>
);
