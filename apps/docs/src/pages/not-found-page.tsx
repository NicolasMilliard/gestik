import { Link } from "react-router";

export const NotFoundPage = () => (
  <>
    <title>Page not found — Gestik</title>
    <p className="mb-3 text-sm font-medium text-orange-700">404</p>
    <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
    <p className="mt-3 text-zinc-600">
      This page does not exist. Browse the components to find an interaction
      hint.
    </p>
    <Link
      className="mt-6 inline-block rounded-sm text-sm font-medium text-orange-700 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
      to="/"
    >
      Back to overview
    </Link>
  </>
);
