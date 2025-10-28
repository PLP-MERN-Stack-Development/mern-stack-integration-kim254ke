// client/src/App.jsx (Example Router Configuration)

import { Routes, Route } from 'react-router-dom';
// ... other component imports
import Home from './pages/Home';
import PostView from './pages/PostView';
import CreatePost from './pages/CreatePost';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './pages/ProtectedRoute'; // <-- NEW IMPORT

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/post/:id" element={<PostView />} />
      
      {/* 🔒 PROTECTED ROUTE */}
      <Route 
        path="/create-post" 
        element={
          <ProtectedRoute>
            <CreatePost /> {/* This component is now protected */}
          </ProtectedRoute>
        } 
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Add 404 handler here */}
      <Route path="*" element={<div>404 Not Found</div>} /> 
    </Routes>
  );
}

export default App;