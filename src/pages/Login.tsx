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
  Divider,
} from '@mui/material';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import GoogleIcon from '@mui/icons-material/Google';
import TicketIcon from '@mui/icons-material/ConfirmationNumber';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
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
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

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
        flexDirection: 'column',
        background: 'linear-gradient(135deg, rgba(10, 10, 27, 0.8) 0%, rgba(20, 20, 43, 0.9) 100%)',
        position: 'relative',
        overflow: 'hidden',
        pb: 4,
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -150,
          right: -150,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,99,255,0.15) 0%, rgba(108,99,255,0) 70%)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -100,
          left: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(45,212,191,0.1) 0%, rgba(45,212,191,0) 70%)',
          zIndex: 0,
        }}
      />

      {/* Back to home button */}
      <Box sx={{ p: 2, zIndex: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{
            color: 'white',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          Back to Home
        </Button>
      </Box>

      <Container maxWidth="sm" sx={{ flex: 1, display: 'flex', alignItems: 'center', zIndex: 1 }}>
        <Paper
          elevation={5}
          sx={{
            width: '100%',
            borderRadius: 4,
            overflow: 'hidden',
            backgroundColor: 'rgba(28, 28, 56, 0.7)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            transform: 'translateY(0)',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 4,
            }}
          >
            <Avatar
              sx={{
                mb: 3,
                width: 70,
                height: 70,
                background: 'linear-gradient(135deg, #6C63FF 0%, #2DD4BF 100%)',
                boxShadow: '0 8px 20px rgba(108, 99, 255, 0.3)',
                transform: 'rotate(-5deg)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'rotate(0deg) scale(1.05)',
                },
              }}
            >
              <TicketIcon fontSize="large" sx={{ color: 'white' }} />
            </Avatar>

            <Typography
              variant="h4"
              sx={{
                mb: 1,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textFillColor: 'transparent',
              }}
            >
              Welcome Back
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: 'text.secondary',
                textAlign: 'center',
              }}
            >
              Sign in to access your {userType === 0 ? 'tickets' : 'event management'}
            </Typography>

            <Tabs
              value={userType}
              onChange={handleUserTypeChange}
              variant="fullWidth"
              sx={{
                width: '100%',
                mb: 4,
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '3px',
                  background: 'linear-gradient(to right, #6C63FF, #2DD4BF)',
                },
              }}
            >
              <Tab
                icon={<PersonIcon />}
                label="User"
                sx={{
                  color: userType === 0 ? 'primary.main' : 'text.secondary',
                  opacity: userType === 0 ? 1 : 0.7,
                  transition: 'all 0.3s ease',
                  '&.Mui-selected': {
                    color: 'primary.main',
                    fontWeight: 600,
                  },
                  '&:hover': {
                    color: 'primary.light',
                    opacity: 1,
                  },
                }}
              />
              <Tab
                icon={<HomeIcon />}
                label="Host"
                sx={{
                  color: userType === 1 ? 'primary.main' : 'text.secondary',
                  opacity: userType === 1 ? 1 : 0.7,
                  transition: 'all 0.3s ease',
                  '&.Mui-selected': {
                    color: 'primary.main',
                    fontWeight: 600,
                  },
                  '&:hover': {
                    color: 'primary.light',
                    opacity: 1,
                  },
                }}
              />
            </Tabs>

            {error && (
              <Alert
                severity="error"
                sx={{
                  width: '100%',
                  mb: 3,
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 77, 98, 0.1)',
                  borderLeft: '4px solid',
                  borderColor: 'error.main',
                  '& .MuiAlert-icon': {
                    color: 'error.main',
                  },
                }}
              >
                {error}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <TextField
                name="email"
                label="Email Address"
                variant="outlined"
                fullWidth
                required
                value={formData.email}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.light',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: '2px',
                    },
                  },
                }}
              />

              <TextField
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                required
                value={formData.password}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        sx={{ color: 'text.secondary' }}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.light',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: '2px',
                    },
                  },
                }}
              />

              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  variant="body2"
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #6C63FF, #4B44CC)',
                  boxShadow: '0 8px 16px rgba(108, 99, 255, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7E77FF, #5955D9)',
                    boxShadow: '0 10px 20px rgba(108, 99, 255, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>

              <Box sx={{ position: 'relative', my: 2 }}>
                <Divider
                  sx={{ '&::before, &::after': { borderColor: 'rgba(255, 255, 255, 0.1)' } }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      px: 2,
                      color: 'text.secondary',
                      backgroundColor: 'background.paper',
                      borderRadius: '4px',
                    }}
                  >
                    or continue with
                  </Typography>
                </Divider>
              </Box>

              <Button
                variant="outlined"
                fullWidth
                onClick={handleGoogleLogin}
                disabled={isLoading}
                startIcon={<GoogleIcon />}
                sx={{
                  py: 1.5,
                  borderRadius: '12px',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  borderWidth: '1px',
                  color: 'text.primary',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Sign in with Google
              </Button>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Don't have an account?{' '}
                  <Link
                    component={RouterLink}
                    to="/signup"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 600,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Sign Up
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
