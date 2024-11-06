import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/header';
import LoginPage from './pages/login';
import SurveyForm from './pages/test';
import VerificationPage from './pages/verificationpage';
import HomePage from './pages/homepage';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return checkTokenValidity();
    } catch {
      return false;
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  // Function to check token validity
  const checkTokenValidity = () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const sessionData = JSON.parse(localStorage.getItem('sessionData') || '{}');
      
      if (!authToken || !sessionData.timestamp) {
        handleLogout();
        return false;
      }

      // Check if token has expired (7 days)
      const tokenTimestamp = new Date(sessionData.timestamp);
      const expirationTime = new Date(tokenTimestamp);
      expirationTime.setHours(expirationTime.getHours() + 24 * 7); // 7 days

      if (new Date() >= expirationTime) {
        handleLogout();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking token validity:', error);
      handleLogout();
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('sessionData');
    localStorage.removeItem('userData');
    // Don't remove rememberedUser as it's used for the "Remember Me" feature
    setIsLoggedIn(false);
  };

  const checkAuth = () => {
    const isValid = checkTokenValidity();
    setIsLoggedIn(isValid);
    return isValid;
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        checkAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Set up periodic token check (every minute)
    const tokenCheckInterval = setInterval(() => {
      checkAuth();
    }, 60000); // Check every minute

    const handleStorageChange = (e) => {
      if (e.key === 'authToken' || e.key === 'sessionData') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(tokenCheckInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
      </div>
    </div>
  );

  const ProtectedRoute = ({ children }) => {
    // Check token validity on each protected route access
    if (!checkTokenValidity()) {
      return <Navigate to="/login" replace />;
    }

    if (isLoading) {
      return <LoadingSpinner />;
    }

    return children;
  };

  const NotFound = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-6 py-8 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">404</h2>
        <p className="text-xl font-semibold text-gray-800 mb-4">Page Not Found</p>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <button
          onClick={() => window.location.href = isLoggedIn ? '/home' : '/login'}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {isLoggedIn && <Header setIsLoggedIn={setIsLoggedIn} />}

        <Routes>
          {/* Login Route */}
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/home" replace />
              ) : (
                <LoginPage setIsLoggedIn={setIsLoggedIn} />
              )
            }
          />

          {/* Protected Routes */}
          <Route
            path="/filters"
            element={
              <ProtectedRoute>
                <SurveyForm />
              </ProtectedRoute>
            }
          />

          {/* New Verification Route */}
          <Route
            path="/verify/:id"
            element={
              <ProtectedRoute>
                <VerificationPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          {/* Root Route */}
          <Route
            path="/"
            element={
              <Navigate to={isLoggedIn ? "/home" : "/login"} replace />
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Global Loading Indicator */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
            </div>
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;