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
        background: 'white',
        padding: '20px'
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            backgroundColor: 'white',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
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
                mb: 2,
                width: 60,
                height: 60,
                background: 'linear-gradient(135deg, #f06, #9f6)'
              }}
            >
              <PersonIcon fontSize="large" />
            </Avatar>
            
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
              Welcome Back
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
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
                icon={<PersonIcon />} 
                label="User" 
                sx={{ 
                  borderRadius: '8px 0 0 8px',
                  bgcolor: userType === 0 ? 'white' : '#f5f8fa',
                  border: '1px solid #e0e0e0',
                  '&.Mui-selected': {
                    color: 'text.primary',
                    fontWeight: 'bold'
                  }
                }}
              />
              <Tab 
                icon={<HomeIcon />} 
                label="Host" 
                sx={{ 
                  borderRadius: '0 8px 8px 0',
                  bgcolor: userType === 1 ? 'white' : '#f5f8fa',
                  border: '1px solid #e0e0e0',
                  borderLeft: 'none',
                  '&.Mui-selected': {
                    color: 'text.primary',
                    fontWeight: 'bold'
                  }
                }}
              />
            </Tabs>

            {error && (
              <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                    Email
                  </Typography>
                  <Box 
                    sx={{ 
                      py: 1,
                      borderBottom: '2px solid #f0f0f0',
                      transition: 'all 0.3s ease',
                      '&:focus-within': {
                        borderBottomColor: '#f06'
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
                    />
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                      Password
                    </Typography>
                    <Link 
                      href="#" 
                      underline="none"
                      sx={{ 
                        color: '#f06', 
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
                      py: 1,
                      borderBottom: '2px solid #f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.3s ease',
                      '&:focus-within': {
                        borderBottomColor: '#f06'
                      }
                    }}
                  >
                    <InputBase
                      fullWidth
                      placeholder="Enter your password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      autoComplete="current-password"
                    />
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={isLoading}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      mt: 1,
                      background: 'linear-gradient(90deg, #ff0066 0%, #73e600 100%)',
                      border: 'none',
                      boxShadow: 'none',
                      fontWeight: 'bold',
                      textTransform: 'none',
                      fontSize: '1rem',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #e0005a 0%, #66cc00 100%)',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      }
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      `Sign in as ${userType === 0 ? 'User' : 'Host'}`
                    )}
                  </Button>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }}>
                    <Typography variant="body2" color="text.secondary">OR</Typography>
                  </Divider>
                  
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    sx={{
                      borderRadius: 2,
                      py: 1.2,
                      borderColor: '#ddd',
                      color: '#757575',
                      '&:hover': {
                        borderColor: '#ccc',
                        backgroundColor: '#f5f5f5',
                      }
                    }}
                  >
                    Continue with Google
                  </Button>
                </Grid>

                <Grid item xs={12} textAlign="center">
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Don't have an account?{' '}
                      <Link
                        component={RouterLink}
                        to="/signup"
                        sx={{
                          color: '#f06',
                          textDecoration: 'none',
                          fontWeight: 'bold',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                      >
                        Sign up as {userType === 0 ? 'User' : 'Host'}
                      </Link>
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
