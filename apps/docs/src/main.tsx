import { RouterProvider } from "@tanstack/react-router";
import { RouterClient } from "@tanstack/react-router/ssr/client";
import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";

import "./index.css";
import { createDocsRouter } from "./router";

const root = document.querySelector("#root");

if (!root) {
  throw new Error("The docs app requires a #root element.");
}

const router = createDocsRouter();

if (root.hasChildNodes()) {
  hydrateRoot(
    root,
    <StrictMode>
      <RouterClient router={router} />
    </StrictMode>
  );
} else {
  await router.load();
  createRoot(root).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
