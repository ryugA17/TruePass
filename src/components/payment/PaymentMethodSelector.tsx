import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Divider
} from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';

interface PaymentMethodSelectorProps {
  price: number;
  onSelectMethod: (method: 'upi' | 'razorpay') => void;
  onCancel: () => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  price,
  onSelectMethod,
  onCancel
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'razorpay'>('razorpay');

  const handleMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMethod(event.target.value as 'upi' | 'razorpay');
  };

  const handleContinue = () => {
    onSelectMethod(selectedMethod);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Select Payment Method
      </Typography>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Amount to Pay: <strong>₹{price}</strong>
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" gutterBottom>
            Choose a payment method:
          </Typography>

          <RadioGroup
            value={selectedMethod}
            onChange={handleMethodChange}
            sx={{ mt: 2 }}
          >
            <Card
              variant="outlined"
              sx={{
                mb: 2,
                p: 1,
                border: selectedMethod === 'razorpay' ? '2px solid #3f51b5' : '1px solid #e0e0e0',
                bgcolor: selectedMethod === 'razorpay' ? 'rgba(63, 81, 181, 0.05)' : 'transparent'
              }}
            >
              <FormControlLabel
                value="razorpay"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CreditCardIcon sx={{ mr: 1, color: '#3f51b5' }} />
                    <Box>
                      <Typography variant="body1">Razorpay (Recommended)</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Pay using UPI, Credit/Debit Card, Net Banking, or Wallet
                      </Typography>
                    </Box>
                  </Box>
                }
                sx={{ width: '100%', m: 0 }}
              />
            </Card>

            <Card
              variant="outlined"
              sx={{
                mb: 2,
                p: 1,
                border: selectedMethod === 'upi' ? '2px solid #3f51b5' : '1px solid #e0e0e0',
                bgcolor: selectedMethod === 'upi' ? 'rgba(63, 81, 181, 0.05)' : 'transparent'
              }}
            >
              <FormControlLabel
                value="upi"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneAndroidIcon sx={{ mr: 1, color: '#3f51b5' }} />
                    <Box>
                      <Typography variant="body1">Direct UPI</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Pay directly to {process.env.REACT_APP_UPI_ID || 'chauhan0993yash@okaxis'} via any UPI app
                      </Typography>
                    </Box>
                  </Box>
                }
                sx={{ width: '100%', m: 0 }}
              />
            </Card>
          </RadioGroup>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              variant="outlined"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleContinue}
              startIcon={<CurrencyRupeeIcon />}
            >
              Continue
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentMethodSelector;
