import { Authenticated, Unauthenticated } from "convex/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import Profile from "@/pages/profile";

import { Layout } from "@/components/layout";

export default function App() {
  return (
    <BrowserRouter>
      <Authenticated>
        <Layout>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
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
