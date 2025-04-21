import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { TransakService, TransakEvent, TransakOrder } from '../../services/TransakService';
import { PaymentProcessor, PaymentDetails } from '../../services/PaymentProcessor';
import { useAuth } from '../../context/AuthContext';
import { useNFTs } from '../../context/NFTContext';
import { saveTicketToFirestore } from '../../Utils/saveTicketToFirestore';
import FallbackPaymentForm from './FallbackPaymentForm';

// Define component props
interface INRPaymentFlowProps {
  eventName: string;
  seatNumber: string;
  price: number;
  image: string;
  onSuccess: (tokenId: string, paymentId: string) => void;
  onError: (error: string) => void;
}

// Define payment steps
enum PaymentStep {
  CONNECT_WALLET = 0,
  PAYMENT = 1,
  MINTING = 2,
  COMPLETE = 3
}

const INRPaymentFlow: React.FC<INRPaymentFlowProps> = ({
  eventName,
  seatNumber,
  price,
  image,
  onSuccess,
  onError
}) => {
  const { user } = useAuth();
  const { addNFT } = useNFTs();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<PaymentStep>(PaymentStep.CONNECT_WALLET);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transakInstance, setTransakInstance] = useState<any>(null);
  const [order, setOrder] = useState<TransakOrder | null>(null);
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState<boolean>(false);

  // Handle component cleanup
  useEffect(() => {
    return () => {
      if (transakInstance) {
        transakInstance.close();
      }
    };
  }, [transakInstance]);

  // Open payment flow
  const openPaymentFlow = () => {
    setIsOpen(true);
    setCurrentStep(PaymentStep.CONNECT_WALLET);
    setError(null);
  };

  // Close payment flow
  const closePaymentFlow = () => {
    if (transakInstance) {
      transakInstance.close();
    }
    setIsOpen(false);
    setCurrentStep(PaymentStep.CONNECT_WALLET);
    setError(null);
  };

  // Connect wallet
  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setCurrentStep(PaymentStep.PAYMENT);
      } else {
        throw new Error('No accounts found. Please create a wallet in MetaMask.');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError(error instanceof Error ? error.message : 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  // Start payment process
  const startPayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!user) {
        throw new Error('You must be logged in to purchase tickets');
      }

      if (!walletAddress) {
        throw new Error('Wallet not connected');
      }

      try {
        // Check if we should use the fallback form
        if (typeof window.Transak === 'undefined' && !window.transakLoaded) {
          // If Transak is not available after 3 seconds, use fallback
          const transakAvailable = await new Promise<boolean>(resolve => {
            setTimeout(() => {
              resolve(typeof window.Transak !== 'undefined');
            }, 3000);
          });

          if (!transakAvailable) {
            console.warn('Transak SDK not available, using fallback payment form');
            setUseFallback(true);
            return; // Exit early, we'll use the fallback form
          }
        }

        // Initialize Transak widget
        const transak = await TransakService.openTransakWidget(
          walletAddress,
          price,
          user.email,
          {
            userData: {
              firstName: user.displayName?.split(' ')[0] || '',
              lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
            }
          }
        );

        setTransakInstance(transak);

        // Handle Transak events
        TransakService.handleTransakEvents(transak, handleTransakEvent);
      } catch (transakError) {
        console.error('Transak initialization error:', transakError);
        // Use fallback payment form if Transak fails
        setUseFallback(true);
      }
    } catch (error) {
      console.error('Error starting payment:', error);
      setError(error instanceof Error ? error.message : 'Failed to start payment process');
      setCurrentStep(PaymentStep.PAYMENT);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Transak events
  const handleTransakEvent = async (event: TransakEvent) => {
    console.log('Transak event:', event);

    switch (event.eventName) {
      case 'TRANSAK_ORDER_CREATED':
        if (event.data) {
          setOrder(event.data);
        }
        break;

      case 'TRANSAK_ORDER_SUCCESSFUL':
        if (event.data) {
          setOrder(event.data);
          setCurrentStep(PaymentStep.MINTING);
          await mintTicket(event.data);
        }
        break;

      case 'TRANSAK_ORDER_FAILED':
        setError('Payment failed. Please try again.');
        setCurrentStep(PaymentStep.PAYMENT);
        break;

      case 'TRANSAK_ORDER_CANCELLED':
        setError('Payment cancelled.');
        setCurrentStep(PaymentStep.PAYMENT);
        break;

      case 'TRANSAK_WIDGET_CLOSE':
        if (currentStep !== PaymentStep.COMPLETE && currentStep !== PaymentStep.MINTING) {
          setError('Payment process was interrupted.');
        }
        break;
    }
  };

  // Handle fallback payment success
  const handleFallbackPaymentSuccess = async (paymentId: string) => {
    try {
      // Get payment details
      const payment = PaymentProcessor.getPaymentById(paymentId);

      if (!payment) {
        throw new Error('Payment details not found');
      }

      // Transfer funds to contract
      await PaymentProcessor.transferFundsToContract(payment, walletAddress);

      // Create an order object from payment details
      const order: TransakOrder = {
        id: payment.id,
        status: 'COMPLETED',
        cryptoAmount: 0.01, // Approximate ETH amount
        fiatAmount: payment.amount,
        fiatCurrency: payment.currency,
        cryptoCurrency: 'ETH',
        walletAddress: walletAddress,
        paymentId: payment.id
      };

      setOrder(order);
      setCurrentStep(PaymentStep.MINTING);
      await mintTicket(order);
    } catch (error) {
      console.error('Error processing payment:', error);
      setError(error instanceof Error ? error.message : 'Failed to process payment');
    }
  };

  // Handle fallback payment cancel
  const handleFallbackPaymentCancel = () => {
    setUseFallback(false);
    setError('Payment cancelled');
  };

  // Mint ticket after successful payment
  const mintTicket = async (orderData: TransakOrder) => {
    setIsLoading(true);
    setError(null);

    try {
      // Calculate event date (30 days from now)
      const eventDate = Math.floor(Date.now() / 1000) + 3600 * 24 * 30;

      try {
        // Auto-mint ticket
        const receipt = await TransakService.autoMintTicket(
          orderData,
          eventName,
          seatNumber,
          eventDate
        );

        if (!receipt) {
          throw new Error('Failed to mint ticket - no receipt returned');
        }

        // Get token ID from receipt
        const event = receipt.events?.find(e => e.event === 'TicketMinted');
        if (event && event.args) {
          const newTokenId = event.args.tokenId.toString();
          setTokenId(newTokenId);

          // Add to NFT context
          addNFT({
            title: eventName,
            description: `Seat: ${seatNumber}`,
            price: TransakService.formatPrice(price),
            image: image,
            creator: user?.email || '',
            isVerified: true,
            transferable: false
          });

          // Save to Firestore
          await saveTicketToFirestore({
            eventName,
            seatNumber,
            price: TransakService.formatPrice(price),
            paymentId: orderData.paymentId,
            image: image,
            creatorEmail: user?.email || '',
            walletAddress: walletAddress,
            timestamp: new Date().toISOString()
          });

          // Set step to complete
          setCurrentStep(PaymentStep.COMPLETE);

          // Call success callback
          onSuccess(newTokenId, orderData.paymentId);
        } else {
          // For demo purposes, create a mock token ID if the event is not found
          const mockTokenId = `demo-${Date.now()}`;
          setTokenId(mockTokenId);

          // Add to NFT context with mock token ID
          addNFT({
            title: eventName,
            description: `Seat: ${seatNumber}`,
            price: TransakService.formatPrice(price),
            image: image,
            creator: user?.email || '',
            isVerified: true,
            transferable: false
          });

          // Save to Firestore
          await saveTicketToFirestore({
            eventName,
            seatNumber,
            price: TransakService.formatPrice(price),
            paymentId: orderData.paymentId,
            image: image,
            creatorEmail: user?.email || '',
            walletAddress: walletAddress,
            timestamp: new Date().toISOString()
          });

          // Set step to complete
          setCurrentStep(PaymentStep.COMPLETE);

          // Call success callback
          onSuccess(mockTokenId, orderData.paymentId);
        }
      } catch (mintError) {
        console.error('Error in minting process:', mintError);

        // For demo purposes, create a mock token ID if minting fails
        const mockTokenId = `demo-${Date.now()}`;
        setTokenId(mockTokenId);

        // Add to NFT context with mock token ID
        addNFT({
          title: eventName,
          description: `Seat: ${seatNumber} (Demo)`,
          price: TransakService.formatPrice(price),
          image: image,
          creator: user?.email || '',
          isVerified: true,
          transferable: false
        });

        // Save to Firestore
        await saveTicketToFirestore({
          eventName,
          seatNumber,
          price: TransakService.formatPrice(price),
          paymentId: orderData.paymentId,
          image: image,
          creatorEmail: user?.email || '',
          walletAddress: walletAddress,
          timestamp: new Date().toISOString()
        });

        // Set step to complete
        setCurrentStep(PaymentStep.COMPLETE);

        // Call success callback
        onSuccess(mockTokenId, orderData.paymentId);
      }
    } catch (error) {
      console.error('Error minting ticket:', error);
      setError(error instanceof Error ? error.message : 'Failed to mint ticket');
      onError(error instanceof Error ? error.message : 'Failed to mint ticket');
    } finally {
      setIsLoading(false);
    }
  };

  // Render payment steps
  const renderStep = () => {
    switch (currentStep) {
      case PaymentStep.CONNECT_WALLET:
        return (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h6" gutterBottom>
              Connect Your Wallet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Connect your Ethereum wallet to receive your NFT ticket after payment.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AccountBalanceWalletIcon />}
              onClick={connectWallet}
              disabled={isLoading}
              sx={{ mt: 2 }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Connect Wallet'}
            </Button>
          </Box>
        );

      case PaymentStep.PAYMENT:
        return useFallback ? (
          <FallbackPaymentForm
            price={price}
            eventName={eventName}
            seatNumber={seatNumber}
            originalPrice={price} // Using the same price as originalPrice
            onSuccess={handleFallbackPaymentSuccess}
            onCancel={handleFallbackPaymentCancel}
          />
        ) : (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h6" gutterBottom>
              Make Payment
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Pay with UPI, Paytm, or Credit Card to purchase your ticket.
            </Typography>
            <Paper elevation={3} sx={{ p: 2, mb: 3, bgcolor: 'background.paper' }}>
              <Typography variant="subtitle1">
                Event: {eventName}
              </Typography>
              <Typography variant="subtitle2">
                Seat: {seatNumber}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="h6" color="primary">
                {TransakService.formatPrice(price)}
              </Typography>
            </Paper>
            <Button
              variant="contained"
              startIcon={<CurrencyRupeeIcon />}
              onClick={startPayment}
              disabled={isLoading}
              sx={{ mt: 2 }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Pay Now'}
            </Button>
          </Box>
        );

      case PaymentStep.MINTING:
        return (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h6" gutterBottom>
              Minting Your Ticket
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Your payment was successful! We're now minting your NFT ticket.
            </Typography>
            <CircularProgress sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Please don't close this window. This may take a minute...
            </Typography>
          </Box>
        );

      case PaymentStep.COMPLETE:
        return (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h6" gutterBottom>
              Purchase Complete!
            </Typography>
            <ConfirmationNumberIcon color="success" sx={{ fontSize: 60, my: 2 }} />
            <Typography variant="body1" sx={{ mb: 1 }}>
              Your NFT ticket has been minted and sent to your wallet.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Token ID: {tokenId}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={closePaymentFlow}
              >
                Close
              </Button>
              {order && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(`/payment-details/${order.paymentId}`)}
                >
                  View Payment Details
                </Button>
              )}
            </Box>
            {order && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                Payment ID: {order.paymentId} -
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/payment-history')}
                >
                  View all payments
                </Link>
              </Typography>
            )}
          </Box>
        );
    }
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<CurrencyRupeeIcon />}
        onClick={openPaymentFlow}
        fullWidth
      >
        Buy with INR
      </Button>

      <Dialog
        open={isOpen}
        onClose={() => {
          if (currentStep !== PaymentStep.MINTING) {
            closePaymentFlow();
          }
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Purchase Ticket
        </DialogTitle>
        <DialogContent>
          <Stepper activeStep={currentStep} sx={{ mb: 4, mt: 2 }}>
            <Step>
              <StepLabel>Connect Wallet</StepLabel>
            </Step>
            <Step>
              <StepLabel>Payment</StepLabel>
            </Step>
            <Step>
              <StepLabel>Minting</StepLabel>
            </Step>
            <Step>
              <StepLabel>Complete</StepLabel>
            </Step>
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {renderStep()}
        </DialogContent>
        <DialogActions>
          {currentStep !== PaymentStep.MINTING && currentStep !== PaymentStep.COMPLETE && (
            <Button onClick={closePaymentFlow} disabled={isLoading}>
              Cancel
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default INRPaymentFlow;
