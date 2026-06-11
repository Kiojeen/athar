import React from "react";
import App from "@/App";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import ReactDOM from "react-dom/client";

import "@/styles/globals.css";

import { ThemeProvider } from "./components/theme-provider";
import { DirectionProvider } from "./components/ui/direction";
import { Toaster } from "./components/ui/sonner";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="athar-ui-theme">
      <ConvexAuthProvider client={convex}>
        <DirectionProvider direction="rtl" dir="rtl">
          <App />
        </DirectionProvider>
        <Toaster />
      </ConvexAuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
