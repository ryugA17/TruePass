import React, { useState } from 'react';
import { ethers } from 'ethers';
import { saveTicketToFirestore } from "../Utils/saveTicketToFirestore";
import { auth } from "../components/layout/firebase";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/contract';
import { PaymentService } from '../services/PaymentService';
import { BlockchainTOTPService, TOTPSecret } from '../services/BlockchainTOTPService';
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
  InputAdornment,
  FormHelperText
} from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { useNavigate } from 'react-router-dom';
import { useNFTs } from '../context/NFTContext';
import { useAuth } from '../context/AuthContext';

const CreateNFT = () => {
  const { addNFT } = useNFTs();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    seatNumber: '',
    price: '',
    image: null as File | null,
  });

  const [paymentId, setPaymentId] = useState<string | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
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
      if (!window.ethereum) throw new Error('MetaMask is not installed.');

      if (!user) {
        throw new Error('You must be logged in to create events');
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const userAddress = await signer.getAddress();

      const eventName = formData.name;
      const seatNumber = formData.seatNumber;
      const eventDate = Math.floor(Date.now() / 1000) + 3600 * 24 * 30;

      // Generate TOTP secret for ticket validation
      const ticketId = `ticket-${Date.now()}`;
      const secret = BlockchainTOTPService.generateSecret(ticketId, eventName, 24 * 365); // 1 year expiry

      // Simulate payment processing
      const payment = PaymentService.initializePayment(parseFloat(formData.price), {
        eventName,
        seatNumber,
        userEmail: user.email,
        walletAddress: userAddress
      });

      const paymentResponse = await PaymentService.processPayment(payment);

      if (!paymentResponse.success) {
        throw new Error('Payment processing failed: ' + paymentResponse.error);
      }

      // Store payment ID for blockchain
      setPaymentId(paymentResponse.paymentId);

      // Mint ticket with payment ID
      const tx = await contract.mintTicket(
        userAddress,
        eventName,
        seatNumber,
        eventDate,
        secret.secretHash,
        paymentResponse.paymentId
      );

      await tx.wait();

      const saveData = async (base64Image: string) => {

        await saveTicketToFirestore({
          eventName,
          seatNumber,
          price: PaymentService.formatPrice(parseFloat(formData.price)),
          paymentId: paymentId || '',
          image: base64Image,
          creatorEmail: user.email,
          walletAddress: userAddress,
          timestamp: new Date().toISOString()
        });

        addNFT({
          title: eventName,
          description: `Seat: ${seatNumber}`,
          price: PaymentService.formatPrice(parseFloat(formData.price)),
          image: base64Image,
          creator: user.email,
          isVerified: true,
          transferable: false
        });

        await saveTicketToFirestore({
          eventName,
          seatNumber,
          price: PaymentService.formatPrice(parseFloat(formData.price)),
          paymentId: paymentId || '',
          image: base64Image,
          creatorEmail: user.email,
          walletAddress: userAddress,
          timestamp: new Date().toISOString()
        });

        addNFT({
          title: eventName,
          description: `Seat: ${seatNumber}`,
          price: PaymentService.formatPrice(parseFloat(formData.price)),
          image: base64Image,
          creator: user.email,
          isVerified: true,
          transferable: false
        });

        setFormData({ name: '', seatNumber: '', price: '', image: null });
        setPreviewUrl(null);

        setNotification({
          open: true,
          message: 'Event created and saved successfully!',
          severity: 'success'
        });

        setLoading(false);
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      };

      if (formData.image) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Image = reader.result as string;
          saveData(base64Image);
        };
        reader.readAsDataURL(formData.image);
      } else {
        const placeholderImage = "https://source.unsplash.com/random/300x200/?ticket";
        await saveData(placeholderImage);
      }
    } catch (err: any) {
      console.error(err);
      setNotification({
        open: true,
        message: err.message || 'Failed to create event',
        severity: 'error'
      });
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white' }}>
        Create New Event
      </Typography>
      <Paper sx={{ p: 4, borderRadius: 2, background: 'rgba(22, 28, 36, 0.8)', backdropFilter: 'blur(10px)' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Event Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                InputProps={{ sx: { borderRadius: 2 } }}
                sx={muiInputStyles}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Seat Number"
                name="seatNumber"
                value={formData.seatNumber}
                onChange={handleInputChange}
                required
                InputProps={{ sx: { borderRadius: 2 } }}
                sx={muiInputStyles}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Price (INR)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
                InputProps={{
                  sx: { borderRadius: 2 },
                  startAdornment: <InputAdornment position="start" sx={{ color: 'white' }}><CurrencyRupeeIcon /></InputAdornment>,
                  inputProps: { min: 0, step: 1 }
                }}
                helperText="Enter price in Indian Rupees"
                sx={muiInputStyles}
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
                  '&:hover': { borderColor: 'white' }
                }}
              >
                Upload Image
                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
              </Button>
              {formData.image && (
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Selected file: {formData.image.name}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {previewUrl && (
                <Box sx={{ mt: 1, borderRadius: 2, overflow: 'hidden', height: '120px' }}>
                  <img
                    src={previewUrl}
                    alt="Event Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  p: 1.5,
                  background: 'linear-gradient(45deg, #6a1b9a 30%, #4527a0 90%)',
                  '&:hover': { background: 'linear-gradient(45deg, #7b1fa2 30%, #512da8 90%)' }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Event'}
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
        <Alert onClose={handleCloseNotification} severity={notification.severity} variant="filled" sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

const muiInputStyles = {
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
};

export default CreateNFT;
