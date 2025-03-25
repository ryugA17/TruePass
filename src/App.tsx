import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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