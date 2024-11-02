import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/header';
import LoginPage from './pages/login';
import SurveyForm from './pages/test';
import HomePage from './pages/homepage';
import './App.css';

function App() {
  // Initialize auth state with proper validation
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      const authToken = localStorage.getItem('authToken');
      const sessionData = JSON.parse(localStorage.getItem('sessionData') || '{}');
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');

      if (authToken && userData?.data?.authToken && sessionData?.token) {
        const expirationTime = new Date(sessionData.timestamp);
        expirationTime.setHours(expirationTime.getHours() + 24 * 7); // 7 days
        return new Date() < expirationTime;
      }
      return false;
    } catch {
      return false;
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth check and set up listeners
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Call checkAuth on each page load
        await checkAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Set up periodic auth check
    const authCheckInterval = setInterval(checkAuth, 3600000); // Check every hour

    // Cleanup
    return () => {
      clearInterval(authCheckInterval);
    };
  }, []);

  // Comprehensive auth check function
  const checkAuth = () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const sessionData = JSON.parse(localStorage.getItem('sessionData') || '{}');
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');

      if (authToken && userData?.data?.authToken && sessionData?.token) {
        const expirationTime = new Date(sessionData.timestamp);
        expirationTime.setHours(expirationTime.getHours() + 24 * 7); // 7 days

        if (new Date() < expirationTime) {
          setIsLoggedIn(true);
          return true;
        } else {
          setIsLoggedIn(false);
          return false;
        }
      } else {
        setIsLoggedIn(false);
        return false;
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setIsLoggedIn(false);
      return false;
    }
  };

  // Loading Component
  const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
      </div>
    </div>
  );

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  // 404 Component
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

  // Show loading spinner while initializing
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