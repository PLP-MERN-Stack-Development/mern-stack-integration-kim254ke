// client/src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Adjust for production if needed

// ----------------------------------------------------------------------
// 📹 POST SERVICE
// ----------------------------------------------------------------------
export const postService = {
  async getAllPosts(params = {}) {
    // params can include: { category, search, page, limit }
    const response = await axios.get(`${API_URL}/posts`, {
      params: {
        category: params.category || '',
        search: params.search || '',
        page: params.page || 1,
        limit: params.limit || 10,
      },
    });
    return response.data; // Return full response including pagination
  },

  async getPostById(id, token = null) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(`${API_URL}/posts/${id}`, { headers });
    return response.data;
  },

  async createPost(formData, token) {
    const response = await axios.post(`${API_URL}/posts`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async updatePost(id, formData, token) {
    const response = await axios.put(`${API_URL}/posts/${id}`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async deletePost(id, token) {
    const response = await axios.delete(`${API_URL}/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

// ----------------------------------------------------------------------
// 📹 CATEGORY SERVICE
// ----------------------------------------------------------------------
export const categoryService = {
  async getAllCategories() {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  },

  // ✅ Fixed to accept categoryData object with name and slug
  async createCategory(categoryData, token) {
    const response = await axios.post(
      `${API_URL}/categories`,
      categoryData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  async updateCategory(id, categoryData, token) {
    const response = await axios.put(
      `${API_URL}/categories/${id}`,
      categoryData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  async deleteCategory(id, token) {
    const response = await axios.delete(`${API_URL}/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

// ----------------------------------------------------------------------
// 📹 AUTH SERVICE (Fixed to match backend routes)
// ----------------------------------------------------------------------
export const authService = {
  async registerUser(userData) {
    // ✅ Corrected path — "auth" not "users"
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  },

  async loginUser(credentials) {
    // ✅ Corrected path — "auth" not "users"
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  },

  async getProfile(token) {
    const response = await axios.get(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};


// ----------------------------------------------------------------------
// 📹 COMMENT SERVICE
// ----------------------------------------------------------------------
export const commentService = {
  async getCommentsByPostId(postId) {
    const response = await axios.get(`${API_URL}/comments/${postId}`);
    return response.data;
  },

  // ✅ Added alias for backwards compatibility
  async createComment(postId, commentData, token) {
    const response = await axios.post(
      `${API_URL}/comments/${postId}`,
      commentData,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    return response.data;
  },

  // ✅ Alias - both names work now
  async addComment(postId, commentData, token) {
    return this.createComment(postId, commentData, token);
  },

  async updateComment(id, content, token) {
    const response = await axios.put(
      `${API_URL}/comments/${id}`,
      { content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  async deleteComment(id, token) {
    const response = await axios.delete(`${API_URL}/comments/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};