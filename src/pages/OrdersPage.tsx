import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Divider,
  DialogContentText
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  shipping: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
  payment: {
    method: 'card' | 'cod';
    cardNumber?: string;
  };
  totalAmount: number;
  status: string;
  createdAt: string;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState('');
  const [openReturnDialog, setOpenReturnDialog] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.orders);
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnRequest = (order: Order) => {
    setSelectedOrder(order);
    setReturnDialogOpen(true);
  };

  const submitReturnRequest = async () => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.post(
        `http://localhost:5000/api/orders/${selectedOrder?._id}/return`,
        { reason: returnReason },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      // Refresh orders after return request
      fetchOrders();
      setReturnDialogOpen(false);
      setReturnReason('');
      setSelectedOrder(null);
    } catch (err) {
      setError('Failed to submit return request');
    }
  };

  const handleCancelOrder = (order: Order) => {
    setSelectedOrder(order);
    setOpenCancelDialog(true);
  };

  const submitCancelRequest = async () => {
    if (!selectedOrder) return;

    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/orders/${selectedOrder._id}/cancel`,
        {},
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setActionSuccess('Order cancelled successfully');
        fetchOrders(); // Refresh orders list
      }
    } catch (error: any) {
      console.error('Cancel order error:', error);
      setError(error.response?.data?.message || 'Error cancelling order');
    } finally {
      setOpenCancelDialog(false);
      setSelectedOrder(null);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'pending': '#f57c00',      // Orange
      'processing': '#1976d2',   // Blue
      'shipped': '#7b1fa2',      // Purple
      'delivered': '#2e7d32',    // Green
      'cancelled': '#d32f2f',    // Red
      'return-requested': '#ed6c02' // Deep Orange
    };
    return colors[status] || '#757575'; // Grey as default
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>

      {!isAuthenticated ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Please log in to view your orders
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/login')}
          >
            Log In
          </Button>
        </Paper>
      ) : (
        <>
          {actionSuccess && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setActionSuccess(null)}>
              {actionSuccess}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {loading ? (
            <CircularProgress />
          ) : orders.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography>No orders found</Typography>
            </Paper>
          ) : (
            orders.map((order) => (
              <Paper key={order._id} sx={{ p: 3, mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">
                        Order #{order._id.slice(-8)}
                      </Typography>
                      <Chip 
                        label={order.status.toUpperCase()} 
                        color={
                          order.status === 'delivered' ? 'success' :
                          order.status === 'shipped' ? 'info' :
                          order.status === 'processing' ? 'warning' :
                          'default'
                        }
                      />
                    </Box>
                    <Typography color="text.secondary" variant="body2">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    {order.items.map((item) => (
                      <Box key={item.id} sx={{ mb: 2 }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={2} sm={1}>
                            <img
                              src={item.image}
                              alt={item.title}
                              style={{ width: '100%', maxWidth: '50px' }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={8}>
                            <Typography>{item.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Quantity: {item.quantity}
                            </Typography>
                          </Grid>
                          <Grid item xs={4} sm={3} textAlign="right">
                            <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Typography variant="h6">
                        Total: ${order.totalAmount.toFixed(2)}
                      </Typography>
                      <Box>
                        {isAuthenticated && (
                          <>
                            {['pending', 'processing'].includes(order.status) && (
                              <Button
                                variant="outlined"
                                color="error"
                                onClick={() => handleCancelOrder(order)}
                                sx={{ mr: 1 }}
                              >
                                Cancel Order
                              </Button>
                            )}
                            {order.status === 'delivered' && (
                              <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => handleReturnRequest(order)}
                              >
                                Return Order
                              </Button>
                            )}
                          </>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            ))
          )}

          <Dialog open={returnDialogOpen} onClose={() => setReturnDialogOpen(false)}>
            <DialogTitle>Return Request</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Reason for Return"
                fullWidth
                multiline
                rows={4}
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setReturnDialogOpen(false)}>Cancel</Button>
              <Button onClick={submitReturnRequest} variant="contained" color="primary">
                Submit Return Request
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={openCancelDialog}
            onClose={() => setOpenCancelDialog(false)}
          >
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to cancel this order? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenCancelDialog(false)}>No, Keep Order</Button>
              <Button onClick={submitCancelRequest} color="error" variant="contained">
                Yes, Cancel Order
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  );
};

export default OrdersPage; 