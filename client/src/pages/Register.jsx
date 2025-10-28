// /src/pages/Register.jsx (New Component)

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
// The import path must match the new location of your context file
import { useAuth } from '../context/AuthContext'; 

export default function Register() { // <--- REQUIRED: Default Export
  const { register, handleSubmit } = useForm();
  const nav = useNavigate();
  // Renaming 'register' from useAuth to avoid conflict with react-hook-form's 'register'
  const { register: authRegister } = useAuth(); 
  const [error, setError] = useState(null);

  const onSubmit = async (vals) => {
    setError(null);
    try {
      // Call the registration logic from your AuthContext
      await authRegister(vals.username, vals.email, vals.password);
      nav('/');
    } catch (err) {
      // The structure of the error object may vary based on your API
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Register Account</h2>
      {error && <p className="text-red-500 mb-3 p-2 border border-red-300 rounded">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input {...register('username')} type="text" placeholder="Username" className="w-full p-2 border rounded" required />
        <input {...register('email')} type="email" placeholder="Email" className="w-full p-2 border rounded" required />
        <input {...register('password')} type="password" placeholder="Password" className="w-full p-2 border rounded" required />
        <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Register</button>
      </form>
    </div>
  );
}