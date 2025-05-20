import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Card,
  CardContent,
  Divider,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

// Define types
interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShippingDetails {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  email: string;
}

interface PaymentDetails {
  method: 'card' | 'cod';
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Order {
  _id: string;
  userId: User | string;
  items: OrderItem[];
  shipping: ShippingDetails;
  payment: PaymentDetails;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'return-requested' | 'cancelled';
  returnReason?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderStats {
  statusCounts: Array<{
    _id: string;
    count: number;
    totalAmount: number;
  }>;
  ordersByDay: Array<{
    _id: string;
    count: number;
    totalAmount: number;
  }>;
  totalRevenue: number;
}

const OrderList: React.FC = () => {
  // State
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [statusUpdateOpen, setStatusUpdateOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const { user } = useAuth();

  // Status color mapping
  const statusColors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
    pending: 'warning',
    processing: 'info',
    shipped: 'primary',
    delivered: 'success',
    'return-requested': 'error',
    cancelled: 'default',
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('userToken') || localStorage.getItem('adminToken');
      
      // Construct the query with pagination and filters
      let url = `http://localhost:5000/api/orders/admin/all?page=${page + 1}&limit=${rowsPerPage}`;
      if (statusFilter) {
        url += `&status=${statusFilter}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setOrders(response.data.orders);
        setTotalOrders(response.data.total);
      } else {
        setError(response.data.message || 'Failed to fetch orders');
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      setError(error.response?.data?.message || 'An error occurred while fetching orders');
    } finally {
      setLoading(false);
    }
  };

  // Fetch order statistics
  const fetchOrderStats = async () => {
    try {
      const token = localStorage.getItem('userToken') || localStorage.getItem('adminToken');
      
      const response = await axios.get('http://localhost:5000/api/orders/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setOrderStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching order stats:', error);
      // We don't set error state here to avoid disrupting the orders table
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchOrders();
    fetchOrderStats();
  }, [page, rowsPerPage, statusFilter]);

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle status filter change
  const handleStatusFilterChange = (event: any) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  // View order details
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  // Open status update dialog
  const handleOpenStatusUpdate = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusUpdateOpen(true);
  };

  // Update order status
  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      setStatusUpdateLoading(true);
      const token = localStorage.getItem('userToken') || localStorage.getItem('adminToken');
      
      const response = await axios.put(
        `http://localhost:5000/api/orders/admin/${selectedOrder._id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Update the order in the local state
        setOrders(orders.map(order => 
          order._id === selectedOrder._id 
            ? { ...order, status: newStatus as any } 
            : order
        ));
        
        // Refresh stats
        fetchOrderStats();
        
        // Close the dialog
        setStatusUpdateOpen(false);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      // You could add an error state for the dialog here
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Refresh data
  const handleRefresh = () => {
    fetchOrders();
    fetchOrderStats();
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Render order status statistics
  const renderOrderStatistics = () => {
    if (!orderStats) return null;

    return (
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Total Revenue Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4" color="primary">
                {formatCurrency(orderStats.totalRevenue)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Excluding cancelled orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Status Counts */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Status
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                {orderStats.statusCounts.map((status) => (
                  <Chip
                    key={status._id}
                    label={`${status._id}: ${status.count}`}
                    color={statusColors[status._id as keyof typeof statusColors] || 'default'}
                    onClick={() => setStatusFilter(status._id)}
                    sx={{ fontWeight: 'bold' }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Order Management
        </Typography>
        <Button 
          startIcon={<RefreshIcon />} 
          onClick={handleRefresh}
          variant="outlined"
        >
          Refresh
        </Button>
      </Box>

      {/* Order Statistics */}
      {renderOrderStatistics()}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label">Filter by Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label="Filter by Status"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="return-requested">Return Requested</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Error display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Orders Table */}
      <Paper>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => {
                  const user = typeof order.userId === 'object' ? order.userId : { name: 'Unknown', email: 'Unknown' };
                  
                  return (
                    <TableRow 
                      key={order._id}
                      sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                    >
                      <TableCell>
                        {order._id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{user.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(order.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={order.status} 
                          color={statusColors[order.status]}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewDetails(order)}
                          title="View Details"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenStatusUpdate(order)}
                          title="Update Status"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalOrders}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Order Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              Order Details
              <Typography variant="subtitle2" color="text.secondary">
                ID: {selectedOrder._id}
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>Order Status</Typography>
                <Chip 
                  label={selectedOrder.status} 
                  color={statusColors[selectedOrder.status]}
                  sx={{ fontWeight: 'bold' }}
                />
                {selectedOrder.returnReason && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" color="error">Return Reason:</Typography>
                    <Typography variant="body2">{selectedOrder.returnReason}</Typography>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                  <Tab label="Items" />
                  <Tab label="Customer Info" />
                  <Tab label="Payment Details" />
                </Tabs>
                
                <Box sx={{ mt: 2, p: 1 }}>
                  {tabValue === 0 && (
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Item</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedOrder.items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Box
                                    component="img"
                                    src={item.image}
                                    alt={item.title}
                                    sx={{ width: 40, height: 40, mr: 2, objectFit: 'contain' }}
                                  />
                                  <Typography variant="body2">{item.title}</Typography>
                                </Box>
                              </TableCell>
                              <TableCell>{formatCurrency(item.price)}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={3} align="right">
                              <Typography variant="subtitle1">Total:</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="subtitle1">
                                {formatCurrency(selectedOrder.totalAmount)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}

                  {tabValue === 1 && (
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">Name</Typography>
                        <Typography variant="body2">
                          {selectedOrder.shipping.firstName} {selectedOrder.shipping.lastName}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">Email</Typography>
                        <Typography variant="body2">{selectedOrder.shipping.email}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">Phone</Typography>
                        <Typography variant="body2">{selectedOrder.shipping.phone}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2">Address</Typography>
                        <Typography variant="body2">
                          {selectedOrder.shipping.address}, {selectedOrder.shipping.city}, {selectedOrder.shipping.state} {selectedOrder.shipping.postalCode}
                        </Typography>
                      </Grid>
                    </Grid>
                  )}

                  {tabValue === 2 && (
                    <Box>
                      <Typography variant="subtitle2">Payment Method</Typography>
                      <Typography variant="body2">
                        {selectedOrder.payment.method === 'card' ? 'Credit Card' : 'Cash on Delivery'}
                      </Typography>
                      
                      {selectedOrder.payment.method === 'card' && (
                        <>
                          <Typography variant="subtitle2" sx={{ mt: 2 }}>Card Number</Typography>
                          <Typography variant="body2">
                            **** **** **** {selectedOrder.payment.cardNumber?.slice(-4) || 'XXXX'}
                          </Typography>
                          
                          <Typography variant="subtitle2" sx={{ mt: 2 }}>Card Holder</Typography>
                          <Typography variant="body2">
                            {selectedOrder.payment.cardName || 'N/A'}
                          </Typography>
                        </>
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsOpen(false)}>Close</Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => {
                  setDetailsOpen(false);
                  handleOpenStatusUpdate(selectedOrder);
                }}
              >
                Update Status
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog
        open={statusUpdateOpen}
        onClose={() => setStatusUpdateOpen(false)}
      >
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="status-update-label">Status</InputLabel>
            <Select
              labelId="status-update-label"
              value={newStatus}
              label="Status"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="shipped">Shipped</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="return-requested">Return Requested</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusUpdateOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateStatus} 
            variant="contained" 
            color="primary"
            disabled={statusUpdateLoading}
          >
            {statusUpdateLoading ? <CircularProgress size={24} /> : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderList; 