import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import CreateNFT from './pages/CreateNFT';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Login from './pages/Login';
import { SearchProvider } from './context/SearchContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { NFTProvider } from './context/NFTContext';
import AuthRoute from './components/AuthRoute';


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NFTProvider>
          <Router>
            {/* Route login and register here */}
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
                      <Route path="/create-nft" element={
                        <AuthRoute>
                          <CreateNFT />
                        </AuthRoute>
                      } />
                      <Route path="/profile" element={
                        <AuthRoute>
                          <Profile />
                        </AuthRoute>
                      } />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/login" element={<Login />} />
                      
                      {/* Redirect all other routes to the home page */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Box>
                </Box>
              </CartProvider>
            </SearchProvider>
          </Router>
        </NFTProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 