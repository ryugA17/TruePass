import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Check if we've been redirected from the landing page
const fromLandingPage = localStorage.getItem('visited') === 'true';

// If we've been redirected, initialize the app
if (fromLandingPage || window.location.pathname !== '/') {
  console.log('Initializing React app - visited:', fromLandingPage);
  
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  reportWebVitals();
} else {
  // If we're on the root path and haven't been redirected, go to landing page
  console.log('Redirecting to landing page...');
  window.location.href = '/landing-page/index.html';
} 