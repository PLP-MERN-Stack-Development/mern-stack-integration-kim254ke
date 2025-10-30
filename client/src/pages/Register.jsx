import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api'; 

const Register = () => {
    // ✅ FIX 1: Changed state initialization from 'name' to 'username'
    const [formData, setFormData] = useState({ username: '', email: '', password: '' }); 
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { login: contextLogin, isAuthenticated } = useAuth(); // Renamed login to contextLogin for clarity

    useEffect(() => {
        // Redirect if already logged in
        if (isAuthenticated) navigate('/');
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
      
        try {
          // Send payload with correct keys
          const response = await authService.registerUser({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          });
      
          // ✅ Your backend returns: { success, data: { user, token } }
          const { user, token } = response.data; 
      
          if (!user || !token) {
            throw new Error("Invalid user data received from server.");
          }
      
          // Log the user in using AuthContext
          contextLogin(user, token);
      
          navigate('/');
        } catch (err) {
          console.error("Registration failed:", err);
          setError(
            err.response?.data?.message || 
            err.message || 
            'Registration failed. Please try again.'
          );
        } finally {
          setIsSubmitting(false);
        }
      };
      
    

    return (
        <div className="w-full max-w-md mx-auto mt-10 p-8 bg-white shadow-xl rounded-xl">
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Register</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="username" // ✅ FIX 3: Changed name attribute to 'username'
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-md px-3 py-2"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-md px-3 py-2"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-md px-3 py-2"
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                >
                    {isSubmitting ? 'Registering...' : 'Register'}
                </button>
            </form>

            <p className="text-center mt-4 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:underline">
                    Log in
                </Link>
            </p>
        </div>
    );
};

export default Register;