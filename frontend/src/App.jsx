// src/App.jsx - ENHANCED VERSION
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ThankYouPage from './pages/ThankYouPage';
import DashboardPage from './pages/DashboardPage';
import VillageAnimation from './components/VillageAnimation/VillageAnimation';

// Import styles
import './styles/themes.css';
import './styles/animations.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <VillageAnimation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/merci" element={<ThankYouPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;