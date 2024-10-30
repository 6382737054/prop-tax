// src/App.js
import React, { useState } from 'react';
import Header from './components/header';
import LoginPage from './pages/login';
import logo from './logo.svg';
import './App.css';
import FiltersPage from './pages/filterspage';

function App() {
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Header */}
      <Header onLoginClick={handleLoginClick} />
      <FiltersPage/>
      
     
    </div>
  );
}

export default App;