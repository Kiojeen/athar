import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import { Authenticated, Unauthenticated } from "convex/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Layout } from "./components/layout";

export default function App() {
  return (
    <BrowserRouter>
      <Authenticated>
        <Layout>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Layout>
      </Authenticated>

      <Unauthenticated>
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      </Unauthenticated>
    </BrowserRouter>
  );
}
