import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const OrderConfirmation: React.FC = () => {
  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
      <Typography variant="h4" gutterBottom>
        Thank You for Your Order!
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Your order has been placed successfully. You will receive an email confirmation shortly.
      </Typography>
    </Box>
  );
};

export default OrderConfirmation; 