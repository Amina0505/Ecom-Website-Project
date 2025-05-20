import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { CartItem } from '../../contexts/CartContext';

interface OrderReviewProps {
  shippingData: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
  paymentData: {
    paymentMethod: 'card' | 'cod';
    cardNumber?: string;
    expiryDate?: string;
  };
  items: CartItem[];
  totalPrice: number;
}

const OrderReview: React.FC<OrderReviewProps> = ({
  shippingData,
  paymentData,
  items,
  totalPrice,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order Review
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Shipping Address
              </Typography>
              <Typography>
                {shippingData.firstName} {shippingData.lastName}
              </Typography>
              <Typography>{shippingData.address}</Typography>
              <Typography>
                {shippingData.city}, {shippingData.state} {shippingData.postalCode}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payment Details
              </Typography>
              <Typography>
                {paymentData.paymentMethod === 'cod' ? (
                  'Cash on Delivery'
                ) : (
                  <>
                    Card ending in {paymentData.cardNumber?.slice(-4)}
                    <br />
                    Expires: {paymentData.expiryDate}
                  </>
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
              {items.map((item) => (
                <Box key={item.id} sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={2}>
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{ width: '100%', maxWidth: '50px' }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>{item.title}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography>x{item.quantity}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Divider sx={{ my: 2 }} />
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Typography variant="h6">Total</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h6">${totalPrice.toFixed(2)}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderReview; 