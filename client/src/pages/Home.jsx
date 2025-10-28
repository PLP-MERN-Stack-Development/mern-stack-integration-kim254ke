import React, { useState } from 'react';
import { postService, categoryService } from '../services/api';
import { Link } from 'react-router-dom';
import useApi from '../hooks/useApi';

export default function Home(){
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data: categories } = useApi(() => categoryService.getAllCategories(), []);
  const { data, loading } = useApi(() => postService.getAllPosts(page, 6, null, search), [page, search]);

  const posts = data?.posts || [];

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search posts..." className="border p-2 rounded w-full" />
      </div>

      {loading ? <div>Loading...</div> : posts.map(p => (
        <article key={p._id} className="mb-6 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold"><Link to={`/post/${p._id}`}>{p.title}</Link></h2>
          <p className="text-sm text-gray-600">By {p.author?.username} • {new Date(p.createdAt).toLocaleDateString()}</p>
          <p className="mt-2">{p.content?.slice(0,200)}...</p>
        </article>
      ))}

      <div className="flex justify-between items-center mt-6">
        <button onClick={()=> setPage(p=> Math.max(1,p-1))} className="px-3 py-1 border rounded">Prev</button>
        <div>Page {data?.page || 1} of {data?.pages || 1}</div>
        <button onClick={()=> setPage(p=> p+1)} className="px-3 py-1 border rounded">Next</button>
      </div>
    </div>
  );
}
