import React, { useState, useEffect, useCallback } from 'react';
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
import { TOTPService, TOTPSecret as StandardTOTPSecret } from '../../services/TOTPService';
import { BlockchainTOTPService } from '../../services/BlockchainTOTPService';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { authenticator } from 'otplib';

// Configure authenticator directly (similar to working example)
authenticator.options = {
  digits: 6,
  step: 30,
  window: 1, // Use a smaller window for stricter validation
};

// Create a unified TOTPSecret type that includes blockchain properties
type TOTPSecret = StandardTOTPSecret & {
  blockchain?: boolean;
  tokenId?: string;
  secretHash?: string;
};

interface TOTPValidatorProps {
  onValidationResult?: (result: boolean, ticketId?: string) => void;
}

// Add a utility function for base32 conversion, which might be needed
const convertToBase32IfNeeded = (secret: string): string => {
  // Check if the secret is already base32
  const isBase32 = /^[A-Z2-7]+=*$/i.test(secret);

  if (isBase32) {
    console.log('Secret already appears to be Base32');
    return secret;
  }

  try {
    // Try to convert from base64 to base32
    console.log('Attempting to convert secret to Base32');
    // Simple version - just get valid Base32 characters
    return secret.replace(/[^A-Z2-7]/gi, '').toUpperCase();
  } catch (error) {
    console.error('Error converting to Base32:', error);
    return secret; // Return original if conversion fails
  }
};

const TOTPValidator: React.FC<TOTPValidatorProps> = ({ onValidationResult }) => {
  const [token, setToken] = useState('');
  const [selectedSecretId, setSelectedSecretId] = useState<string>('');
  const [secrets, setSecrets] = useState<TOTPSecret[]>([]);
  const [validationResult, setValidationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(Math.floor(Date.now() / 1000));
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'info' | 'warning' | 'error',
  });

  // Load secrets from local storage
  useEffect(() => {
    const loadSecrets = () => {
      // Load both types of secrets
      const standardSecrets = TOTPService.getSecrets().map(secret => ({
        ...secret,
        blockchain: false,
      }));

      const blockchainSecrets = BlockchainTOTPService.getSecrets().map(secret => ({
        ...secret,
        blockchain: true,
      }));

      // Combine the secrets
      const allSecrets = [...standardSecrets, ...blockchainSecrets];
      console.log(
        'Loaded secrets:',
        allSecrets.length,
        allSecrets.map(s => ({ id: s.id, issuer: s.issuer }))
      );
      setSecrets(allSecrets);
    };

    loadSecrets();

    // Clear expired secrets from both services
    const standardClearedCount = TOTPService.clearExpiredSecrets();
    const blockchainClearedCount = BlockchainTOTPService.clearExpiredSecrets();

    if (standardClearedCount > 0 || blockchainClearedCount > 0) {
      loadSecrets();
    }
  }, []);

  // Update time left for token
  useEffect(() => {
    if (!validationResult?.success) return;

    // Initial calculation
    const secondsLeft = 30 - (Math.floor(Date.now() / 1000) % 30);
    setTimeLeft(secondsLeft);

    // Update every second
    const interval = setInterval(() => {
      const secondsLeft = 30 - (Math.floor(Date.now() / 1000) % 30);
      setTimeLeft(secondsLeft);

      // If we reach zero, the token has expired and is no longer valid
      if (secondsLeft === 0) {
        // Clear the validation result after a brief delay to allow the UI to show 0
        setTimeout(() => {
          setValidationResult(null);
          clearInterval(interval);
        }, 1000);
      }
    }, 1000);

    // Clean up interval on unmount or when validation result changes
    return () => clearInterval(interval);
  }, [validationResult]);

  // Keep the current time updated
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  const handleValidateToken = useCallback(async () => {
    console.log('===== Starting token validation =====');
    console.log('Current authenticator options:', authenticator.options);
    setLoading(true);
    let validationSuccess = false;
    let resultForNotification: { success: boolean; message: string } | null = null;

    try {
      // Normalize token to digits only
      const normalizedToken = token.replace(/[^0-9]/g, '');

      if (!normalizedToken || normalizedToken.length !== 6) {
        const result = {
          success: false,
          message: 'Please enter a valid 6-digit code from your authenticator app',
        };
        setValidationResult(result);
        resultForNotification = result;
        return;
      }

      if (!selectedSecretId) {
        const result = {
          success: false,
          message: 'Please select a secret to validate against',
        };
        setValidationResult(result);
        resultForNotification = result;
        return;
      }

      const secret = secrets.find(s => s.id === selectedSecretId);
      if (!secret) {
        const result = {
          success: false,
          message: 'Selected secret not found',
        };
        setValidationResult(result);
        resultForNotification = result;
        return;
      }

      console.log('Validating token:', normalizedToken);
      console.log('Secret:', secret.secret.substring(0, 5) + '...');

      // SIMPLIFIED VALIDATION - direct approach from working repository
      try {
        // First try with original secret
        let isValid = authenticator.verify({
          token: normalizedToken,
          secret: secret.secret,
        });

        console.log('Direct validation result with original secret:', isValid);

        // If that failed, try with base32 conversion
        if (!isValid) {
          const base32Secret = convertToBase32IfNeeded(secret.secret);
          console.log('Converted to Base32:', base32Secret);

          // Only try if conversion produced a different result
          if (base32Secret !== secret.secret) {
            isValid = authenticator.verify({
              token: normalizedToken,
              secret: base32Secret,
            });
            console.log('Direct validation result with base32 secret:', isValid);
          }
        }

        if (isValid) {
          const result = {
            success: true,
            message: 'Token validated successfully!',
          };
          setValidationResult(result);
          resultForNotification = result;
          validationSuccess = true;

          // Clear the token input on successful validation
          setToken('');

          // Call the validation result callback if provided
          if (onValidationResult) {
            onValidationResult(true, secret.id);
          }
        } else {
          const result = {
            success: false,
            message: 'Invalid token. Please try again.',
          };
          setValidationResult(result);
          resultForNotification = result;

          // Call the validation result callback if provided
          if (onValidationResult) {
            onValidationResult(false, secret.id);
          }
        }
      } catch (validationError) {
        console.error('Error during direct validation:', validationError);

        // Fallback to service layer validation if direct validation fails
        const isValid = secret.blockchain
          ? BlockchainTOTPService.verifyToken(normalizedToken, secret.secret)
          : TOTPService.verifyToken(normalizedToken, secret.secret);

        console.log('Fallback validation result:', isValid);

        if (isValid) {
          const result = {
            success: true,
            message: 'Token validated successfully! (fallback)',
          };
          setValidationResult(result);
          resultForNotification = result;
          validationSuccess = true;

          // Clear the token input on successful validation
          setToken('');

          // Call the validation result callback if provided
          if (onValidationResult) {
            onValidationResult(true, secret.id);
          }
        } else {
          const result = {
            success: false,
            message: 'Invalid token. Please try again.',
          };
          setValidationResult(result);
          resultForNotification = result;

          // Call the validation result callback if provided
          if (onValidationResult) {
            onValidationResult(false, secret.id);
          }
        }
      }
    } catch (error) {
      console.error('Error validating token:', error);
      const result = {
        success: false,
        message: `Validation error: ${error instanceof Error ? error.message : String(error)}`,
      };
      setValidationResult(result);
      resultForNotification = result;

      // Call the validation result callback with failure
      if (onValidationResult) {
        onValidationResult(false, selectedSecretId);
      }
    } finally {
      setLoading(false);

      // Show notification if we have a result to display
      if (resultForNotification) {
        setNotification({
          open: true,
          message: resultForNotification.message,
          severity: resultForNotification.success ? 'success' : 'error',
        });

        // Auto-hide notification after 5 seconds if successful
        if (validationSuccess) {
          setTimeout(() => {
            setNotification(prev => ({ ...prev, open: false }));
          }, 5000);
        }
      }
    }
  }, [token, selectedSecretId, secrets, onValidationResult]);

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
            inputMode: 'text', // Allow text input for formatting characters
            maxLength: 10,
          }}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleValidateToken}
          disabled={
            loading || !selectedSecretId || !token || token.replace(/[^0-9]/g, '').length !== 6
          }
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Validate Code'}
        </Button>

        {/* Debug button for direct validation */}
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          onClick={() => {
            if (!selectedSecretId || !token) return;

            const secret = secrets.find(s => s.id === selectedSecretId);
            if (!secret) return;

            const normalizedToken = token.replace(/[^0-9]/g, '');
            console.log('Direct debug validation:');
            console.log('- Token:', normalizedToken);
            console.log('- Secret:', secret.secret);

            try {
              // Try with both original and base32 converted secret
              const originalSecretValid = authenticator.verify({
                token: normalizedToken,
                secret: secret.secret,
              });
              console.log('- Original secret validation result:', originalSecretValid);

              // Try with Base32 conversion
              const base32Secret = convertToBase32IfNeeded(secret.secret);
              console.log('- Converted to Base32:', base32Secret);

              const base32SecretValid =
                base32Secret !== secret.secret
                  ? authenticator.verify({
                      token: normalizedToken,
                      secret: base32Secret,
                    })
                  : originalSecretValid;

              console.log('- Base32 secret validation result:', base32SecretValid);

              const isValid = originalSecretValid || base32SecretValid;

              // Show result in notification
              setNotification({
                open: true,
                message: isValid ? 'Debug validation: SUCCESS!' : 'Debug validation: FAILED!',
                severity: isValid ? 'success' : 'error',
              });
            } catch (error) {
              console.error('- Error in direct validation:', error);
              setNotification({
                open: true,
                message: `Debug validation error: ${error instanceof Error ? error.message : String(error)}`,
                severity: 'error',
              });
            }
          }}
          sx={{ mt: 1 }}
          disabled={loading || !selectedSecretId || !token}
        >
          Debug Validation
        </Button>

        {/* Add a debug timing display that updates every second */}
        <Box sx={{ mt: 1, textAlign: 'center', fontSize: '0.75rem', color: 'text.secondary' }}>
          Current time: {currentTime} ({new Date().toLocaleTimeString()})
        </Box>
      </Box>

      {validationResult && (
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
              bgcolor: validationResult.success ? 'success.light' : 'error.light',
              color: 'white',
            }}
          >
            {validationResult.success ? (
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
                  {validationResult.message}
                </Typography>
              </>
            )}
          </Box>

          {validationResult.success && (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Code expires in: {timeLeft} seconds
              </Typography>
            </Box>
          )}

          {!validationResult.success && selectedSecretId && (
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
