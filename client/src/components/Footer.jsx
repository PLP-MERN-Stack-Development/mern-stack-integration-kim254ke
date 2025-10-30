import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} DevScribe Blog. All rights reserved.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Built with React and Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
