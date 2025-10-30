// client/src/components/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom"; // ✅ must be imported at the top
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Main content container */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet /> {/* ✅ this renders the current route’s page */}
      </main>

      <Footer />
    </div>
  );
}
