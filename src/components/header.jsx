import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, UserCircle, LogOut, Home, ClipboardList } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkLoginStatus = () => {
      const authToken = localStorage.getItem('authToken');
      const storedUserData = localStorage.getItem('userData');
      
      if (authToken && storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData);
          setUserData(parsedUserData);
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      } else {
        setUserData(null);
      }
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownOpen && !event.target.closest('.user-dropdown')) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdownOpen]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const handleHomeClick = () => {
    navigate('/home');
    setIsMenuOpen(false);
  };

  const handleSurveyClick = () => {
    navigate('/filters');
    setIsMenuOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setUserDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('rememberedUser');
    localStorage.removeItem('sessionData');
    localStorage.removeItem('lastLoginTime');
    setIsLoggedIn(false);
    setUserDropdownOpen(false);
    setIsMenuOpen(false);
    navigate('/login', { replace: true });
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="relative z-50">
      <div className="bg-gradient-to-r from-[#75d1e3] via-[#67c3d5] to-[#75d1e3] py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Left Section: Logo and Title */}
          <div className="flex items-center space-x-6">
            <img 
              src="/images/tnlogo.png"
              alt="TN Government Logo" 
              className="h-14 w-14 object-contain cursor-pointer transition-transform hover:scale-105"
              onClick={handleHomeClick}
            />
            <div className="text-black border-l-2 border-black/20 pl-6">
              <h1 className="text-2xl font-bold tracking-wide">Government of Tamil Nadu</h1>
              <p className="text-sm text-black/90 mt-1">e-Governance Portal</p>
            </div>
          </div>

          {/* Right Section: Navigation, Profile, and Time */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-8">
              <button 
                onClick={handleHomeClick}
                className={`flex items-center space-x-2 text-black transition-colors ${
                  isActive('/home') 
                    ? 'border-b-2 border-black font-semibold' 
                    : 'hover:text-black/80'
                }`}
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">Home</span>
              </button>

              <button 
                onClick={handleSurveyClick}
                className={`flex items-center space-x-2 text-black transition-colors ${
                  isActive('/filters') 
                    ? 'border-b-2 border-black font-semibold' 
                    : 'hover:text-black/80'
                }`}
              >
                <ClipboardList className="h-5 w-5" />
                <span className="font-medium">Survey</span>
              </button>

              <div className="relative user-dropdown">
                <button 
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 text-black hover:text-black/80 font-medium"
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
                      className="flex items-center w-full px-4 py-3 text-sm text-black hover:bg-[#75d1e3]/10 transition-colors"
                    >
                      <UserCircle className="h-4 w-4 mr-2 text-black" />
                      Profile
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </nav>

            <div className="flex items-center space-x-6 pl-8 border-l border-black/20">
              <div className="text-black text-sm font-medium">
                {formatTime(currentTime)}
              </div>
              <div className="text-black text-sm font-medium">
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
              className="p-2 text-black hover:text-black/80 transition-colors focus:outline-none"
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
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
          <div className="bg-[#75d1e3] text-black p-4 flex justify-between items-center">
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
              className="p-2 hover:bg-[#67c3d5] rounded-full transition-colors focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Time and Date Section */}
          <div className="bg-gray-50 p-4 border-b">
            <div className="flex justify-between items-center text-sm text-black">
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
              onClick={handleHomeClick}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive('/home') 
                  ? 'bg-[#75d1e3]/10 text-black font-semibold border-l-4 border-[#75d1e3]' 
                  : 'text-black hover:bg-[#75d1e3]/10'
              }`}
            >
              <Home className="h-5 w-5 mr-3" />
              <span className="font-medium">Home</span>
            </button>
            
            <button 
              onClick={handleSurveyClick}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive('/filters') 
                  ? 'bg-[#75d1e3]/10 text-black font-semibold border-l-4 border-[#75d1e3]' 
                  : 'text-black hover:bg-[#75d1e3]/10'
              }`}
            >
              <ClipboardList className="h-5 w-5 mr-3" />
              <span className="font-medium">Survey</span>
            </button>

            <div className="border-t border-gray-200 my-4 pt-4">
              <div className="px-4 text-sm text-black mb-2">
                Logged in as {userData?.name || 'User'}
              </div>
              <button 
                onClick={handleProfileClick}
                className="w-full flex items-center px-4 py-3 text-black hover:bg-[#75d1e3]/10 rounded-lg transition-colors"
              >
                <UserCircle className="h-5 w-5 mr-3 text-black" />
                <span className="font-medium">Profile</span>
              </button>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2"
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t text-center">
            <div className="text-sm text-black">
              Government of Tamil Nadu
            </div>
            <div className="text-xs text-black/70">
              e-Governance Portal
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;