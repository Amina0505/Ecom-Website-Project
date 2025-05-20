import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Collapse,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CreditCardIcon from '@mui/icons-material/CreditCard';

interface PaymentFormInputs {
  paymentMethod: 'card' | 'cod';
  cardName?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

interface PaymentFormProps {
  onSubmit: (data: PaymentFormInputs) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormInputs>();

  const onSubmitForm = (data: PaymentFormInputs) => {
    onSubmit({ ...data, paymentMethod });
  };

  const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(event.target.value as 'card' | 'cod');
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmitForm)} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Payment Method
      </Typography>

      <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
        <RadioGroup
          value={paymentMethod}
          onChange={handlePaymentMethodChange}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Paper
                sx={{
                  p: 2,
                  border: theme => `2px solid ${paymentMethod === 'card' ? theme.palette.primary.main : 'transparent'}`,
                  cursor: 'pointer',
                  '&:hover': { borderColor: 'primary.main' },
                }}
                onClick={() => setPaymentMethod('card')}
              >
                <FormControlLabel
                  value="card"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CreditCardIcon />
                      <Typography>Credit/Debit Card</Typography>
                    </Box>
                  }
                  sx={{ width: '100%', m: 0 }}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper
                sx={{
                  p: 2,
                  border: theme => `2px solid ${paymentMethod === 'cod' ? theme.palette.primary.main : 'transparent'}`,
                  cursor: 'pointer',
                  '&:hover': { borderColor: 'primary.main' },
                }}
                onClick={() => setPaymentMethod('cod')}
              >
                <FormControlLabel
                  value="cod"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalShippingIcon />
                      <Typography>Cash on Delivery</Typography>
                    </Box>
                  }
                  sx={{ width: '100%', m: 0 }}
                />
              </Paper>
            </Grid>
          </Grid>
        </RadioGroup>
      </FormControl>

      <Collapse in={paymentMethod === 'card'}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name on Card"
              {...register('cardName', {
                required: paymentMethod === 'card' ? 'Name on card is required' : false,
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                }
              })}
              error={!!errors.cardName}
              helperText={errors.cardName?.message}
              disabled={paymentMethod === 'cod'}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Card Number"
              {...register('cardNumber', {
                required: paymentMethod === 'card' ? 'Card number is required' : false,
                pattern: {
                  value: /^[0-9]{16}$/,
                  message: 'Please enter a valid 16-digit card number'
                }
              })}
              error={!!errors.cardNumber}
              helperText={errors.cardNumber?.message}
              disabled={paymentMethod === 'cod'}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Expiry Date"
              placeholder="MM/YY"
              {...register('expiryDate', {
                required: paymentMethod === 'card' ? 'Expiry date is required' : false,
                pattern: {
                  value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                  message: 'Please enter a valid date (MM/YY)'
                }
              })}
              error={!!errors.expiryDate}
              helperText={errors.expiryDate?.message}
              disabled={paymentMethod === 'cod'}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="CVV"
              type="password"
              {...register('cvv', {
                required: paymentMethod === 'card' ? 'CVV is required' : false,
                pattern: {
                  value: /^[0-9]{3,4}$/,
                  message: 'Please enter a valid CVV'
                }
              })}
              error={!!errors.cvv}
              helperText={errors.cvv?.message}
              disabled={paymentMethod === 'cod'}
            />
          </Grid>
        </Grid>
      </Collapse>

      {paymentMethod === 'cod' && (
        <Paper sx={{ p: 2, mt: 2, bgcolor: 'grey.50' }}>
          <Typography variant="body1" gutterBottom>
            Cash on Delivery Details:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Pay in cash when your order is delivered
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Make sure to have the exact amount ready
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Our delivery person will provide you with a receipt
          </Typography>
        </Paper>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        sx={{ mt: 3 }}
      >
        {paymentMethod === 'cod' ? 'Confirm Cash on Delivery' : 'Continue to Review'}
      </Button>
    </Box>
  );
};

export default PaymentForm; 