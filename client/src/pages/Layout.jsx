// client/src/components/Layout.jsx

import React from 'react';
import Header from './Header'; // Make sure the path is correct
import Footer from './Footer'; // Optional: A simple Footer component

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Main content container for padding and centering */}
      <main className="flex-grow max-w-7xl w-full mx-auto">
        {children}
      </main>
      
      {/* Optional Footer */}
      {/* <Footer /> */} 
    </div>
  );
}