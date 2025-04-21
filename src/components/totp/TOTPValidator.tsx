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
  Divider,
  Chip,
} from '@mui/material';
import { TOTPService, TOTPSecret } from '../../services/TOTPService';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { authenticator } from 'otplib';

interface TOTPValidatorProps {
  onValidationResult?: (result: boolean, ticketId?: string) => void;
}

const TOTPValidator: React.FC<TOTPValidatorProps> = ({ onValidationResult }) => {
  const [token, setToken] = useState('');
  const [selectedSecretId, setSelectedSecretId] = useState<string>('');
  const [secrets, setSecrets] = useState<TOTPSecret[]>([]);
  const [validationResult, setValidationResult] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'info' | 'warning' | 'error',
  });

  // Load secrets from local storage
  useEffect(() => {
    const loadSecrets = () => {
      const storedSecrets = TOTPService.getSecrets();
      setSecrets(storedSecrets);
    };

    loadSecrets();
    // Clear expired secrets
    const clearedCount = TOTPService.clearExpiredSecrets();
    if (clearedCount > 0) {
      loadSecrets();
    }
  }, []);

  // Update time left for token
  useEffect(() => {
    if (!validationResult) return;

    const interval = setInterval(() => {
      const secondsLeft = 30 - (Math.floor(Date.now() / 1000) % 30);
      setTimeLeft(secondsLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [validationResult]);

  const handleValidateToken = () => {
    if (!token) {
      setNotification({
        open: true,
        message: 'Please enter a token',
        severity: 'warning',
      });
      return;
    }

    // Clean token of any non-digit characters
    const cleanToken = token.replace(/[^0-9]/g, '');

    if (cleanToken.length !== 6) {
      setNotification({
        open: true,
        message: 'Token must be 6 digits',
        severity: 'warning',
      });
      return;
    }

    if (!selectedSecretId) {
      setNotification({
        open: true,
        message: 'Please select a ticket to validate',
        severity: 'warning',
      });
      return;
    }

    setLoading(true);
    try {
      // Get the secret from storage
      const secret = TOTPService.getSecretById(selectedSecretId);
      console.log('Validating token for secret:', {
        ticketId: selectedSecretId,
        token: cleanToken,
        secretFound: !!secret,
      });

      if (!secret) {
        setNotification({
          open: true,
          message: 'Selected ticket not found',
          severity: 'error',
        });
        setValidationResult(false);
        return;
      }

      // Check if the secret has expired
      if (secret.expiresAt && secret.expiresAt < Date.now()) {
        setNotification({
          open: true,
          message: 'This ticket has expired',
          severity: 'error',
        });
        setValidationResult(false);
        return;
      }

      // Get current token info and validate the entered token
      let isValid = false;
      try {
        // Get current token info for reference
        const tokenInfo = TOTPService.getCurrentTokenInfo(secret.secret);
        console.log('Current valid token info:', tokenInfo);

        // Set time left from token info
        setTimeLeft(tokenInfo.timeLeft);

        // Log tokens for debugging
        console.log('Current token for comparison:', tokenInfo.token);
        console.log('User entered token (cleaned):', cleanToken);

        // Try direct comparison first for exact matches
        if (cleanToken === tokenInfo.token) {
          console.log('Token matched exactly with current token');
          isValid = true;
        } else {
          // If direct comparison fails, use the enhanced verification method
          // which has multiple fallbacks and tolerance mechanisms
          isValid = TOTPService.verifyToken(cleanToken, secret.secret);
          console.log('Token validation with enhanced verification:', isValid);
        }

        // Set the validation result
        setValidationResult(isValid);

        if (isValid) {
          console.log('Token validated successfully!');
        } else {
          console.log('Token validation failed');
        }
      } catch (genError) {
        console.error('Error during token validation:', genError);
        isValid = false;
        setValidationResult(false);
      }

      // Notify parent component
      if (onValidationResult) {
        onValidationResult(isValid, secret.id);
      }

      setNotification({
        open: true,
        message: isValid
          ? 'Valid ticket! Entry approved.'
          : 'Invalid code. Please check the code and try again. Make sure you are using the latest code from your authenticator app.',
        severity: isValid ? 'success' : 'error',
      });
    } catch (error) {
      console.error('Error validating token:', error);
      setNotification({
        open: true,
        message:
          'Failed to validate token: ' + (error instanceof Error ? error.message : 'Unknown error'),
        severity: 'error',
      });
      setValidationResult(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSecretChange = (event: SelectChangeEvent<string>) => {
    setSelectedSecretId(event.target.value);
    // Reset validation result when changing ticket
    setValidationResult(null);
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
        Validate Ticket
      </Typography>

      <Box component="form" sx={{ mt: 2 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="ticket-select-label">Select Ticket</InputLabel>
          <Select
            labelId="ticket-select-label"
            value={selectedSecretId}
            label="Select Ticket"
            onChange={handleSecretChange}
          >
            {secrets.length === 0 ? (
              <MenuItem disabled value="">
                No tickets available
              </MenuItem>
            ) : (
              secrets.map(secret => (
                <MenuItem key={secret.id} value={secret.id}>
                  {secret.issuer} - {secret.label}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Enter 6-digit code"
          variant="outlined"
          value={token}
          onChange={e => {
            // Allow any input, we'll normalize it during validation
            // This makes it easier for users to paste codes with spaces or dashes
            const value = e.target.value.slice(0, 10); // Allow a bit more for formatting
            setToken(value);
          }}
          margin="normal"
          required
          error={token.length > 0 && token.replace(/[^0-9]/g, '').length !== 6}
          helperText={
            token.length > 0 && token.replace(/[^0-9]/g, '').length !== 6
              ? 'Code must contain 6 digits (spaces and dashes are allowed)'
              : ''
          }
          placeholder="e.g. 123456 or 123-456"
          inputProps={{
            inputMode: 'text', // Changed from numeric to allow for formatting
            maxLength: 10,
          }}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleValidateToken}
          disabled={loading || !token || token.replace(/[^0-9]/g, '').length !== 6}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Validate Code'}
        </Button>
      </Box>

      {validationResult !== null && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Divider sx={{ my: 2 }}>
            <Chip label="Validation Result" />
          </Divider>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 2,
              borderRadius: 2,
              bgcolor: validationResult ? 'success.light' : 'error.light',
              color: 'white',
            }}
          >
            {validationResult ? (
              <>
                <CheckCircleIcon sx={{ fontSize: 60, mb: 1 }} />
                <Typography variant="h6">Valid Ticket!</Typography>
                <Typography variant="body1" sx={{ mt: 1, fontWeight: 'bold' }}>
                  Entry Approved
                </Typography>
                {selectedSecretId && secrets.find(s => s.id === selectedSecretId) && (
                  <Box sx={{ mt: 2, textAlign: 'center', width: '100%' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {secrets
                        .find(s => s.id === selectedSecretId)
                        ?.issuer.replace('TruePass-', '')}
                    </Typography>
                    <Typography variant="body2">Ticket ID: {selectedSecretId}</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      This code is valid for {timeLeft} seconds
                    </Typography>
                  </Box>
                )}
              </>
            ) : (
              <>
                <CancelIcon sx={{ fontSize: 60, mb: 1 }} />
                <Typography variant="h6">Verification Failed</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  The code is invalid or has expired
                </Typography>
              </>
            )}
          </Box>

          {validationResult && (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Code expires in: {timeLeft} seconds
              </Typography>
            </Box>
          )}

          {!validationResult && selectedSecretId && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Ticket Details:
              </Typography>
              {secrets.find(s => s.id === selectedSecretId) && (
                <Typography variant="body2">
                  {secrets.find(s => s.id === selectedSecretId)?.issuer}
                </Typography>
              )}
            </Box>
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

export default TOTPValidator;
