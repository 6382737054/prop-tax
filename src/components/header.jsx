import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, UserCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  // Check login status on mount and whenever localStorage changes
  useEffect(() => {
    const checkLoginStatus = () => {
      const authToken = localStorage.getItem('authToken');
      const storedUserData = localStorage.getItem('userData');
      
      if (authToken && storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData);
          setIsLoggedIn(true);
          setUserData(parsedUserData);
        } catch (error) {
          console.error('Error parsing user data:', error);
          handleLogout();
        }
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    };

    checkLoginStatus();

    // Listen for storage changes (in case of logout in another tab)
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Clock update effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleStorageChange = () => {
    // Refresh the page after any storage change
    window.location.reload();
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleHomeClick = () => {
    navigate('/home');
  };

  const handleSurveyClick = () => {
    navigate('/filters');
  };

  const handleLogout = () => {
    // Clear all auth-related items from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('rememberedUser');
    localStorage.removeItem('lastLoginTime');
    
    // Navigate to login page
    navigate('/login');
  };

  const handleProfileClick = () => {
    setUserDropdownOpen(false);
    navigate('/profile');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownOpen && !event.target.closest('.user-dropdown')) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdownOpen]);

  return (
    <header className="relative z-50">
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Left Section: Logo and Title */}
          <div className="flex items-center space-x-6">
            <img 
              src="/images/tnlogo.png"
              alt="TN Government Logo" 
              className="h-14 w-14 object-contain cursor-pointer transition-transform hover:scale-105"
              onClick={handleHomeClick}
            />
            <div className="text-white border-l-2 border-white/20 pl-6">
              <h1 className="text-2xl font-bold tracking-wide">Government of Tamil Nadu</h1>
              <p className="text-sm text-white/90 mt-1">e-Governance Portal</p>
            </div>
          </div>

          {/* Right Section: Navigation, Login/Profile, and Time */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-8">
              <button 
                onClick={handleHomeClick}
                className="text-white hover:text-blue-200 font-medium transition-colors"
              >
                Home
              </button>
              <button 
                onClick={handleSurveyClick}
                className="text-white hover:text-blue-200 font-medium transition-colors"
              >
                Survey
              </button>

              {!isLoggedIn ? (
                <button 
                  onClick={handleLoginClick}
                  className="text-white hover:text-blue-200 font-medium transition-colors"
                >
                  Login
                </button>
              ) : (
                <div className="relative user-dropdown">
                  <button 
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 text-white hover:text-blue-200 font-medium"
                  >
                    <UserCircle className="h-5 w-5" />
                    <span>{userData?.name || 'User'}</span>
                    <ChevronDown 
                      className={`h-4 w-4 transform transition-transform duration-200 ${
                        userDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden">
                      <button 
                        onClick={handleProfileClick}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                      >
                        <UserCircle className="h-4 w-4 mr-2" />
                        Profile
                      </button>
                      <button 
                        onClick={() => {
                          handleLogout();
                          navigate('/login');
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </nav>

            <div className="flex items-center space-x-6 pl-8 border-l border-white/20">
              <div className="text-white/90 text-sm font-medium">
                {formatTime(currentTime)}
              </div>
              <div className="text-white/90 text-sm font-medium">
                {currentTime.toLocaleDateString('en-US', { 
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white hover:text-blue-200 transition-colors focus:outline-none"
              aria-label="Menu"
            >
              <Menu className="h-7 w-7" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div 
        className={`md:hidden fixed inset-0 bg-gray-800/50 backdrop-blur-sm transition-opacity duration-300 z-50 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div 
          className={`absolute right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={e => e.stopPropagation()}
        >
          {/* Mobile Menu Header */}
          <div className="bg-blue-900 text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img 
                src="/images/tnlogo.png"
                alt="Logo" 
                className="h-8 w-8"
              />
              <span className="font-semibold">TN e-Governance</span>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 hover:bg-blue-800 rounded-full transition-colors focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Time and Date Section */}
          <div className="bg-gray-50 p-4 border-b">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div className="font-medium">{formatTime(currentTime)}</div>
              <div className="font-medium">
                {currentTime.toLocaleDateString('en-US', { 
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-2">
            <button 
              onClick={() => {
                handleHomeClick();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <span className="font-medium">Home</span>
            </button>
            
            <button 
              onClick={() => {
                handleSurveyClick();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <span className="font-medium">Survey</span>
            </button>

            {!isLoggedIn ? (
              <button 
                onClick={() => {
                  handleLoginClick();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <UserCircle className="h-5 w-5 mr-3 text-gray-500" />
                <span className="font-medium">Login</span>
              </button>
            ) : (
              <div className="border-t border-gray-200 my-4 pt-4">
                <div className="px-4 text-sm text-gray-500 mb-2">
                  Logged in as {userData?.name || 'User'}
                </div>
                <button 
                  onClick={() => {
                    navigate('/profile');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <UserCircle className="h-5 w-5 mr-3 text-gray-500" />
                  <span className="font-medium">Profile</span>
                </button>
                
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t text-center">
            <div className="text-sm text-gray-500">
              Government of Tamil Nadu
            </div>
            <div className="text-xs text-gray-400">
              e-Governance Portal
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;