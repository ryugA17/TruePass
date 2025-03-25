import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import CreateNFT from './pages/CreateNFT';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import { SearchProvider } from './context/SearchContext';
import { CartProvider } from './context/CartContext';

function App() {
  // Redirect first-time visitors to the landing page
  useEffect(() => {
    // Check if this is a first-time visit
    const visited = localStorage.getItem('visited') === 'true';
    
    // Only redirect if this is the root path and not already visited
    if (!visited && window.location.pathname === '/') {
      console.log('Redirecting to landing page...');
      // Redirect to landing page
      window.location.replace('/landing-page/index.html');
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <SearchProvider>
          <CartProvider>
            <Box sx={{ 
              minHeight: '100vh',
              background: 'linear-gradient(135deg, #1a237e 0%, #000000 100%)',
            }}>
              <Navbar />
              <Box sx={{ pt: '64px' }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/create-nft" element={<CreateNFT />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/cart" element={<Cart />} />
                  
                  {/* Redirect all other routes to the home page */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Box>
            </Box>
          </CartProvider>
        </SearchProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App; 