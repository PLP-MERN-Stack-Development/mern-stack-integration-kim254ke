// client/src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

// Temporary placeholder pages
function CreatePost() {
  return <div className="container py-10">Create Post (coming soon)</div>;
}

function PostView() {
  return <div className="container py-10">Single Post (coming soon)</div>;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/post/:id" element={<PostView />} />
      </Routes>
    </>
  );
}
