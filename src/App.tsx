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
import Signup from './pages/Signup';
import LandingPage from './pages/LandingPage/LandingPage';
import HostPage from './pages/HostPage';
import TOTPManagement from './pages/TOTPManagement';
import BlockchainTOTPManagement from './pages/BlockchainTOTPManagement';
import TestPage from './pages/TestPage';
import { SearchProvider } from './context/SearchContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { NFTProvider } from './context/NFTContext';
import AuthRoute from './components/AuthRoute';
import HostRedirect from './components/HostRedirect';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NFTProvider>
          <Router>
            <Routes>
              {/* Landing page route - no navbar */}
              <Route path="/welcome" element={<LandingPage />} />

              {/* Login route - no navbar */}
              <Route path="/login" element={<Login />} />

              {/* Signup route - no navbar */}
              <Route path="/signup" element={<Signup />} />

              {/* Routes with Navbar */}
              <Route
                path="/"
                element={
                  <SearchProvider>
                    <CartProvider>
                      <Box
                        sx={{
                          minHeight: '100vh',
                          background: 'linear-gradient(135deg, #040615 0%, #040615 100%)',
                        }}
                      >
                        <Navbar />
                        <Box sx={{ pt: '64px' }}>
                          <HostRedirect>
                            <Home />
                          </HostRedirect>
                        </Box>
                      </Box>
                    </CartProvider>
                  </SearchProvider>
                }
              />

              <Route
                path="/marketplace"
                element={
                  <SearchProvider>
                    <CartProvider>
                      <Box
                        sx={{
                          minHeight: '100vh',
                          background: 'linear-gradient(135deg, #1a237e 0%, #000000 100%)',
                        }}
                      >
                        <Navbar />
                        <Box sx={{ pt: '64px' }}>
                          <Marketplace />
                        </Box>
                      </Box>
                    </CartProvider>
                  </SearchProvider>
                }
              />

              <Route
                path="/create-nft"
                element={
                  <SearchProvider>
                    <CartProvider>
                      <Box
                        sx={{
                          minHeight: '100vh',
                          background: 'linear-gradient(135deg, #1a237e 0%, #000000 100%)',
                        }}
                      >
                        <Navbar />
                        <Box sx={{ pt: '64px' }}>
                          <AuthRoute>
                            <CreateNFT />
                          </AuthRoute>
                        </Box>
                      </Box>
                    </CartProvider>
                  </SearchProvider>
                }
              />

              <Route
                path="/profile"
                element={
                  <SearchProvider>
                    <CartProvider>
                      <Box
                        sx={{
                          minHeight: '100vh',
                          background: 'linear-gradient(135deg, #1a237e 0%, #000000 100%)',
                        }}
                      >
                        <Navbar />
                        <Box sx={{ pt: '64px' }}>
                          <AuthRoute>
                            <Profile />
                          </AuthRoute>
                        </Box>
                      </Box>
                    </CartProvider>
                  </SearchProvider>
                }
              />

              <Route
                path="/cart"
                element={
                  <SearchProvider>
                    <CartProvider>
                      <Box
                        sx={{
                          minHeight: '100vh',
                          background: 'linear-gradient(135deg, #1a237e 0%, #000000 100%)',
                        }}
                      >
                        <Navbar />
                        <Box sx={{ pt: '64px' }}>
                          <Cart />
                        </Box>
                      </Box>
                    </CartProvider>
                  </SearchProvider>
                }
              />

              <Route
                path="/host"
                element={
                  <SearchProvider>
                    <CartProvider>
                      <Box
                        sx={{
                          minHeight: '100vh',
                          background: 'linear-gradient(135deg, #1a237e 0%, #000000 100%)',
                        }}
                      >
                        <Navbar />
                        <Box sx={{ pt: '64px' }}>
                          <AuthRoute hostOnly={true}>
                            <HostPage />
                          </AuthRoute>
                        </Box>
                      </Box>
                    </CartProvider>
                  </SearchProvider>
                }
              />

              <Route
                path="/verify-tickets"
                element={
                  <SearchProvider>
                    <CartProvider>
                      <Box
                        sx={{
                          minHeight: '100vh',
                          background: 'linear-gradient(135deg, #1a237e 0%, #000000 100%)',
                        }}
                      >
                        <Navbar />
                        <Box sx={{ pt: '64px' }}>
                          <AuthRoute>
                            <TOTPManagement />
                          </AuthRoute>
                        </Box>
                      </Box>
                    </CartProvider>
                  </SearchProvider>
                }
              />

              <Route
                path="/blockchain-tickets"
                element={
                  <SearchProvider>
                    <CartProvider>
                      <Box
                        sx={{
                          minHeight: '100vh',
                          background: 'linear-gradient(135deg, #1a237e 0%, #000000 100%)',
                        }}
                      >
                        <Navbar />
                        <Box sx={{ pt: '64px' }}>
                          <AuthRoute>
                            <BlockchainTOTPManagement />
                          </AuthRoute>
                        </Box>
                      </Box>
                    </CartProvider>
                  </SearchProvider>
                }
              />

              <Route
                path="/test"
                element={
                  <Box
                    sx={{
                      minHeight: '100vh',
                      background: 'linear-gradient(135deg, #1a237e 0%, #000000 100%)',
                    }}
                  >
                    <Navbar />
                    <Box sx={{ pt: '64px' }}>
                      <TestPage />
                    </Box>
                  </Box>
                }
              />

              {/* Redirect all other routes to the home page */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </NFTProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
