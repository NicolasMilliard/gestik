import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./app.tsx";

const root = document.querySelector("#root");

if (!root) {
  throw new Error("The docs app requires a #root element.");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
