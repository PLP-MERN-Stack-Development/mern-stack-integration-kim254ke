// client/src/pages/Home.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { postService, categoryService } from "../services/api";
import useApi from "../hooks/useApi";
import AnimatedCard from "../components/AnimatedCard";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { data: categories } = useApi(() => categoryService.getAllCategories(), []);
  const { data, loading, error } = useApi(
    () => postService.getAllPosts(page, 6, selectedCategory, search),
    [page, selectedCategory, search]
  );

  const posts = data?.posts || [];
  const totalPages = data?.pages || 1;

  const getImageSrc = (post) => {
    if (post.featuredImage && post.featuredImage.startsWith("http")) return post.featuredImage;
    return post.featuredImage || "https://placehold.co/800x450/e9ecef/212529?text=Featured+Image";
  };

  const featured = posts.slice(0, 2);
  const regular = posts.slice(2);

  return (
    <main className="min-h-screen py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 text-gray-900 dark:text-gray-100">Latest Blog Posts</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Curated posts from your MERN blog — search and filter to explore.</p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8 items-center justify-center">
          <input
            className="w-full sm:w-2/3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <select
            className="w-full sm:w-1/3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm"
            value={selectedCategory || ""}
            onChange={(e) => { setSelectedCategory(e.target.value || null); setPage(1); }}
          >
            <option value="">All Categories</option>
            {categories?.map((c) => <option value={c._id} key={c._id}>{c.name}</option>)}
          </select>
        </div>

        {/* Featured */}
        {featured.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {featured.map((p, idx) => (
              <AnimatedCard key={p._id} i={idx} className="overflow-hidden h-64 relative">
                <Link to={`/post/${p._id}`}>
                  <img src={getImageSrc(p)} alt={p.title} className="w-full h-64 object-cover transform hover:scale-105 transition-transform" />
                  <div className="p-5">
                    <span className="inline-block bg-blue-600 text-white text-xs px-3 py-1 rounded-full mb-2">{p.category?.name || "General"}</span>
                    <h2 className="text-2xl font-bold mt-2 text-gray-900 dark:text-gray-100">{p.title}</h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-3">{p.content?.slice(0, 120)}...</p>
                  </div>
                </Link>
              </AnimatedCard>
            ))}
          </div>
        )}

        {/* Loading / Error */}
        {error && (
  <div className="text-center py-10 text-red-500">
    {error.message || "Something went wrong while fetching data."}
  </div>
)}

{!loading && posts.length === 0 && (
  <div className="text-center py-10 text-gray-600 dark:text-gray-400">
    No posts found.
  </div>
)}

        {/* Grid */}
        <AnimatePresence>
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regular.map((p, idx) => (
              <motion.div
                key={p._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
                className="card bg-white dark:bg-gray-800 overflow-hidden"
              >
                <Link to={`/post/${p._id}`}>
                  <img src={getImageSrc(p)} alt={p.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform" />
                </Link>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-blue-600 font-semibold">{p.category?.name || "General"}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-gray-100">
                    <Link to={`/post/${p._id}`}>{p.title}</Link>
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-3">{p.content?.slice(0, 140)}...</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">By {p.author?.username || "Admin"}</span>
                    <Link to={`/post/${p._id}`} className="text-sm text-blue-600 font-semibold">Read →</Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`btn ${page === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white shadow"}`}
            >
              Previous
            </button>
            <div className="text-sm text-gray-700 dark:text-gray-300">Page {page} of {totalPages}</div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`btn ${page === totalPages ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white shadow"}`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
