import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Avatar,
  InputBase,
  Divider
} from '@mui/material';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/create-nft';
  const { login, googleLogin, user, updateUserType } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState(0); // 0 for User, 1 for Host

  // Check if user is already logged in and redirect based on user type
  useEffect(() => {
    if (user) {
      if (user.userType === 'host') {
        navigate('/host');
      } else {
        navigate('/marketplace');
      }
    }
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleUserTypeChange = (event: React.SyntheticEvent, newValue: number) => {
    setUserType(newValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Determine selected user type
      const selectedUserType: 'user' | 'host' = userType === 0 ? 'user' : 'host';
      
      // Login with selected user type
      await login(formData.email, formData.password, selectedUserType);
      
      // Redirect based on selected type
      if (selectedUserType === 'host') {
        navigate('/host');
      } else {
        navigate('/marketplace');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Determine selected user type
      const selectedUserType: 'user' | 'host' = userType === 0 ? 'user' : 'host';
      
      // Login with Google using selected user type
      await googleLogin(selectedUserType);
      
      // Redirect based on selected type
      if (selectedUserType === 'host') {
        navigate('/host');
      } else {
        navigate('/marketplace');
      }
    } catch (err: any) {
      setError(err.message || 'Google login failed');
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
        padding: '20px'
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            backgroundColor: 'rgba(30, 30, 30, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '40px 30px 30px'
            }}
          >
            <Avatar
              sx={{
                mb: 3,
                width: 70,
                height: 70,
                background: 'linear-gradient(135deg, #9c27b0 0%, #6a1b9a 100%)',
                boxShadow: '0 4px 20px rgba(156, 39, 176, 0.4)'
              }}
            >
              <PersonIcon fontSize="large" sx={{ color: 'white' }} />
            </Avatar>
            
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: 'white' }}>
              Welcome Back
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.7)' }}>
              Sign in to your account
            </Typography>

            <Tabs 
              value={userType} 
              onChange={handleUserTypeChange}
              variant="fullWidth"
              sx={{ 
                width: '100%', 
                mb: 3,
                '& .MuiTabs-indicator': {
                  display: 'none'
                }
              }}
            >
              <Tab 
                icon={<PersonIcon sx={{ color: userType === 0 ? '#9c27b0' : 'rgba(255, 255, 255, 0.5)' }} />} 
                label="User" 
                sx={{ 
                  borderRadius: '8px 0 0 8px',
                  bgcolor: userType === 0 ? 'rgba(156, 39, 176, 0.1)' : 'rgba(30, 30, 30, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: userType === 0 ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  '&.Mui-selected': {
                    color: 'white',
                    fontWeight: 'bold'
                  }
                }}
              />
              <Tab 
                icon={<HomeIcon sx={{ color: userType === 1 ? '#9c27b0' : 'rgba(255, 255, 255, 0.5)' }} />} 
                label="Host" 
                sx={{ 
                  borderRadius: '0 8px 8px 0',
                  bgcolor: userType === 1 ? 'rgba(156, 39, 176, 0.1)' : 'rgba(30, 30, 30, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderLeft: 'none',
                  color: userType === 1 ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  '&.Mui-selected': {
                    color: 'white',
                    fontWeight: 'bold'
                  }
                }}
              />
            </Tabs>

            {error && (
              <Alert severity="error" sx={{ mb: 3, width: '100%', bgcolor: 'rgba(211, 47, 47, 0.2)', color: '#f48fb1' }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500, color: 'rgba(255, 255, 255, 0.9)' }}>
                    Email
                  </Typography>
                  <Box 
                    sx={{ 
                      py: 1.5,
                      px: 2,
                      borderRadius: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:focus-within': {
                        borderColor: '#9c27b0',
                        boxShadow: '0 0 0 2px rgba(156, 39, 176, 0.2)'
                      }
                    }}
                  >
                    <InputBase
                      fullWidth
                      placeholder="name@example.com"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      autoComplete="email"
                      sx={{ 
                        color: 'white',
                        '& ::placeholder': { color: 'rgba(255, 255, 255, 0.5)' }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'rgba(255, 255, 255, 0.9)' }}>
                      Password
                    </Typography>
                    <Link 
                      href="#" 
                      underline="none"
                      sx={{ 
                        color: '#bb86fc', 
                        fontSize: '14px',
                        '&:hover': {
                          textDecoration: 'underline'
                        } 
                      }}
                    >
                      Forgot password?
                    </Link>
                  </Box>
                  <Box 
                    sx={{ 
                      py: 1.5,
                      px: 2,
                      borderRadius: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.3s ease',
                      '&:focus-within': {
                        borderColor: '#9c27b0',
                        boxShadow: '0 0 0 2px rgba(156, 39, 176, 0.2)'
                      }
                    }}
                  >
                    <InputBase
                      fullWidth
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      autoComplete="current-password"
                      sx={{ 
                        color: 'white',
                        '& ::placeholder': { color: 'rgba(255, 255, 255, 0.5)' }
                      }}
                    />
                    <IconButton 
                      onClick={togglePasswordVisibility} 
                      edge="end"
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </Box>
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isLoading}
                    sx={{
                      py: 1.5,
                      backgroundColor: '#9c27b0',
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 20px rgba(156, 39, 176, 0.3)',
                      '&:hover': {
                        backgroundColor: '#7b1fa2',
                        boxShadow: '0 6px 24px rgba(156, 39, 176, 0.4)',
                      }
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>

            <Box
              sx={{
                mt: 4,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2
              }}
            >
              <Divider sx={{ flexGrow: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                OR
              </Typography>
              <Divider sx={{ flexGrow: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            </Box>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              disabled={isLoading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)'
                }
              }}
            >
              Continue with Google
            </Button>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'inline' }}>
                Don't have an account?{' '}
              </Typography>
              <Link
                component={RouterLink}
                to="/signup"
                sx={{
                  color: '#bb86fc',
                  fontWeight: 500,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Sign up now
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
