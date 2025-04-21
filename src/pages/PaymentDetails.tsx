import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Divider,
  Button,
  Card,
  CardContent,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReceiptIcon from '@mui/icons-material/Receipt';
import EventIcon from '@mui/icons-material/Event';
import RefundIcon from '@mui/icons-material/MoneyOff';
import { PaymentProcessor, PaymentDetails } from '../services/PaymentProcessor';
import { RefundService } from '../services/RefundService';
import { TransakService } from '../services/TransakService';
import { useAuth } from '../context/AuthContext';

const PaymentDetailsPage: React.FC = () => {
  const { paymentId } = useParams<{ paymentId: string }>();
  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [allPayments, setAllPayments] = useState<PaymentDetails[]>([]);
  const [refunds, setRefunds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [processingRefund, setProcessingRefund] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/login');
      return;
    }

    // Load payment details
    const loadPaymentDetails = () => {
      try {
        // Get all payments
        const payments = PaymentProcessor.getAllPayments();
        setAllPayments(payments);

        // If paymentId is provided, get specific payment
        if (paymentId) {
          const paymentDetails = PaymentProcessor.getPaymentById(paymentId);
          if (paymentDetails) {
            setPayment(paymentDetails);

            // Get refunds for this payment
            const paymentRefunds = RefundService.getRefundsForPayment(paymentId);
            setRefunds(paymentRefunds);
          } else {
            setError('Payment not found');
          }
        }
      } catch (error) {
        console.error('Error loading payment details:', error);
        setError('Failed to load payment details');
      } finally {
        setLoading(false);
      }
    };

    loadPaymentDetails();
  }, [paymentId, navigate, user]);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
      case 'PROCESSING':
        return 'warning';
      case 'FAILED':
      case 'REFUNDED':
        return 'error';
      default:
        return 'default';
    }
  };

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // Handle refund dialog open
  const handleRefundDialogOpen = () => {
    setRefundDialogOpen(true);
  };

  // Handle refund dialog close
  const handleRefundDialogClose = () => {
    setRefundDialogOpen(false);
  };

  // Process refund
  const processRefund = async () => {
    if (!payment) return;

    setProcessingRefund(true);
    setError(null);
    setSuccess(null);

    try {
      // Process refund
      const refundDetails = await RefundService.processRefund(
        payment.id,
        payment.amount,
        refundReason || 'Customer requested refund'
      );

      // Update refunds list
      setRefunds([...refunds, refundDetails]);

      // Show success message
      setSuccess(`Refund of ${TransakService.formatPrice(refundDetails.amount)} processed successfully`);

      // Close dialog
      setRefundDialogOpen(false);
    } catch (error) {
      console.error('Error processing refund:', error);
      setError(error instanceof Error ? error.message : 'Failed to process refund');
    } finally {
      setProcessingRefund(false);
    }
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 12, pb: 8 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
          {paymentId ? 'Payment Details' : 'Payment History'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 4 }}>
            {success}
          </Alert>
        )}

        {loading ? (
          <Typography>Loading payment details...</Typography>
        ) : paymentId && payment ? (
        // Single payment details view
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                bgcolor: 'rgba(22, 28, 36, 0.95)',
                borderRadius: 2,
                p: 3,
                mb: 3,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Payment Information</Typography>
                <Chip
                  label={payment.status}
                  color={getStatusColor(payment.status) as any}
                  variant="outlined"
                />
              </Box>
              <Divider sx={{ mb: 3, opacity: 0.2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Payment ID
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {payment.id}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Amount
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold' }}>
                    {TransakService.formatPrice(payment.amount)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Payment Method
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {payment.method}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {formatDate(payment.timestamp)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Sender
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {payment.senderAddress || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Recipient
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {payment.recipientAddress}
                  </Typography>
                </Grid>
                {payment.transactionHash && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Transaction Hash
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, wordBreak: 'break-all' }}>
                      {payment.transactionHash}
                    </Typography>
                  </Grid>
                )}
              </Grid>

              {payment.metadata && (
                <>
                  <Divider sx={{ my: 3, opacity: 0.2 }} />
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Event Details
                  </Typography>
                  <Grid container spacing={2}>
                    {payment.metadata.eventName && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Event Name
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {payment.metadata.eventName}
                        </Typography>
                      </Grid>
                    )}
                    {payment.metadata.seatNumber && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Seat Number
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {payment.metadata.seatNumber}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </>
              )}
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button variant="outlined" onClick={() => navigate('/payment-history')}>
                Back to Payment History
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleRefundDialogOpen}
                disabled={refunds.length > 0}
              >
                Request Refund
              </Button>
              <Button variant="contained" onClick={() => navigate('/marketplace')}>
                Continue Shopping
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                bgcolor: 'rgba(22, 28, 36, 0.95)',
                borderRadius: 2,
                p: 3,
                position: 'sticky',
                top: 100,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Payment Summary
              </Typography>
              <Divider sx={{ mb: 3, opacity: 0.2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={payment.status}
                  color={getStatusColor(payment.status) as any}
                  sx={{ mt: 1 }}
                />
              </Box>

              {refunds.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Refund Status
                  </Typography>
                  <Chip
                    label="Refunded"
                    color="error"
                    icon={<RefundIcon />}
                    sx={{ mt: 1 }}
                  />
                </Box>
              )}

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Amount
                </Typography>
                <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>
                  {TransakService.formatPrice(payment.amount)}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Payment Method
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  {payment.method === 'UPI' ? (
                    <PaymentIcon sx={{ mr: 1 }} />
                  ) : payment.method === 'NET_BANKING' ? (
                    <AccountBalanceIcon sx={{ mr: 1 }} />
                  ) : (
                    <ReceiptIcon sx={{ mr: 1 }} />
                  )}
                  <Typography variant="body1">{payment.method}</Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Date
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {formatDate(payment.timestamp)}
                </Typography>
              </Box>

              {payment.metadata && payment.metadata.eventName && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Event
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <EventIcon sx={{ mr: 1 }} />
                    <Typography variant="body1">{payment.metadata.eventName}</Typography>
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      ) : (
        // Payment history view
        <Box>
          {allPayments.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                bgcolor: 'rgba(22, 28, 36, 0.95)',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                No Payment History
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                You haven't made any payments yet.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/marketplace')}
                sx={{ mt: 2 }}
              >
                Browse Marketplace
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {allPayments.map((payment) => (
                <Grid item xs={12} sm={6} md={4} key={payment.id}>
                  <Card
                    sx={{
                      bgcolor: 'rgba(22, 28, 36, 0.95)',
                      borderRadius: 2,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" noWrap>
                          {payment.metadata?.eventName || 'Payment'}
                        </Typography>
                        <Chip
                          label={payment.status}
                          size="small"
                          color={getStatusColor(payment.status) as any}
                        />
                      </Box>

                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <PaymentIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={TransakService.formatPrice(payment.amount)}
                            secondary="Amount"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <ReceiptIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={payment.method}
                            secondary="Method"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <EventIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={formatDate(payment.timestamp)}
                            secondary="Date"
                          />
                        </ListItem>
                      </List>

                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => navigate(`/payment-details/${payment.id}`)}
                        sx={{ mt: 2 }}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
        )}
      </Container>

      {/* Refund Dialog */}
      <Dialog open={refundDialogOpen} onClose={handleRefundDialogClose}>
        <DialogTitle>Request Refund</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            You are about to request a refund for {payment?.id} of {payment ? TransakService.formatPrice(payment.amount) : ''}.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            id="reason"
            label="Reason for refund"
            type="text"
            fullWidth
            variant="outlined"
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRefundDialogClose}>Cancel</Button>
          <Button
            onClick={processRefund}
            variant="contained"
            color="error"
            disabled={processingRefund}
          >
            {processingRefund ? 'Processing...' : 'Process Refund'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PaymentDetailsPage;
