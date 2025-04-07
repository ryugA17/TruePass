import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext'; // ⬅️ Import your context

console.log('React app initializing, localStorage visited:', localStorage.getItem('visited'));

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AuthProvider> {/* ⬅️ Wrap App with AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
