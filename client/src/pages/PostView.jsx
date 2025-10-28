import React from 'react';
import { useParams } from 'react-router-dom';
import { postService } from '../services/api';
import useApi from '../hooks/useApi';

export default function PostView() {
  const { id } = useParams();

  // Fetch the single post data using the custom hook
  const { data: post, loading, error } = useApi(() => postService.getPost(id), [id]);
  
  // Function to determine the image source, falling back to the placeholder
  const getImageSrc = (p) => {
    // Check if featuredImage is a local path (/uploads/...) or a full URL
    if (p.featuredImage && p.featuredImage.startsWith('http')) {
        return p.featuredImage;
    }
    // Assume local uploads path, or use a default placeholder
    return p.featuredImage || 'https://placehold.co/1200x600/e9ecef/212529?text=Featured+Image';
  }

  if (loading) return <div className="text-center py-10 text-xl text-gray-600">Loading post details...</div>;
  if (error) return <div className="text-center py-10 text-xl text-red-600">Error: Could not load post.</div>;
  if (!post) return <div className="text-center py-10 text-xl text-gray-600">Post not found.</div>;
  
  // Destructure post for cleaner usage
  const { title, content, category, author, createdAt } = post;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      {/* 1. Featured Image Section */}
      <div className="mb-8 rounded-xl overflow-hidden shadow-xl">
        <img
          src={getImageSrc(post)}
          alt={title}
          className="w-full max-h-96 object-cover object-center"
        />
      </div>

      <article className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
        
        {/* 2. Category Tag */}
        {category?.name && (
          <span className="inline-block bg-blue-500 text-white text-sm font-semibold px-4 py-1 rounded-full mb-4 uppercase tracking-wider">
            {category.name}
          </span>
        )}

        {/* 3. Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          {title}
        </h1>

        {/* 4. Metadata */}
        <div className="flex items-center space-x-4 text-gray-500 mb-8 border-b pb-4">
          <p className="text-lg">
            By <span className="font-medium text-gray-700">{author?.username || 'Admin'}</span>
          </p>
          <span className="text-xl font-light">|</span>
          <p className="text-lg">
            Published on {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* 5. Post Content */}
        {/* NOTE: You might need a library like `DOMPurify` or use dangerouslySetInnerHTML 
           if the content contains rich HTML. For raw text, this is fine. */}
        <div className="prose max-w-none text-lg leading-relaxed text-gray-800">
          <p>{content}</p>
        </div>
      </article>

    </div>
  );
}