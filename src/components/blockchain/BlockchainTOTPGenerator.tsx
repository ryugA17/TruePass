import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid,
  Divider,
} from '@mui/material';
import { BlockchainTOTPService, TOTPSecret } from '../../services/BlockchainTOTPService';
import { PaymentService } from '../../services/PaymentService';
import { ethers } from 'ethers';

interface BlockchainTOTPGeneratorProps {
  onSecretGenerated?: (secret: TOTPSecret) => void;
}

const BlockchainTOTPGenerator: React.FC<BlockchainTOTPGeneratorProps> = ({ onSecretGenerated }) => {
  const [ticketId, setTicketId] = useState('');
  const [eventName, setEventName] = useState('');
  const [seatNumber, setSeatNumber] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [price, setPrice] = useState('0');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [expiryHours, setExpiryHours] = useState<number | ''>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<TOTPSecret | null>(null);
  const [loading, setLoading] = useState(false);
  const [minting, setMinting] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'info' | 'warning' | 'error',
  });

  const handleGenerateSecret = async () => {
    if (!ticketId || !eventName) {
      setNotification({
        open: true,
        message: 'Please enter both ticket ID and event name',
        severity: 'warning',
      });
      return;
    }

    setLoading(true);
    try {
      // Generate a new TOTP secret
      const newSecret = BlockchainTOTPService.generateSecret(
        ticketId,
        eventName,
        expiryHours ? Number(expiryHours) : undefined
      );

      // Generate QR code
      const qrCode = await BlockchainTOTPService.generateQRCode(newSecret);

      // Save the secret to local storage
      BlockchainTOTPService.saveSecret(newSecret);

      // Update state
      setSecret(newSecret);
      setQrCodeUrl(qrCode);

      // Notify parent component
      if (onSecretGenerated) {
        onSecretGenerated(newSecret);
      }

      setNotification({
        open: true,
        message: 'TOTP secret generated successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error generating TOTP secret:', error);
      setNotification({
        open: true,
        message: 'Failed to generate TOTP secret',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMintTicket = async () => {
    if (!secret || !recipientAddress || !seatNumber || !eventDate) {
      setNotification({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'warning',
      });
      return;
    }

    try {
      setMinting(true);

      // Validate Ethereum address
      if (!ethers.utils.isAddress(recipientAddress)) {
        throw new Error('Invalid Ethereum address');
      }

      // Convert date string to timestamp
      const eventTimestamp = new Date(eventDate).getTime();

      // Generate a payment ID for the transaction
      const payment = PaymentService.initializePayment(parseFloat(price) || 0, {
        eventName,
        seatNumber,
        recipientAddress
      });

      // Process the payment
      const paymentResponse = await PaymentService.processPayment(payment);

      if (!paymentResponse.success) {
        throw new Error('Payment processing failed: ' + (paymentResponse.error || 'Unknown error'));
      }

      // Mint the ticket on blockchain with payment ID
      const receipt = await BlockchainTOTPService.mintTicketWithTOTP(
        recipientAddress,
        eventName,
        seatNumber,
        eventTimestamp,
        secret,
        paymentResponse.paymentId
      );

      // Get the token ID from the receipt
      const event = receipt.events?.find(e => e.event === 'TicketMinted');
      const tokenId = event?.args?.tokenId.toString();

      setNotification({
        open: true,
        message: `Ticket minted successfully! Token ID: ${tokenId}`,
        severity: 'success',
      });
    } catch (error) {
      console.error('Error minting ticket:', error);
      setNotification({
        open: true,
        message: `Failed to mint ticket: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error',
      });
    } finally {
      setMinting(false);
    }
  };

  const handleExpiryChange = (event: SelectChangeEvent<string>) => {
    setExpiryHours(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
        maxWidth: 600,
        mx: 'auto',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Generate Blockchain Ticket with TOTP
      </Typography>

      <Box component="form" noValidate autoComplete="off">
        <TextField
          fullWidth
          label="Ticket ID"
          variant="outlined"
          value={ticketId}
          onChange={e => setTicketId(e.target.value)}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Event Name"
          variant="outlined"
          value={eventName}
          onChange={e => setEventName(e.target.value)}
          margin="normal"
          required
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="expiry-select-label">Expiry Time</InputLabel>
          <Select
            labelId="expiry-select-label"
            value={expiryHours === '' ? '' : String(expiryHours)}
            label="Expiry Time"
            onChange={handleExpiryChange}
          >
            <MenuItem value="">Never Expires</MenuItem>
            <MenuItem value="24">24 Hours</MenuItem>
            <MenuItem value="48">48 Hours</MenuItem>
            <MenuItem value="72">72 Hours</MenuItem>
            <MenuItem value="168">1 Week</MenuItem>
          </Select>
        </FormControl>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleGenerateSecret}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Generate QR Code'}
        </Button>
      </Box>

      {qrCodeUrl && (
        <>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Scan this QR code with an authenticator app
            </Typography>
            <Box
              component="img"
              src={qrCodeUrl}
              alt="TOTP QR Code"
              sx={{
                maxWidth: '100%',
                height: 'auto',
                border: '1px solid #eee',
                borderRadius: 1,
                p: 2,
                bgcolor: 'white',
              }}
            />
            {secret && (
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Secret Key (for manual entry):
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      p: 1,
                      bgcolor: 'grey.100',
                      borderRadius: 1,
                      fontFamily: 'monospace',
                      wordBreak: 'break-all',
                    }}
                  >
                    {secret.secret}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Issuer:
                  </Typography>
                  <Typography variant="body2">{secret.issuer}</Typography>
                </Grid>
                {secret.expiresAt && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Expires:
                    </Typography>
                    <Typography variant="body2">
                      {new Date(secret.expiresAt).toLocaleString()}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Mint Ticket on Blockchain
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Fill in the details below to mint this ticket as an NFT on the blockchain.
            </Typography>

            <TextField
              fullWidth
              label="Recipient Ethereum Address"
              variant="outlined"
              value={recipientAddress}
              onChange={e => setRecipientAddress(e.target.value)}
              margin="normal"
              required
              placeholder="0x..."
            />

            <TextField
              fullWidth
              label="Seat Number"
              variant="outlined"
              value={seatNumber}
              onChange={e => setSeatNumber(e.target.value)}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Event Date"
              variant="outlined"
              type="datetime-local"
              value={eventDate}
              onChange={e => setEventDate(e.target.value)}
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              fullWidth
              label="Price (INR)"
              variant="outlined"
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              margin="normal"
              required
              InputProps={{
                inputProps: { min: 0, step: 1 }
              }}
              helperText="Enter price in Indian Rupees"
            />

            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={handleMintTicket}
              disabled={minting || !secret || !recipientAddress || !seatNumber || !eventDate}
              sx={{ mt: 2 }}
            >
              {minting ? <CircularProgress size={24} /> : 'Mint Ticket NFT'}
            </Button>
          </Box>
        </>
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default BlockchainTOTPGenerator;
