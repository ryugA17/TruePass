import React, { useState } from "react";
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
  CircularProgress,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { TransakService } from "../services/TransakService";
import INRPaymentFlow from "../components/payment/INRPaymentFlow";
import { useAuth } from "../context/AuthContext";

// Define window.ethereum for TypeScript
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (eventName: string, callback: (...args: any[]) => void) => void;
      removeListener: (
        eventName: string,
        callback: (...args: any[]) => void
      ) => void;
    };
    // Razorpay is declared in RazorpayService.ts
  }
}

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "error" | "info" | "success" | "warning";
    paymentId?: string;
  }>({
    show: false,
    message: "",
    type: "info",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  // Payment state
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentTokenId, setPaymentTokenId] = useState<string | null>(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return window.ethereum && window.ethereum.isMetaMask;
  };

  // Format address for display
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  const handleRemoveItem = (id: number | string) => {
    removeFromCart(id);
  };

  const handleUpdateQuantity = (id: number | string, change: number) => {
    updateQuantity(id, change);
  };

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "nft10") {
      setPromoApplied(true);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      // Remove ₹ symbol and commas if present
      const price = item.price.replace(/[₹,]/g, '');
      return total + parseFloat(price) * item.quantity;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return promoApplied ? subtotal * 0.9 : subtotal;
  };

  const formatPrice = (price: number) => {
    return TransakService.formatPrice(price);
  };

  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      setNotification({
        show: true,
        message: "Please install MetaMask extension to connect a wallet",
        type: "warning",
      });
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    try {
      // Request access to the user's accounts
      const accounts = await window.ethereum!.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        const account = accounts[0];
        setWalletAddress(account);
        setWalletConnected(true);

        setNotification({
          show: true,
          message: "Wallet connected successfully",
          type: "success",
        });
      }
    } catch (error: any) {
      console.error("Error connecting to MetaMask:", error);

      // Handle user rejected request
      if (error.code === 4001) {
        setNotification({
          show: true,
          message: "Connection request rejected by user",
          type: "info",
        });
      } else {
        setNotification({
          show: true,
          message:
            "Failed to connect wallet: " + (error.message || "Unknown error"),
          type: "error",
        });
      }
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      setNotification({
        show: true,
        message: "Please log in to continue with checkout",
        type: "warning",
      });
      navigate('/login');
      return;
    }

    // For NFT tickets, we still need a wallet for the blockchain part
    if (!walletConnected) {
      setNotification({
        show: true,
        message: "Please connect your wallet to receive NFT tickets",
        type: "warning",
      });
      return;
    }

    // The actual payment and minting will be handled by the INRPaymentFlow component
    // This function now just validates the user is logged in and has a wallet connected
  };

  // Handle successful payment and minting
  const handlePaymentSuccess = (tokenId: string, paymentId: string) => {
    setPaymentTokenId(tokenId);
    setPaymentSuccess(true);

    setNotification({
      show: true,
      message: "Payment successful! Your NFT ticket has been minted.",
      type: "success",
      paymentId: paymentId
    });

    // Clear cart after successful transaction
    setTimeout(() => {
      clearCart();
      setPromoApplied(false);
      setPromoCode("");
    }, 3000);
  };

  // Handle payment error
  const handlePaymentError = (error: string) => {
    setNotification({
      show: true,
      message: `Payment failed: ${error}`,
      type: "error"
    });
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, show: false }));
  };

  const getPaymentDetailsLink = (paymentId: string) => {
    // In a real app, this would link to a payment details page
    return `/payment-details/${paymentId}`;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 12, pb: 8 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ mb: 4, fontWeight: "bold" }}
      >
        Your Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/marketplace")}
            sx={{
              bgcolor: "#ff9800",
              "&:hover": { bgcolor: "#f57c00" },
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
                bgcolor: "rgba(22, 28, 36, 0.95)",
                borderRadius: 2,
                p: 3,
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                NFT Items (
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)})
              </Typography>
              <Divider sx={{ mb: 2, opacity: 0.2 }} />

              {cartItems.map((item) => (
                <Box key={item.id}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3} sm={2}>
                      <Card
                        sx={{
                          borderRadius: 2,
                          aspectRatio: "1/1",
                          overflow: "hidden",
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={item.image}
                          alt={item.title}
                          sx={{ height: "100%", width: "100%" }}
                        />
                      </Card>
                    </Grid>
                    <Grid item xs={5} sm={6}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold" }}
                      >
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        By {item.creator}
                      </Typography>
                    </Grid>
                    <Grid item xs={2} sm={2}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          sx={{ color: "white" }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                          sx={{ color: "white" }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>
                    <Grid item xs={2} sm={2} sx={{ textAlign: "right" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold" }}
                      >
                        {formatPrice(TransakService.parsePrice(item.price) * item.quantity)}
                      </Typography>
                      <IconButton
                        onClick={() => handleRemoveItem(item.id)}
                        size="small"
                        sx={{ color: "#f44336" }}
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
                bgcolor: "rgba(22, 28, 36, 0.95)",
                borderRadius: 2,
                p: 3,
                position: "sticky",
                top: 100,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Order Summary
              </Typography>
              <Divider sx={{ mb: 2, opacity: 0.2 }} />

              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body1">Subtotal</Typography>
                  <Typography variant="body1">
                    {formatPrice(calculateSubtotal())}
                  </Typography>
                </Box>

                {promoApplied && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body1" color="success.main">
                      Discount (10%)
                    </Typography>
                    <Typography variant="body1" color="success.main">
                      -{formatPrice(calculateSubtotal() * 0.1)}
                    </Typography>
                  </Box>
                )}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">
                    {formatPrice(calculateTotal())}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Promo Code
                </Typography>
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
                      bgcolor: "rgba(255, 255, 255, 0.05)",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.1)",
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
              </Box>

              {!walletConnected ? (
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<AccountBalanceWalletIcon />}
                  onClick={connectWallet}
                  sx={{
                    bgcolor: "#ff9800",
                    color: "white",
                    p: 1.5,
                    "&:hover": {
                      bgcolor: "#f57c00",
                    },
                  }}
                >
                  Connect Wallet for NFT Tickets
                </Button>
              ) : (
                <INRPaymentFlow
                  eventName={cartItems.length > 0 ? cartItems[0].title : 'Event'}
                  seatNumber={cartItems.length > 0 ? cartItems[0].id.toString() : '0'}
                  price={calculateTotal()}
                  image={cartItems.length > 0 ? cartItems[0].image : ''}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              )}

              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {walletConnected && (
                  <Typography variant="body2" color="text.secondary">
                    Connected: {formatAddress(walletAddress)}
                  </Typography>
                )}
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 2, display: "block", textAlign: "center" }}
              >
                By completing this purchase, you agree to our Terms of Service
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Snackbar
        open={notification.show}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={notification.type}
          variant="filled"
          onClose={handleCloseNotification}
          sx={{ width: "100%" }}
        >
          {notification.message}
          {notification.paymentId && (
            <Box sx={{ mt: 1 }}>
              <Link
                href={getPaymentDetailsLink(notification.paymentId)}
                target="_blank"
                rel="noopener"
                color="inherit"
                sx={{ textDecoration: "underline" }}
              >
                View payment details
              </Link>
            </Box>
          )}
        </Alert>
      </Snackbar>

    </Container>
  );
};

export default Cart;
