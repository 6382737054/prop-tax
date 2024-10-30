import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/header';
import LoginPage from './pages/login';
import SurveyForm from './pages/test';
import HomePage from './pages/homepage';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {isLoggedIn && <Header />}
        <Routes>
          <Route
            path="/login"
            element={<LoginPage setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/filters"
            element={isLoggedIn ? <SurveyForm/> : <Navigate to="/login" />}
          />
          <Route
            path="/home"
            element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />}
          />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;