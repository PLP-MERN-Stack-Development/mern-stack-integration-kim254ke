import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { postService } from '../services/api';
import useApi from '../hooks/useApi';

export default function PostView(){
  const { id } = useParams();
  const [post, setPost] = useState(null);
  useEffect(() => {
    (async () => {
      const p = await postService.getPost(id);
      setPost(p);
    })();
  }, [id]);

  if (!post) return <div>Loading...</div>;
  return (
    <div>
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="text-sm text-gray-600">Category: {post.category?.name || '—'} • {new Date(post.createdAt).toLocaleDateString()}</p>
      <div className="mt-4">{post.content}</div>
    </div>
  );
}
