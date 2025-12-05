// src/main.jsx (if using Vite) OR src/index.js (if using Create React App)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/themes.css'; // Make sure this is imported

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);