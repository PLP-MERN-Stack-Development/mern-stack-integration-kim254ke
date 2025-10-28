// client/src/components/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import useTheme from "../hooks/useTheme";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/create", label: "Create Post" },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur bg-white/80 dark:bg-gray-900/80 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container flex items-center justify-between py-3">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-blue-600 dark:text-blue-400"
        >
          MERN<span className="text-gray-800 dark:text-gray-100">Blog</span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium ${
                location.pathname === link.to
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={18} className="text-yellow-400" />
            ) : (
              <Moon size={18} className="text-gray-800" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
