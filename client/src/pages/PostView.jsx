import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postService, commentService } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Trash2, Edit } from 'lucide-react';

// -----------------------------------------------------------------------------
// Helper Component: Individual Comment Card
// -----------------------------------------------------------------------------
const CommentCard = ({ comment }) => {
  if (!comment) return null;

  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  const formattedDate = comment.createdAt
    ? new Date(comment.createdAt).toLocaleDateString(undefined, dateOptions)
    : '';

  return (
    <div className="border-b border-gray-100 py-4 last:border-b-0">
      <div className="flex justify-between items-start">
        <p className="text-sm font-semibold text-gray-800">
          {comment?.author?.username || 'Anonymous'}
        </p>
        <span className="text-xs text-gray-500">{formattedDate}</span>
      </div>
      <p className="text-gray-700 mt-1 whitespace-pre-wrap">{comment?.content || ''}</p>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Component: Comment Form
// -----------------------------------------------------------------------------
const CommentForm = ({ postId, onCommentSubmitted }) => {
  const { isAuthenticated, user, token } = useAuth(); // ✅ Get token
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // ✅ Pass token to createComment
      await commentService.addComment(postId, { content: content.trim() }, token);
      setContent('');
      onCommentSubmitted();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to post comment.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 mt-8">
        <p>
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
            Login
          </Link>{' '}
          to join the discussion and post a comment.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Post a Comment</h3>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="4"
          placeholder={`Commenting as ${user?.username || 'Guest'}...`}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 resize-y"
          required
          disabled={isLoading}
        />
        <button
          type="submit"
          className="mt-3 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150 shadow-md disabled:bg-blue-400"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit Comment'}
        </button>
      </form>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Main Component: PostView
// -----------------------------------------------------------------------------
export default function PostView() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user, token } = useAuth(); // ✅ Get token

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const isAuthor = user && post && user._id === post?.author?._id;

  const fetchPostAndComments = useCallback(async () => {
    // ✅ Check if ID exists before fetching
    if (!id) {
      setError('Post ID is missing');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const postData = await postService.getPostById(id, token);
      // ✅ Handle response format
      setPost(postData.data || postData || null);

      // ✅ Only fetch comments if commentService has the method
      if (commentService.getCommentsByPostId) {
        const commentsData = await commentService.getCommentsByPostId(id);
        setComments(Array.isArray(commentsData) ? commentsData : commentsData.data || []);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load post or comments.');
    } finally {
      setIsLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchPostAndComments();
  }, [fetchPostAndComments, refreshTrigger]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      // ✅ Pass token to deletePost
      await postService.deletePost(id, token);
      nav('/');
    } catch (err) {
      setError('Failed to delete post: ' + (err.message || 'Unknown error.'));
    }
  };

  if (isLoading) return <div className="text-center py-20 text-xl font-semibold">Loading Post...</div>;
  if (error) return <div className="text-center py-20 text-xl font-semibold text-red-600">Error: {error}</div>;
  if (!post) return <div className="text-center py-20 text-xl font-semibold">Post Not Found.</div>;

  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const imageUrl = post?.featuredImage
    ? post.featuredImage.startsWith('http')
      ? post.featuredImage
      : `${apiBase}${post.featuredImage}`
    : null;

  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString(undefined, dateOptions)
    : '';

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <article className="bg-white shadow-lg rounded-xl overflow-hidden">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={post.title || 'Post image'}
            className="w-full h-80 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/800x400/eeeeee/333333?text=Image+Not+Found';
            }}
          />
        )}

        <div className="p-8 lg:p-12">
          <header className="mb-8 border-b pb-4">
            <div className="flex justify-between items-center mb-3">
              <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">{post.title}</h1>
              {isAuthor && (
                <div className="flex space-x-3 ml-4">
                  <Link
                    to={`/edit/${post?._id}`}
                    className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition duration-150"
                    title="Edit Post"
                  >
                    <Edit size={20} />
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition duration-150"
                    title="Delete Post"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              )}
            </div>

            <p className="text-sm text-gray-600">
              By <span className="font-medium text-gray-800">{post?.author?.username || 'Unknown Author'}</span>{' '}
              on <time dateTime={post.createdAt}>{formattedDate}</time>
              {post?.category?.name && (
                <>
                  {' '}in{' '}
                  <span className="font-medium text-blue-600">{post.category.name}</span>
                </>
              )}
            </p>
          </header>

          <section className="prose prose-lg max-w-none text-gray-700 leading-relaxed break-words">
            <p>{post.content}</p>
          </section>
        </div>
      </article>

      <div className="mt-10 p-8 bg-gray-50 shadow-inner rounded-xl">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
          Comments ({comments?.length || 0})
        </h2>

        <CommentForm postId={id} onCommentSubmitted={() => setRefreshTrigger((p) => p + 1)} />

        <div className="mt-8">
          {comments?.length > 0 ? (
            comments.map((comment) => (
              <CommentCard key={comment?._id || comment?.id} comment={comment} />
            ))
          ) : (
            <p className="text-gray-500 italic mt-6">Be the first to leave a comment!</p>
          )}
        </div>
      </div>
    </div>
  );
}