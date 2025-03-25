import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useNFTs } from '../context/NFTContext';
import { useAuth } from '../context/AuthContext';

const CreateNFT = () => {
  const { addNFT } = useNFTs();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null as File | null,
  });
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real application, you would upload the image to a storage service
      // Here we're just creating a data URL to represent the image
      const imageUrl = previewUrl || 'https://via.placeholder.com/400x400/3f51b5/ffffff';
      
      // Add the NFT to the context
      addNFT({
        title: formData.name,
        description: formData.description,
        price: `${formData.price} ETH`,
        image: imageUrl,
        creator: user?.email || 'anonymous',
        isVerified: true
      });
      
      // Show success notification
      setNotification({
        open: true,
        message: 'NFT created successfully!',
        severity: 'success'
      });
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        image: null
      });
      setPreviewUrl(null);
      
      // Redirect to marketplace after a short delay
      setTimeout(() => {
        navigate('/marketplace');
      }, 2000);
    } catch (error) {
      console.error('Error creating NFT:', error);
      setNotification({
        open: true,
        message: 'Failed to create NFT. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white' }}>
        Create New NFT
      </Typography>
      <Paper sx={{ p: 4, borderRadius: 2, background: 'rgba(22, 28, 36, 0.8)', backdropFilter: 'blur(10px)' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="NFT Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)'
                  },
                  '& .MuiInputBase-input': {
                    color: 'white'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={4}
                required
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)'
                  },
                  '& .MuiInputBase-input': {
                    color: 'white'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Price (ETH)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
                InputProps={{
                  sx: { borderRadius: 2 },
                  endAdornment: <InputAdornment position="end" sx={{ color: 'white' }}>ETH</InputAdornment>,
                  inputProps: { min: 0, step: 0.001 }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)'
                  },
                  '& .MuiInputBase-input': {
                    color: 'white'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ 
                  mb: 2, 
                  p: 2, 
                  borderRadius: 2,
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                  }
                }}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              {formData.image && (
                <Typography variant="body2" color="text.secondary" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Selected file: {formData.image.name}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {previewUrl && (
                <Box sx={{ mt: 1, borderRadius: 2, overflow: 'hidden', height: '120px' }}>
                  <img 
                    src={previewUrl} 
                    alt="NFT Preview" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }} 
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ 
                  borderRadius: 2, 
                  p: 1.5,
                  background: 'linear-gradient(45deg, #6a1b9a 30%, #4527a0 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #7b1fa2 30%, #512da8 90%)',
                  }
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Create NFT'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateNFT; 