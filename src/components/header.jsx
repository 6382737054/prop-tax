import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Phone, Shield } from 'lucide-react';

const Header = ({ onLoginClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const governmentInfo = {
    name: 'Government of Tamil Nadu',
    department: 'Department of e-Governance',
    portal: 'Digital Services Portal'
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <header className="relative z-50">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10">
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-white/90 text-sm font-medium">
                <Phone size={14} className="mr-1.5" />
                <span>Toll Free: 1800-425-1234</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-white/90 text-sm font-medium">
                {formatTime(currentTime)}
              </div>
              <div className="hidden sm:block text-white/90 text-sm font-medium border-l border-white/20 pl-6">
                {currentTime.toLocaleDateString('en-US', { 
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className={`bg-white transition-all duration-300 ${
        isScrolled ? 'shadow-lg' : 'shadow-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Left side - Logo and Government Info */}
            <div className="flex items-center">
              <div className="relative">
                <img 
                  src="/images/tnlogo.png"
                  alt="TN Government Logo" 
                  className="h-16 w-16 md:h-20 md:w-20 object-contain transform transition-transform hover:scale-105"
                />
              </div>
              
              {/* Government Info - Desktop */}
              <div className="hidden md:flex flex-col ml-8 border-l-2 border-gray-200 pl-8">
                <div className="flex items-center space-x-2">
                  <Shield size={20} className="text-blue-800" />
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                    {governmentInfo.name}
                  </h1>
                </div>
                <h2 className="text-lg lg:text-xl font-semibold text-blue-800 mt-1.5 tracking-tight">
                  {governmentInfo.department}
                </h2>
                <p className="text-base text-gray-600 font-medium tracking-tight">
                  {governmentInfo.portal}
                </p>
              </div>
            </div>

            {/* Mobile Title */}
            <div className="md:hidden flex flex-col items-center flex-1 mx-4">
              <h1 className="text-lg font-bold text-gray-900 text-center">
                Government of Tamil Nadu
              </h1>
              <p className="text-sm text-blue-800 font-semibold text-center">
                e-Governance
              </p>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <div className="relative group">
                <button className="flex items-center space-x-1.5 text-gray-700 hover:text-blue-800 font-medium group-hover:text-blue-800 transition-colors">
                  <span>Services</span>
                  <ChevronDown size={16} className="transform group-hover:rotate-180 transition-transform duration-300" />
                </button>
                <div className="absolute top-full -left-2 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="py-2">
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800">Public Services</button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800">Business Services</button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800">Information Services</button>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <button className="flex items-center space-x-1.5 text-gray-700 hover:text-blue-800 font-medium group-hover:text-blue-800 transition-colors">
                  <span>Departments</span>
                  <ChevronDown size={16} className="transform group-hover:rotate-180 transition-transform duration-300" />
                </button>
              </div>
              <button className="text-gray-700 hover:text-blue-800 font-medium transition-colors">Contact</button>
              <div className="h-6 w-px bg-gray-200"></div>
              <button 
                onClick={onLoginClick}
                className="relative group bg-gradient-to-r from-blue-800 to-blue-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`md:hidden fixed inset-0 bg-gray-800/50 backdrop-blur-sm transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div 
          className={`absolute right-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6 space-y-4">
            <button className="w-full text-left px-4 py-3 text-gray-700 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors font-medium">
              Services
            </button>
            <button className="w-full text-left px-4 py-3 text-gray-700 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors font-medium">
              Departments
            </button>
            <button className="w-full text-left px-4 py-3 text-gray-700 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors font-medium">
              Contact
            </button>
            <div className="pt-4 border-t border-gray-200">
              <button 
                onClick={onLoginClick}
                className="w-full bg-blue-800 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;