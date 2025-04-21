import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Divider,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import InfoIcon from '@mui/icons-material/Info';
import { RazorpayService, RazorpayPayment } from '../../services/RazorpayService';
import { useAuth } from '../../context/AuthContext';

interface RazorpayPaymentFormProps {
  price: number;
  eventName: string;
  seatNumber: string;
  originalPrice: number;
  onSuccess: (paymentId: string) => void;
  onCancel: () => void;
}

const RazorpayPaymentForm: React.FC<RazorpayPaymentFormProps> = ({
  price,
  eventName,
  seatNumber,
  originalPrice,
  onSuccess,
  onCancel
}) => {
  // Convert price to paise (Razorpay uses paise)
  const minAmount = parseInt(process.env.REACT_APP_MIN_PAYMENT_AMOUNT || '1', 10);
  const priceInPaise = Math.max(price * 100, minAmount * 100); // Minimum amount in paise

  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<RazorpayPayment | null>(null);
  const [orderId, setOrderId] = useState<string>('');

  // Generate a receipt ID when component mounts
  const [receiptId, setReceiptId] = useState<string>('');
  useEffect(() => {
    const timestamp = Date.now().toString().substring(5);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    setReceiptId(`RCPT${timestamp}${random}`);
  }, []);

  // Initialize Razorpay when component mounts
  useEffect(() => {
    const initRazorpay = async () => {
      try {
        await RazorpayService.initialize();
      } catch (error) {
        console.error('Failed to initialize Razorpay:', error);
        setError('Failed to initialize payment gateway. Please try again later.');
      }
    };

    initRazorpay();
  }, []);

  // Function to handle payment
  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Create a Razorpay order
      const order = await RazorpayService.createOrder(
        priceInPaise,
        receiptId,
        {
          eventName,
          seatNumber,
          userEmail: user?.email || ''
        }
      );

      setOrderId(order.id);

      // Open Razorpay payment form
      const payment = await RazorpayService.openPaymentForm({
        key: 'rzp_test_YOUR_KEY_ID', // This will be overridden by the service
        amount: priceInPaise,
        currency: 'INR',
        name: 'TruePass',
        description: `Ticket for ${eventName} - ${seatNumber}`,
        order_id: order.id,
        prefill: {
          name: user?.displayName || undefined,
          email: user?.email || undefined,
          contact: ''
        },
        notes: {
          eventName,
          seatNumber,
          receiptId
        },
        theme: {
          color: '#3f51b5'
        }
      });

      // Store payment details
      setPaymentDetails(payment);

      // Call success callback with payment ID
      onSuccess(payment.id);
    } catch (error) {
      console.error('Payment processing error:', error);

      // Show a more user-friendly error message
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Payment processing failed. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to verify payment
  const verifyPayment = async (paymentId: string, orderId: string, signature: string) => {
    try {
      const isVerified = await RazorpayService.verifyPayment(paymentId, orderId, signature);

      if (isVerified) {
        // Payment is verified, call success callback
        onSuccess(paymentId);
      } else {
        setError('Payment verification failed. Please contact support.');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setError('Payment verification failed. Please try again.');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Complete Payment
      </Typography>

      <Paper elevation={3} sx={{ p: 2, mb: 3, bgcolor: 'background.paper' }}>
        <Typography variant="subtitle1">
          Event: {eventName}
        </Typography>
        <Typography variant="subtitle2">
          Seat: {seatNumber}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" color="primary">
            {RazorpayService.formatPrice(priceInPaise)}
          </Typography>
          {originalPrice !== price && (
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              Original price: {RazorpayService.formatPrice(originalPrice * 100)}
            </Typography>
          )}
        </Box>
      </Paper>

      {paymentDetails ? (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            Payment Successful!
          </Alert>

          <Typography variant="h6" gutterBottom>
            Payment Details
          </Typography>

          <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="body1">
              <strong>Payment ID:</strong> {paymentDetails.id}
            </Typography>
            <Typography variant="body1">
              <strong>Order ID:</strong> {paymentDetails.order_id}
            </Typography>
            <Typography variant="body1">
              <strong>Amount:</strong> {RazorpayService.formatPrice(paymentDetails.amount)}
            </Typography>
            <Typography variant="body1">
              <strong>Status:</strong> {paymentDetails.status}
            </Typography>
            <Typography variant="body1">
              <strong>Method:</strong> {paymentDetails.method}
            </Typography>
            <Typography variant="body1">
              <strong>Date:</strong> {new Date(paymentDetails.created_at).toLocaleString()}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Your payment has been processed successfully. Your ticket will be issued shortly.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={() => onSuccess(paymentDetails.id)}
          >
            Continue
          </Button>
        </Box>
      ) : (
        <Box>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                Secure Payment with Razorpay
              </Typography>

              <Typography variant="body2" sx={{ mb: 2 }}>
                Click the button below to make a secure payment using Razorpay. You can pay using:
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1, fontSize: '0.875rem' }}>UPI</Box>
                <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1, fontSize: '0.875rem' }}>Credit Card</Box>
                <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1, fontSize: '0.875rem' }}>Debit Card</Box>
                <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1, fontSize: '0.875rem' }}>Net Banking</Box>
                <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1, fontSize: '0.875rem' }}>Wallet</Box>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {process.env.REACT_APP_ENV !== 'production'
                  ? 'This is a test payment. No actual money will be charged.'
                  : 'Your payment is secure and processed by Razorpay.'}
              </Typography>
            </CardContent>
          </Card>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handlePayment}
              disabled={isProcessing}
              startIcon={isProcessing ? <CircularProgress size={20} /> : <CurrencyRupeeIcon />}
            >
              {isProcessing ? 'Processing...' : `Pay ${RazorpayService.formatPrice(priceInPaise)}`}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default RazorpayPaymentForm;
