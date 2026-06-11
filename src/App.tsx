import { Authenticated, Unauthenticated } from "convex/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Dashboard from "@/pages/dashboard";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Order from "@/pages/order";
import Profile from "@/pages/profile";

import { Layout } from "@/components/layout";

export default function App() {
  return (
    <BrowserRouter>
      <Authenticated>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/order" element={<Order />} />
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
