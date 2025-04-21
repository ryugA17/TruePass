import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  Paper,
  Divider,
  Alert,
} from '@mui/material';
import { TOTPService } from '../services/TOTPService';

const TestPage: React.FC = () => {
  const [secret, setSecret] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [generatedToken, setGeneratedToken] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Update time left
  useEffect(() => {
    const interval = setInterval(() => {
      const secondsLeft = 30 - (Math.floor(Date.now() / 1000) % 30);
      setTimeLeft(secondsLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const generateRandomSecret = () => {
    try {
      // Generate a random secret
      const randomBytes = new Uint8Array(20);
      window.crypto.getRandomValues(randomBytes);
      const newSecret = Buffer.from(randomBytes).toString('base64');
      setSecret(newSecret);
      setDebugInfo(`Generated new secret: ${newSecret.substring(0, 10)}...`);
    } catch (error) {
      console.error('Error generating secret:', error);
      setDebugInfo(
        `Error generating secret: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const generateToken = () => {
    if (!secret) {
      setDebugInfo('Please generate or enter a secret first');
      return;
    }

    try {
      const newToken = TOTPService.generateToken(secret);
      setGeneratedToken(newToken);
      setDebugInfo(`Generated token: ${newToken} (valid for ${timeLeft} seconds)`);
    } catch (error) {
      console.error('Error generating token:', error);
      setDebugInfo(
        `Error generating token: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const verifyToken = () => {
    if (!secret || !token) {
      setDebugInfo('Please enter both secret and token');
      return;
    }

    try {
      const result = TOTPService.verifyToken(token, secret);
      setIsValid(result);
      setDebugInfo(`Token verification result: ${result ? 'Valid' : 'Invalid'}`);
    } catch (error) {
      console.error('Error verifying token:', error);
      setDebugInfo(
        `Error verifying token: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      setIsValid(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          TOTP Debug Tool
        </Typography>
        <Typography paragraph>
          Use this page to test TOTP token generation and validation.
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Time Information
          </Typography>
          <Typography>Current time: {new Date().toLocaleTimeString()}</Typography>
          <Typography>Seconds until next token: {timeLeft}</Typography>
          <Typography>Current time step: {Math.floor(Date.now() / 1000 / 30)}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Secret Management
          </Typography>
          <TextField
            fullWidth
            label="TOTP Secret"
            variant="outlined"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={generateRandomSecret}
            sx={{ mt: 1, mr: 1 }}
          >
            Generate Random Secret
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Token Generation
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={generateToken}
            disabled={!secret}
            sx={{ mb: 2 }}
          >
            Generate Current Token
          </Button>
          {generatedToken && (
            <Alert severity="info" sx={{ mt: 1 }}>
              Generated Token: <strong>{generatedToken}</strong> (valid for {timeLeft} seconds)
            </Alert>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Token Verification
          </Typography>
          <TextField
            fullWidth
            label="Token to Verify"
            variant="outlined"
            value={token}
            onChange={e => {
              // Only allow digits and limit to 6 characters
              const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
              setToken(value);
            }}
            margin="normal"
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*',
              maxLength: 6,
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={verifyToken}
            disabled={!secret || !token || token.length !== 6}
            sx={{ mt: 1 }}
          >
            Verify Token
          </Button>
          {isValid !== null && (
            <Alert severity={isValid ? 'success' : 'error'} sx={{ mt: 2 }}>
              Token is {isValid ? 'valid' : 'invalid'}
            </Alert>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Debug Information:
          </Typography>
          <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
            {debugInfo}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default TestPage;
