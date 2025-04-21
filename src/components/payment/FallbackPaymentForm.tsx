import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Divider,
  Alert,
  Tooltip,
  IconButton,
  Card,
  CardContent,
  TextField
} from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import InfoIcon from '@mui/icons-material/Info';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { DirectPaymentService } from '../../services/DirectPaymentService';
import { PaymentProcessor, PaymentDetails } from '../../services/PaymentProcessor';
import { useAuth } from '../../context/AuthContext';

interface FallbackPaymentFormProps {
  price: number;
  eventName: string;
  seatNumber: string;
  originalPrice: number;
  onSuccess: (paymentId: string) => void;
  onCancel: () => void;
}

/**
 * Fallback payment form when Transak is not available
 * This is a simplified form for demo purposes
 */
const FallbackPaymentForm: React.FC<FallbackPaymentFormProps> = ({
  price: originalPrice,
  eventName,
  seatNumber,
  onSuccess,
  onCancel
}) => {
  // Use minimum amount from environment variables or 1 INR as default
  const price = parseInt(process.env.REACT_APP_MIN_PAYMENT_AMOUNT || '1', 10);
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [buyerUpiId, setBuyerUpiId] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'failed'>('pending');

  // Generate a reference number when component mounts
  useEffect(() => {
    const timestamp = Date.now().toString().substring(5);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    setReferenceNumber(`TP${timestamp}${random}`);
  }, []);

  const [paymentInstructions, setPaymentInstructions] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Function to verify transaction ID
  const verifyTransaction = () => {
    if (!paymentDetails) {
      setError('No payment to verify');
      return;
    }

    if (!transactionId) {
      setError('Please enter your UPI Transaction ID');
      return;
    }

    // Reset previous verification status
    setVerificationStatus('pending');
    setIsProcessing(true);
    setError(null);

    // Validate transaction ID format first
    if (!DirectPaymentService.isValidTransactionId(transactionId)) {
      setIsProcessing(false);
      setVerificationStatus('failed');
      setError(
        'Invalid transaction ID format. Please enter a valid UPI transaction ID. ' +
        'It should include prefixes like UPI, TXN, REF, etc. and be at least 8 characters long.'
      );
      return;
    }

    try {
      // Verify the payment with the transaction ID
      const verifiedPayment = DirectPaymentService.verifyPayment(paymentDetails.id, transactionId);

      if (verifiedPayment) {
        // Update payment details with verification info
        setVerificationStatus('verified');
        setPaymentDetails({
          ...paymentDetails,
          status: 'COMPLETED',
          metadata: {
            ...paymentDetails.metadata,
            transactionId,
            verified: true
          }
        });

        // Show success message
        setError(null);
      } else {
        // Show detailed error message
        setVerificationStatus('failed');
        setError(
          'Transaction verification failed. Please check that you have: \n' +
          '1. Entered the correct and complete transaction ID \n' +
          `2. Made the payment to ${process.env.REACT_APP_UPI_ID || 'chauhan0993yash@okaxis'} \n` +
          '3. Included the reference number in your payment \n' +
          '4. Made the payment recently (within the last 30 minutes)'
        );
      }
    } catch (error) {
      console.error('Transaction verification error:', error);
      setVerificationStatus('failed');
      setError(error instanceof Error ? error.message : 'Transaction verification failed');
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to open UPI payment app directly
  const openUpiApp = () => {
    if (!buyerUpiId) {
      setError('Please enter your UPI ID first');
      return;
    }

    // Try to open the UPI app using DirectPaymentService
    const description = `Ticket for ${eventName} - ${referenceNumber}`;
    const success = DirectPaymentService.openUpiApp(price, referenceNumber, description);

    if (!success) {
      setError('Failed to open payment app. Please use the QR code instead.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    setPaymentDetails(null);
    setPaymentInstructions('');

    try {
      console.log('Starting payment process...');
      let payment: PaymentDetails;

      // Validate buyer's UPI ID
      if (!buyerUpiId) {
        throw new Error('Please enter your UPI ID');
      }

      // Process payment using UPI
      payment = await PaymentProcessor.processUpiPayment(
        price,
        buyerUpiId, // Use the buyer's UPI ID
        {
          eventName,
          seatNumber,
          userName: user?.displayName || '',
          userEmail: user?.email || '',
          originalPrice,
          referenceNumber,
          recipientUpiId: 'chauhan0993yash@okaxis' // The merchant's UPI ID
        }
      );

      console.log('Payment processed successfully:', payment);

      // Get payment instructions
      const instructions = DirectPaymentService.getPaymentInstructions();
      setPaymentInstructions(instructions);

      // Store payment details
      setPaymentDetails(payment);

      // Set verification status to pending for the new payment
      setVerificationStatus('pending');
    } catch (error) {
      console.error('Payment processing error:', error);

      // Show a more user-friendly error message
      if (error instanceof Error) {
        if (error.message.includes('cancelled')) {
          setError('Payment was cancelled. Please try again.');
        } else if (error.message.includes('failed')) {
          setError('Payment failed. Please check your payment details and try again.');
        } else if (error.message.includes('SDK not loaded')) {
          setError('Payment gateway not available. Please try again later.');
        } else {
          setError(error.message);
        }
      } else {
        setError('Payment processing failed. Please try again.');
      }
    } finally {
      setIsProcessing(false);
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
            {DirectPaymentService.formatPrice(price)}
          </Typography>
          <Tooltip title="Using ₹1 for testing. The actual ticket price will be charged on production.">
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography variant="caption" color="text.secondary">
          Original price: {DirectPaymentService.formatPrice(originalPrice)}
        </Typography>
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
              <strong>Amount:</strong> {DirectPaymentService.formatPrice(paymentDetails.amount)}
            </Typography>
            <Typography variant="body1">
              <strong>Status:</strong> {paymentDetails.status}
            </Typography>
            <Typography variant="body1">
              <strong>Method:</strong> {paymentDetails.method}
            </Typography>
            <Typography variant="body1">
              <strong>Reference:</strong> {paymentDetails.metadata?.reference || 'N/A'}
            </Typography>
            <Typography variant="body1">
              <strong>Date:</strong> {new Date(paymentDetails.timestamp).toLocaleString()}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Funds have been transferred to the merchant account.
          </Typography>

          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                Verify Your Payment
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Please enter your UPI Transaction ID to verify your payment:
              </Typography>

              <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>How to find your Transaction ID:</strong>
                </Typography>
                <Typography variant="body2" component="div">
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    <li>Open your UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
                    <li>Go to transaction history or recent payments</li>
                    <li>Find your payment to <strong>{process.env.REACT_APP_UPI_ID || 'chauhan0993yash@okaxis'}</strong></li>
                    <li>Look for "Transaction ID", "Reference ID", or "UPI Ref No."</li>
                    <li>Copy the full ID (usually starts with UPI, TXN, REF, etc.)</li>
                  </ul>
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="UPI Transaction ID"
                variant="outlined"
                value={transactionId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTransactionId(e.target.value)}
                placeholder="e.g., UPI123456789012"
                sx={{ mb: 1 }}
                helperText="Enter the complete transaction ID exactly as shown in your UPI app"
              />

              {process.env.REACT_APP_ENV !== 'production' && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                  <Button
                    size="small"
                    variant="text"
                    color="primary"
                    onClick={() => {
                      // Generate a sample transaction ID for testing
                      const timestamp = Math.floor(Date.now() / 1000);
                      const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
                      setTransactionId(`UPI${timestamp}${randomNum}`);
                    }}
                  >
                    Use Sample ID (For Testing)
                  </Button>
                </Box>
              )}
              <Button
                variant="contained"
                color="secondary"
                onClick={verifyTransaction}
                disabled={!transactionId || isProcessing}
                fullWidth
              >
                {isProcessing ? 'Verifying...' : 'Verify Payment'}
              </Button>

              {verificationStatus === 'verified' && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Payment verified successfully!
                </Alert>
              )}

              {verificationStatus === 'failed' && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Payment verification failed. Please check the transaction ID and try again.
                </Alert>
              )}
            </CardContent>
          </Card>

          {paymentInstructions && (
            <Card variant="outlined" sx={{ mb: 3, textAlign: 'left' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" color="primary">
                    Payment Instructions
                  </Typography>
                  <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
                    <IconButton size="small" onClick={() => copyToClipboard(paymentInstructions)}>
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {paymentInstructions}
                </Typography>
              </CardContent>
            </Card>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={() => onSuccess(paymentDetails.id)}
            disabled={verificationStatus !== 'verified' && !paymentDetails.metadata?.verified}
          >
            {verificationStatus === 'verified' || paymentDetails.metadata?.verified ? 'Continue' : 'Verify Payment to Continue'}
          </Button>
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" color="primary">
                  Payment Instructions
                </Typography>
                <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
                  <IconButton
                    size="small"
                    onClick={() => copyToClipboard(`UPI ID: ${process.env.REACT_APP_UPI_ID || 'chauhan0993yash@okaxis'}\nReference: ${referenceNumber}`)}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              <Typography variant="body2" sx={{ mb: 2 }}>
                Please make the payment to the following UPI ID:
              </Typography>

              <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, mb: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  {process.env.REACT_APP_UPI_ID || 'chauhan0993yash@okaxis'}
                </Typography>
                <Typography variant="body2">
                  Reference Number: <strong>{referenceNumber}</strong>
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Please include the reference number in your payment description. Your ticket will be issued once the payment is confirmed.
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Enter your UPI ID to initiate payment:
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Your UPI ID"
                    variant="outlined"
                    value={buyerUpiId}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBuyerUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    required
                    helperText="Enter your UPI ID (e.g., name@upi, phone@paytm)"
                  />
                </Box>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={openUpiApp}
                    disabled={!buyerUpiId}
                    sx={{ mt: 1 }}
                  >
                    Pay ₹{price} via UPI App
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Scan this QR code to pay ₹{price} to {process.env.REACT_APP_UPI_ID || 'chauhan0993yash@okaxis'}
            </Typography>
            <Box
              sx={{
                width: 200,
                height: 200,
                bgcolor: '#f5f5f5',
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                mx: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <img
                src={require('../../assets/QR.jpeg')}
                alt="UPI QR Code"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </Box>
          </Box>

          {!paymentDetails && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={onCancel}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isProcessing}
                startIcon={isProcessing ? <CircularProgress size={20} /> : <CurrencyRupeeIcon />}
              >
                {isProcessing ? 'Processing...' : paymentDetails ? 'I have paid' : `Confirm Payment of ₹${price}`}
              </Button>
            </Box>
          )}
        </form>
      )}
    </Box>
  );
};

export default FallbackPaymentForm;
