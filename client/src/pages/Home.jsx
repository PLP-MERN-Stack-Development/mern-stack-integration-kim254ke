import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { postService, categoryService } from '../services/api.js';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const POSTS_PER_PAGE = 6;

  // Load all posts with filters
  const loadPosts = useCallback(async (categorySlug, search, page) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        category: categorySlug === 'All' ? '' : categorySlug,
        search: search,
        page: page,
        limit: POSTS_PER_PAGE
      };

      const response = await postService.getAllPosts(params);
      
      // Handle different response formats
      if (response.data) {
        setPosts(response.data);
        setTotalPages(response.pagination?.pages || 1);
      } else if (Array.isArray(response)) {
        setPosts(response);
        setTotalPages(1);
      } else {
        setPosts([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Failed to load posts:", err);
      setError(err.message || 'Failed to load posts.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        const categoriesData = data.data || data;
        setCategories([{ name: 'All', slug: 'All' }, ...categoriesData]);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    loadCategories();
  }, []);

  // Load posts whenever filters change
  useEffect(() => {
    loadPosts(activeCategory, searchTerm, currentPage);
  }, [activeCategory, searchTerm, currentPage, loadPosts]);

  const handleCategoryClick = (slug) => {
    setActiveCategory(slug);
    setCurrentPage(1); // Reset to first page
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Helper to construct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://placehold.co/800x450/e9ecef/212529?text=Featured+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  if (error) {
    return (
      <div className="text-center py-10 text-red-600 font-medium">
        Error loading data: {error}
      </div>
    );
  }

  // Category Filter Buttons
  const CategoryFilters = () => (
    <div className="flex flex-wrap gap-2 mb-6 items-center">
      {categories.length === 0 ? (
        <p className="text-sm text-gray-500">No categories loaded.</p>
      ) : (
        categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => handleCategoryClick(cat.slug)}
            className={`
              px-4 py-2 rounded-full font-semibold transition duration-150 shadow-sm
              ${
                activeCategory === cat.slug
                  ? 'bg-indigo-600 text-white shadow-indigo-400'
                  : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200'
              }
            `}
          >
            {cat.name}
          </button>
        ))
      )}
    </div>
  );

  // Search Bar
  const SearchBar = () => (
    <div className="mb-8">
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search posts by title or content..."
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
        />
      </div>
    </div>
  );

  // Pagination Controls
  const Pagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={20} />
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-4 py-2 rounded-lg border transition duration-150 ${
              currentPage === page
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Latest Posts</h2>

      <SearchBar />
      <CategoryFilters />

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading posts...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <Link
                  key={post._id}
                  to={`/post/${post._id}`}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-200 overflow-hidden block"
                >
                  <img
                    src={getImageUrl(post.featuredImage)}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/800x450/e9ecef/212529?text=Featured+Image';
                    }}
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-indigo-600 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.content ? post.content.substring(0, 120) + '...' : ''}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="italic">
                        {post.category?.name || 'Uncategorized'}
                      </span>
                      <span>
                        By {post.author?.username || 'Anonymous'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-500 text-lg">
                  {searchTerm || activeCategory !== 'All'
                    ? 'No posts found matching your criteria.'
                    : 'No posts available yet.'}
                </p>
              </div>
            )}
          </div>

          <Pagination />
        </>
      )}
    </div>
  );
};

export default Home;