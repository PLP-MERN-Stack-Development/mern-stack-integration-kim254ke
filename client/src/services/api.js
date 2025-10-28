import axios from 'axios';

// Set up the base URL for the API
const API_URL = 'http://localhost:5000/api';

// Create a re-usable axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle data extraction
const responseInterceptor = (response) => {
    // Standardize data retrieval for successful responses
    // NOTE: We assume the server returns { success: true, data: X }
    return response.data.data;
};

// --- AUTH SERVICE ---
export const authService = {
  // Registers a new user
  register: async (username, email, password) => {
    const res = await api.post('/auth/register', { username, email, password });
    return res.data; // Return the full response for token storage
  },

  // Logs in a user
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data; // Return the full response for token storage
  },
};


// --- CATEGORY SERVICE ---
export const categoryService = {
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return responseInterceptor(response);
  },
};

// --- POST SERVICE ---
export const postService = {
  getAllPosts: async (page = 1, limit = 10, categoryId = null, search = '') => {
    // Construct query parameters
    const params = new URLSearchParams({ page, limit, search });
    if (categoryId) {
      params.append('category', categoryId);
    }
    const response = await api.get(`/posts?${params.toString()}`);
    // The getAllPosts endpoint returns an object with { posts: [], totalPages: 1 }, 
    // so we return the whole data object, not just response.data.data
    return response.data; 
  },
  getPost: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return responseInterceptor(response);
  },
  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return responseInterceptor(response);
  },
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    // Override content-type for image upload
    const response = await api.post('/posts/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return responseInterceptor(response);
  }
};


// --- COMMENT SERVICE (CORRECTED) ---
export const commentService = {
  /**
   * @desc Fetches all comments for a given post ID.
   * @route GET /api/posts/:postId/comments
   */
  getComments: async (postId) => {
    // Corrected to use RESTful path: /posts/:postId/comments
    const response = await api.get(`/posts/${postId}/comments`);
    return responseInterceptor(response);
  },

  /**
   * @desc Submits a new comment (requires authentication via interceptor)
   * @route POST /api/posts/:postId/comments
   */
  createComment: async (postId, text, author) => {
    // Corrected to use RESTful path and 'text' payload field
    const response = await api.post(`/posts/${postId}/comments`, { text, author });
    return responseInterceptor(response);
  },
};
