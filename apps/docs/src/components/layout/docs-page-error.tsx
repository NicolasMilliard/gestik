export const DocsPageError = () => (
  <article>
    <title>Page unavailable — Gestik</title>
    <h1 className="text-3xl font-normal tracking-tight">
      This page could not be loaded
    </h1>
    <p className="mt-3 leading-6 text-zinc-500">
      Reload the page to try again, or choose another page from the navigation.
    </p>
    <button
      className="mt-6 rounded-sm text-brand underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
      type="button"
      onClick={() => window.location.reload()}
    >
      Reload page
    </button>
  </article>
);
