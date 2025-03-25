import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  Button,
  Divider,
  IconButton,
  Paper,
  TextField,
  Alert,
  Snackbar,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Sample cart items (in a real app, this would come from context/state management)
const initialCartItems = [
  {
    id: 1,
    title: 'Abstract Thought of Art',
    creator: 'ZafGod.eth',
    price: '0.00069',
    image: 'https://via.placeholder.com/400x400/1a237e/ffffff',
    quantity: 1,
  },
  {
    id: 2,
    title: 'Harvested Opulence',
    creator: 'Fame Identity',
    price: '0.005',
    image: 'https://via.placeholder.com/400x400/4a148c/ffffff',
    quantity: 1,
  },
];

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleRemoveItem = (id: number) => {
    removeFromCart(id);
  };
  
  const handleUpdateQuantity = (id: number, change: number) => {
    updateQuantity(id, change);
  };
  
  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'nft10') {
      setPromoApplied(true);
    }
  };
  
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + parseFloat(item.price) * item.quantity;
    }, 0);
  };
  
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return promoApplied ? subtotal * 0.9 : subtotal;
  };

  const handleCheckout = () => {
    setShowSuccess(true);
    // In a real app, this would process the payment
    setTimeout(() => {
      clearCart();
      setPromoApplied(false);
      setPromoCode('');
    }, 2000);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 12, pb: 8 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        Your Cart
      </Typography>
      
      {cartItems.length === 0 ? (
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 8, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Your cart is empty
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/marketplace')}
            sx={{ 
              bgcolor: '#3f51b5',
              '&:hover': { bgcolor: '#303f9f' }
            }}
          >
            Browse Marketplace
          </Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={0} 
              sx={{ 
                bgcolor: 'rgba(22, 28, 36, 0.95)',
                borderRadius: 2,
                p: 3,
                mb: 3
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                NFT Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
              </Typography>
              <Divider sx={{ mb: 2, opacity: 0.2 }} />
              
              {cartItems.map((item) => (
                <Box key={item.id}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3} sm={2}>
                      <Card 
                        sx={{ 
                          borderRadius: 2,
                          aspectRatio: '1/1',
                          overflow: 'hidden'
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={item.image}
                          alt={item.title}
                          sx={{ height: '100%', width: '100%' }}
                        />
                      </Card>
                    </Grid>
                    <Grid item xs={5} sm={6}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        By {item.creator}
                      </Typography>
                    </Grid>
                    <Grid item xs={2} sm={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton 
                          size="small"
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          sx={{ color: 'white' }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                        <IconButton 
                          size="small"
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                          sx={{ color: 'white' }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>
                    <Grid item xs={2} sm={2} sx={{ textAlign: 'right' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {(parseFloat(item.price) * item.quantity).toFixed(6)} ETH
                      </Typography>
                      <IconButton 
                        onClick={() => handleRemoveItem(item.id)}
                        size="small"
                        sx={{ color: '#f44336' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 2, opacity: 0.2 }} />
                </Box>
              ))}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={0} 
              sx={{ 
                bgcolor: 'rgba(22, 28, 36, 0.95)',
                borderRadius: 2,
                p: 3,
                position: 'sticky',
                top: 100
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Order Summary
              </Typography>
              <Divider sx={{ mb: 2, opacity: 0.2 }} />
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Subtotal</Typography>
                  <Typography variant="body1">{calculateSubtotal().toFixed(6)} ETH</Typography>
                </Box>
                
                {promoApplied && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" color="success.main">Discount (10%)</Typography>
                    <Typography variant="body1" color="success.main">
                      -{(calculateSubtotal() * 0.1).toFixed(6)} ETH
                    </Typography>
                  </Box>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">{calculateTotal().toFixed(6)} ETH</Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>Promo Code</Typography>
                <Stack direction="row" spacing={1}>
                  <TextField 
                    size="small"
                    fullWidth
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    disabled={promoApplied}
                    variant="outlined"
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                        },
                      },
                    }}
                  />
                  <Button 
                    variant="outlined"
                    onClick={handleApplyPromo}
                    disabled={promoApplied || !promoCode}
                  >
                    Apply
                  </Button>
                </Stack>
                {promoApplied && (
                  <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                    Promo code applied successfully!
                  </Typography>
                )}
              </Box>
              
              <Button 
                variant="contained" 
                fullWidth
                size="large"
                onClick={handleCheckout}
                sx={{ 
                  bgcolor: '#3f51b5',
                  '&:hover': { bgcolor: '#303f9f' },
                  py: 1.5
                }}
              >
                Checkout
              </Button>
              
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
                By completing this purchase, you agree to our Terms of Service
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      <Snackbar 
        open={showSuccess} 
        autoHideDuration={3000} 
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">
          Order placed successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Cart; 