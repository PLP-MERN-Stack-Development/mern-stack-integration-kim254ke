import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import PostView from './pages/PostView';
import EditPost from './pages/EditPost';

// -----------------------------------------------------------------------------
// Simple 404 Page
// -----------------------------------------------------------------------------
const SimpleNotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50 text-center p-8">
    <div className="bg-white p-10 rounded-xl shadow-2xl">
      <h1 className="text-6xl font-extrabold text-red-600 mb-4">404</h1>
      <p className="text-2xl text-gray-800 mb-6">Page Not Found</p>
      <p className="text-gray-600 mb-8">
        The URL you requested does not exist.
      </p>
      <a href="/" className="text-lg font-medium text-blue-600 hover:text-blue-700 underline transition duration-150">
        Go to Homepage
      </a>
    </div>
  </div>
);

// -----------------------------------------------------------------------------
// Main Component: App
// -----------------------------------------------------------------------------
export default function App() {
  return (
    <Routes>
      {/* Layout wraps all routes for consistent Header/Footer */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/post/:id" element={<PostView />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="*" element={<SimpleNotFound />} />
      </Route>
    </Routes>
  );
}