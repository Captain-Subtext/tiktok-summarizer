import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';  // Note: using named import
import './index.css';  // This is likely setting global styles

// Check for any global style imports

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 