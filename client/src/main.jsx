// client/src/main.jsx (Example)

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext'; // <-- NEW IMPORT

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* <-- WRAP APP WITH PROVIDER */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);