import React from "react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { ThemeProvider } from "next-themes";
import ReactDOM from "react-dom/client";

import App from "@/App";

import "@/styles/globals.css"

import { DirectionProvider } from "./components/ui/direction";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider attribute="class">
      <ConvexAuthProvider client={convex}>
        <DirectionProvider direction="rtl">
          <App />
        </DirectionProvider>
      </ConvexAuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
