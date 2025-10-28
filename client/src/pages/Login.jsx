import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- NEW IMPORT

export default function Login(){
  const { register, handleSubmit } = useForm();
  const nav = useNavigate();
  const { login } = useAuth(); // <-- USE AUTH HOOK
  const [error, setError] = useState(null);

  const onSubmit = async (vals) => {
    setError(null);
    try {
      await login(vals.email, vals.password);
      // Navigate to the home page or a desired protected route
      nav('/');
    } catch (err) {
      // Display error message from the API response
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500 mb-3 p-2 border border-red-300 rounded">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input {...register('email')} type="email" placeholder="Email" className="w-full p-2 border rounded" required />
        <input {...register('password')} type="password" placeholder="Password" className="w-full p-2 border rounded" required />
        <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Login</button>
      </form>
    </div>
  );
}