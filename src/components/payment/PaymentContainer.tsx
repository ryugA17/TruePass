import React, { useState } from 'react';
import { Box } from '@mui/material';
import FallbackPaymentForm from './FallbackPaymentForm';
import RazorpayPaymentForm from './RazorpayPaymentForm';
import PaymentMethodSelector from './PaymentMethodSelector';

interface PaymentContainerProps {
  price: number;
  eventName: string;
  seatNumber: string;
  originalPrice: number;
  onSuccess: (paymentId: string) => void;
  onCancel: () => void;
}

type PaymentStep = 'select-method' | 'upi-payment' | 'razorpay-payment';

const PaymentContainer: React.FC<PaymentContainerProps> = ({
  price,
  eventName,
  seatNumber,
  originalPrice,
  onSuccess,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState<PaymentStep>('select-method');
  
  const handleSelectMethod = (method: 'upi' | 'razorpay') => {
    if (method === 'upi') {
      setCurrentStep('upi-payment');
    } else {
      setCurrentStep('razorpay-payment');
    }
  };
  
  const handlePaymentSuccess = (paymentId: string) => {
    onSuccess(paymentId);
  };
  
  const handleBackToMethodSelection = () => {
    setCurrentStep('select-method');
  };
  
  return (
    <Box>
      {currentStep === 'select-method' && (
        <PaymentMethodSelector
          price={price}
          onSelectMethod={handleSelectMethod}
          onCancel={onCancel}
        />
      )}
      
      {currentStep === 'upi-payment' && (
        <FallbackPaymentForm
          price={price}
          eventName={eventName}
          seatNumber={seatNumber}
          originalPrice={originalPrice}
          onSuccess={handlePaymentSuccess}
          onCancel={handleBackToMethodSelection}
        />
      )}
      
      {currentStep === 'razorpay-payment' && (
        <RazorpayPaymentForm
          price={price}
          eventName={eventName}
          seatNumber={seatNumber}
          originalPrice={originalPrice}
          onSuccess={handlePaymentSuccess}
          onCancel={handleBackToMethodSelection}
        />
      )}
    </Box>
  );
};

export default PaymentContainer;
