import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, UserCircle, Lock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../apiConfig/api';

const LoginPage = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Enhanced session validation without clearing storage
  const validateSession = () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const sessionData = JSON.parse(localStorage.getItem('sessionData') || '{}');
      const userDataString = localStorage.getItem('userData');

      if (!authToken || !userDataString || !sessionData.timestamp) {
        return false;
      }

      const userData = JSON.parse(userDataString);
      if (!userData?.data?.authToken || userData.data.authToken !== authToken) {
        return false;
      }

      const expirationTime = new Date(sessionData.timestamp);
      expirationTime.setHours(expirationTime.getHours() + 24 * 7); // 7 days

      return new Date() < expirationTime;
    } catch {
      return false;
    }
  };

  // Check for existing session on mount without clearing storage
  useEffect(() => {
    const checkSession = () => {
      try {
        if (validateSession()) {
          setIsLoggedIn(true);
          navigate('/home', { replace: true });
        } else {
          // Don't clear storage, just update state
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setIsLoggedIn(false);
      }
    };

    checkSession();
    // Listen for storage changes
    window.addEventListener('storage', checkSession);
    return () => window.removeEventListener('storage', checkSession);
  }, [setIsLoggedIn, navigate]);

  // Load remembered credentials if they exist
  useEffect(() => {
    const storedUser = localStorage.getItem('rememberedUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setFormData(userData);
        setRememberMe(true);
      } catch (error) {
        console.error('Error loading remembered user:', error);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await api.post('api/v1/login', {
        username: formData.username,
        password: formData.password
      });

      if (response.data) {
        // Create session with current timestamp
        const sessionData = {
          token: response.data.authToken,
          timestamp: new Date().toISOString(),
          expiresIn: '7d',
          lastActivity: new Date().toISOString()
        };

        // Store auth data
        localStorage.setItem('userData', JSON.stringify(response.data));
        localStorage.setItem('sessionData', JSON.stringify(sessionData));
        localStorage.setItem('authToken', response.data.authToken);

        // Handle remember me
        if (rememberMe) {
          localStorage.setItem('rememberedUser', JSON.stringify({
            username: formData.username,
            password: formData.password
          }));
        }

        // Update global state and navigate
        setIsLoggedIn(true);
        navigate('/home', { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Invalid username or password');
      // Don't clear localStorage on login error
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo and Header */}
        <div className="text-center">
          <img
            src="/images/tnlogo.png"
            alt="TN Government Logo"
            className="mx-auto h-20 w-20"
          />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Government of Tamil Nadu
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Official Portal Login
          </p>
        </div>

        {/* Login Form */}
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserCircle className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;