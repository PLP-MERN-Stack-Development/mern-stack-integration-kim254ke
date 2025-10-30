import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { postService, categoryService } from '../services/api';
import useApi from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';

// Helper: generate slug
const generateSlug = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-');

export default function CreatePost() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();

  const { data: categories, loading: categoriesLoading, refetch: refetchCategories } =
    useApi(() => categoryService.getAllCategories(), []);

  const [apiError, setApiError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  // Handle category creation
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setCategoryError('Category name is required');
      return;
    }

    setIsCreatingCategory(true);
    setCategoryError(null);

    try {
      const categoryData = {
        name: newCategoryName.trim(),
        slug: generateSlug(newCategoryName),
      };

      const result = await categoryService.createCategory(categoryData, token);
      await refetchCategories();

      setValue('category', result.data._id);
      setNewCategoryName('');
      setShowNewCategoryInput(false);
    } catch (err) {
      console.error('Category creation failed:', err);
      setCategoryError(err.message || 'Failed to create category');
    } finally {
      setIsCreatingCategory(false);
    }
  };

  // Submit post
  const onSubmit = async (vals) => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      if (!token) {
        setApiError('Authentication required. Please log in again.');
        navigate('/login');
        return;
      }

      const formData = new FormData();
      formData.append('title', vals.title);
      formData.append('slug', generateSlug(vals.title));
      formData.append('content', vals.content);
      formData.append('category', vals.category);

      if (vals.featuredImage?.[0]) {
        formData.append('featuredImage', vals.featuredImage[0]);
      }

      // ✅ No need to send user._id — backend infers it from token
      const res = await postService.createPost(formData, token);
      navigate(`/post/${res._id}`);
    } catch (err) {
      console.error('Post creation failed:', err);
      setApiError(err.message || 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-xl my-8">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-3">Write a New Blog Post</h2>

      {apiError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg" role="alert">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            {...register('title', { required: 'Title is required' })}
            id="title"
            type="text"
            placeholder="A compelling headline..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>

          <div className="flex gap-2">
            <select
              {...register('category', { required: 'Category is required' })}
              id="category"
              className="flex-1 p-3 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
              disabled={categoriesLoading || showNewCategoryInput}
            >
              <option value="">-- Select a category --</option>
              {categories?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setShowNewCategoryInput(!showNewCategoryInput)}
              className="px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition duration-300"
              disabled={isCreatingCategory}
            >
              {showNewCategoryInput ? 'Cancel' : '+ New'}
            </button>
          </div>

          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}

          {/* Inline new category */}
          {showNewCategoryInput && (
            <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <label htmlFor="newCategory" className="block text-sm font-medium text-gray-700 mb-2">
                New Category Name
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="newCategory"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g., Technology, Travel..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  disabled={isCreatingCategory}
                />
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={isCreatingCategory}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
                >
                  {isCreatingCategory ? 'Creating...' : 'Create'}
                </button>
              </div>
              {categoryError && <p className="mt-2 text-sm text-red-600">{categoryError}</p>}
            </div>
          )}
        </div>

        {/* Featured Image */}
        <div>
          <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-1">
            Featured Image (Optional)
          </label>
          <input
            {...register('featuredImage')}
            id="featuredImage"
            type="file"
            accept="image/*"
            className="w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 
                       file:rounded-full file:border-0 file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('content', { required: 'Content is required' })}
            id="content"
            placeholder="Start writing your amazing blog post here..."
            rows={12}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg 
                     hover:bg-blue-700 transition duration-300 shadow-md disabled:bg-gray-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}
