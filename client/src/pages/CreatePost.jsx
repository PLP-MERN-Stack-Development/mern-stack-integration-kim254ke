import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { postService, categoryService } from '../services/api';
import useApi from '../hooks/useApi';

export default function CreatePost(){
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { data: categories } = useApi(() => categoryService.getAllCategories(), []);

  const onSubmit = async (vals) => {
    try {
      const payload = { title: vals.title, content: vals.content, category: vals.category || null };
      const res = await postService.createPost(payload);
      navigate(`/post/${res._id}`);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Create Post</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register('title')} placeholder="Title" className="w-full p-2 border rounded" required />
        <select {...register('category')} className="w-full p-2 border rounded">
          <option value="">No category</option>
          {categories?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <textarea {...register('content')} placeholder="Content" rows={8} className="w-full p-2 border rounded" required />
        <button className="px-4 py-2 bg-green-600 text-white rounded">Create</button>
      </form>
    </div>
  );
}
