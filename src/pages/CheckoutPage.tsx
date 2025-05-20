import React, { useState } from 'react';
import {
  Container,
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Paper,
  Typography,
} from '@mui/material';
import axios from 'axios';
import ShippingForm from '../components/checkout/ShippingForm';
import PaymentForm from '../components/checkout/PaymentForm';
import OrderReview from '../components/checkout/OrderReview';
import OrderConfirmation from '../components/checkout/OrderConfirmation';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ShippingData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  email: string;
}

interface PaymentData {
  paymentMethod: 'card' | 'cod';
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
}

const steps = ['Shipping', 'Payment', 'Review', 'Confirmation'];

const CheckoutPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleShippingSubmit = (data: ShippingData) => {
    setShippingData(data);
    handleNext();
  };

  const handlePaymentSubmit = (data: PaymentData) => {
    setPaymentData(data);
    handleNext();
  };

  const handlePlaceOrder = async () => {
    if (!shippingData || !paymentData) return;

    try {
      const orderData = {
        items,
        shipping: shippingData,
        payment: {
          method: paymentData.paymentMethod,
          ...(paymentData.paymentMethod === 'card' && {
            cardNumber: paymentData.cardNumber?.slice(-4), // Only store last 4 digits
            cardName: paymentData.cardName,
            expiryDate: paymentData.expiryDate,
          }),
        },
        totalAmount: totalPrice,
        userId: user?._id,
      };

      const response = await axios.post(
        'http://localhost:5000/api/orders',
        orderData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );

      if (response.data.success) {
        clearCart();
        handleNext();
      }
    } catch (error) {
      console.error('Error placing order:', error);
      // Handle error (show error message)
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <ShippingForm onSubmit={handleShippingSubmit} />;
      case 1:
        return <PaymentForm onSubmit={handlePaymentSubmit} />;
      case 2:
        return shippingData && paymentData ? (
          <OrderReview
            shippingData={shippingData}
            paymentData={paymentData}
            items={items}
            totalPrice={totalPrice}
          />
        ) : null;
      case 3:
        return <OrderConfirmation />;
      default:
        return 'Unknown step';
    }
  };

  if (items.length === 0 && activeStep !== 3) {
    navigate('/cart');
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4 }}>
          {getStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            {activeStep !== 0 && activeStep !== 3 && (
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
            )}
            {activeStep === 2 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handlePlaceOrder}
              >
                Place Order
              </Button>
            ) : activeStep === 3 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </Button>
            ) : null}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CheckoutPage; 