import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Always initialize the app when loading index.tsx directly
// This is needed because if we are referred from the landing page,
// we want to render the React app immediately
console.log('React app initializing, localStorage visited:', localStorage.getItem('visited'));

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals(); 