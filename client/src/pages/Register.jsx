import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- NEW IMPORT

export default function Register(){
  const { register, handleSubmit } = useForm();
  const nav = useNavigate();
  const { register: authRegister } = useAuth(); // <-- Rename to avoid conflict
  const [error, setError] = useState(null);

  const onSubmit = async (vals) => {
    setError(null);
    try {
      await authRegister(vals.username, vals.email, vals.password);
      // Navigate to the home page after successful registration/login
      nav('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {error && <p className="text-red-500 mb-3 p-2 border border-red-300 rounded">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input {...register('username')} placeholder="Username" className="w-full p-2 border rounded" required />
        <input {...register('email')} type="email" placeholder="Email" className="w-full p-2 border rounded" required />
        <input {...register('password')} type="password" placeholder="Password" className="w-full p-2 border rounded" required />
        <button type="submit" className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">Sign up</button>
      </form>
    </div>
  );
}