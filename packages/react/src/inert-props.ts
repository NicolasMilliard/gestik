import { version } from "react";

export const INERT_PROPS = {
  // React 18 forwards a string attribute; React 19 expects a boolean. Keep
  // this type bridge local, and spread the prop to support React 18's types.
  inert: (Number(version.split(".")[0]) >= 19 ? true : "true") as true,
};
