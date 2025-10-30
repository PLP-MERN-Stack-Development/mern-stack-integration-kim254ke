// client/src/components/AnimatedCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * AnimatedCard Component
 * Displays a single post summary in a card format, with visual differences
 * based on the 'isFeatured' prop.
 * * @param {object} props
 * @param {object} props.post The post data object (e.g., _id, title, content, author, category, featuredImage)
 * @param {boolean} props.isFeatured Flag to determine card styling (large/small)
 * @param {function} props.getImageSrc Utility function to resolve image URL
 */
export default function AnimatedCard({ post, isFeatured, getImageSrc }) {
  const { _id, title, content, author, category, createdAt } = post;
  
  // Dynamic styling based on 'isFeatured'
  const cardClasses = isFeatured 
    ? "h-full flex flex-col md:flex-row bg-white rounded-xl shadow-2xl hover:shadow-xl transition-all duration-300 overflow-hidden" 
    : "h-full flex flex-col bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden";
  
  const imageContainerClasses = isFeatured 
    ? "md:w-1/2 w-full h-64 md:h-full flex-shrink-0" 
    : "h-48 w-full";
  
  const contentContainerClasses = isFeatured 
    ? "md:w-1/2 p-6 flex flex-col justify-between" 
    : "p-6 flex flex-col justify-between flex-grow";

  return (
    <motion.div
      className={cardClasses}
      whileHover={{ y: isFeatured ? -5 : -3 }} // subtle lift on hover
    >
      
      {/* 1. Image */}
      <div className={imageContainerClasses}>
        <Link to={`/post/${_id}`} className="block h-full">
            <img 
                src={getImageSrc(post)} 
                alt={title} 
                className="w-full h-full object-cover" 
                // Fallback for broken images (optional)
                onError={(e) => { e.target.onerror = null; e.target.src="/uploads/placeholder.jpg"; }}
            />
        </Link>
      </div>

      {/* 2. Content Area */}
      <div className={contentContainerClasses}>
        <div>
          {/* Category */}
          {category?.name && (
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              {category.name}
            </span>
          )}
          
          {/* Title */}
          <Link to={`/post/${_id}`} className="block">
            <h3 className={`font-bold text-gray-900 leading-tight ${isFeatured ? 'text-2xl mb-2' : 'text-xl mb-1'}`}>
              {title}
            </h3>
          </Link>
          
          {/* Snippet */}
          <p className={`text-gray-600 ${isFeatured ? 'line-clamp-4' : 'line-clamp-3'} mb-4`}>
            {content?.slice(0, 150)}{content.length > 150 ? '...' : ''}
          </p>
        </div>

        {/* Footer/Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
          <p>By **{author?.username || 'Admin'}**</p>
          <p>{new Date(createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </motion.div>
  );
}
