import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (err) => Promise.reject(err));

api.interceptors.response.use((res) => res, (err) => {
  if (err.response?.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  return Promise.reject(err);
});

export const postService = {
  getAllPosts: async (page = 1, limit = 10, category = null, search = '') => {
    let url = `/posts?page=${page}&limit=${limit}`;
    if (category) url += `&category=${category}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    const res = await api.get(url);
    return res.data;
  },
  getPost: async (id) => (await api.get(`/posts/${id}`)).data,
  createPost: async (data) => (await api.post('/posts', data)).data,
  updatePost: async (id, data) => (await api.put(`/posts/${id}`, data)).data,
  deletePost: async (id) => (await api.delete(`/posts/${id}`)).data
};

export const categoryService = {
  getAllCategories: async () => (await api.get('/categories')).data,
  createCategory: async (data) => (await api.post('/categories', data)).data
};

export default api;
