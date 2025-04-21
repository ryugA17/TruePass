import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { TOTPService, TOTPSecret } from '../../services/TOTPService';

interface TOTPGeneratorProps {
  onSecretGenerated?: (secret: TOTPSecret) => void;
}

const TOTPGenerator: React.FC<TOTPGeneratorProps> = ({ onSecretGenerated }) => {
  const [ticketId, setTicketId] = useState('');
  const [eventName, setEventName] = useState('');
  const [expiryHours, setExpiryHours] = useState<number | ''>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<TOTPSecret | null>(null);
  const [loading, setLoading] = useState(false);
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
      const newSecret = TOTPService.generateSecret(
        ticketId,
        eventName,
        expiryHours ? Number(expiryHours) : undefined
      );

      // Generate QR code
      const qrCode = await TOTPService.generateQRCode(newSecret);

      // Save the secret to local storage
      TOTPService.saveSecret(newSecret);

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
        maxWidth: 500,
        mx: 'auto',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Generate Ticket Verification Code
      </Typography>

      <Box component="form" sx={{ mt: 2 }}>
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
      )}

      <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
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

export default TOTPGenerator;
