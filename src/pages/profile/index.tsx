import { Authenticated } from "convex/react";

import Page from "./page";

export default function SecuredPage() {
  return (
    <Authenticated>
      <Page />
    </Authenticated>
  );
}
