import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { postService, categoryService } from '../services/api';
import useApi from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';

// Helper function to generate URL-friendly slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-');
};

export default function EditPost() {
  const { id } = useParams();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const navigate = useNavigate();
  const { token, isAuthenticated, user } = useAuth();
  const { data: categories, loading: categoriesLoading } = useApi(() => categoryService.getAllCategories(), []);
  
  const [apiError, setApiError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(null);

  // Load existing post data
  useEffect(() => {
    const loadPost = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      try {
        const postData = await postService.getPostById(id, token);
        const post = postData.data || postData;

        // Check if user is the author
        if (post.author._id !== user._id) {
          setApiError('You are not authorized to edit this post');
          setTimeout(() => navigate('/'), 2000);
          return;
        }

        // Set form values
        setValue('title', post.title);
        setValue('content', post.content);
        setValue('category', post.category?._id || '');
        setCurrentImage(post.featuredImage);
        
      } catch (err) {
        console.error('Failed to load post:', err);
        setApiError(err.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id, token, isAuthenticated, user, navigate, setValue]);

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
      
      // Only append image if a new one is selected
      if (vals.featuredImage?.[0]) {
        formData.append('featuredImage', vals.featuredImage[0]);
      }

      const res = await postService.updatePost(id, formData, token);
      navigate(`/post/${id}`);
    } catch (err) { 
      console.error("Post update failed:", err);
      setApiError(err.message || 'Failed to update post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-700">Loading post...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-xl my-8">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-3">Edit Blog Post</h2>
      
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
          
          <select 
            {...register('category', { required: 'Category is required' })} 
            id="category"
            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
            disabled={categoriesLoading}
          >
            <option value="">-- Select a category --</option>
            {categories?.map(c => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
        </div>

        {/* Current Image Preview */}
        {currentImage && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Featured Image</label>
            <img 
              src={currentImage.startsWith('http') ? currentImage : `http://localhost:5000${currentImage}`}
              alt="Current featured" 
              className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-300"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* New Image Upload */}
        <div>
          <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-1">
            {currentImage ? 'Change Featured Image (Optional)' : 'Featured Image (Optional)'}
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
          <p className="mt-1 text-xs text-gray-500">Leave empty to keep the current image</p>
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
        
        {/* Buttons */}
        <div className="flex gap-4">
          <button 
            type="submit" 
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg 
                       hover:bg-blue-700 transition duration-300 shadow-md disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Post'}
          </button>
          
          <button 
            type="button"
            onClick={() => navigate(`/post/${id}`)}
            className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg 
                       hover:bg-gray-300 transition duration-300"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}