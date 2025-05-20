import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Alert,
  Button,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Pending as PendingIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
} from '@mui/icons-material';
import { sellerService } from '../../api';
import { ROUTES } from '../../config';

interface DashboardStats {
  pendingSubmissions: number;
  approvedSubmissions: number;
  rejectedSubmissions: number;
  activeProducts: number;
}

const initialStats: DashboardStats = {
  pendingSubmissions: 0,
  approvedSubmissions: 0,
  rejectedSubmissions: 0,
  activeProducts: 0,
};

const SellerOverview: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      const response = await sellerService.getDashboardStats();
      
      if (!response.stats) {
        console.error('Unexpected API response format:', response);
        setError('Unexpected response format from server');
        setLoading(false);
        return;
      }

      setStats(response.stats);
      setError(null);
    } catch (err: any) {
      console.error('Error details:', err);
      
      if (err.response) {
        console.error('Error response:', {
          status: err.response.status,
          data: err.response.data
        });
      }
      
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      console.error('Error fetching seller dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleCheckStatus = () => {
    navigate(ROUTES.SELLER_SUBMISSIONS);
  };

  const handleViewProducts = () => {
    navigate(ROUTES.SELLER_PRODUCTS);
  };

  const statCards = [
    {
      title: 'Active Products',
      value: stats.activeProducts,
      icon: <InventoryIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      color: 'success.light',
    },
    {
      title: 'Pending Submissions',
      value: stats.pendingSubmissions,
      icon: <PendingIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      color: 'warning.light',
    },
    {
      title: 'Approved Submissions',
      value: stats.approvedSubmissions,
      icon: <ApprovedIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      color: 'info.light',
    },
    {
      title: 'Rejected Submissions',
      value: stats.rejectedSubmissions,
      icon: <RejectedIcon sx={{ fontSize: 40, color: 'error.main' }} />,
      color: 'error.light',
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Seller Dashboard
      </Typography>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={fetchStats}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: 160,
                borderRadius: 2,
                boxShadow: 2,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 8,
                  height: '100%',
                  bgcolor: card.color,
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="subtitle2" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                    {card.value}
                  </Typography>
                </Box>
                <Box>{card.icon}</Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box mt={4}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Getting Started
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    1. Add Your Products
                  </Typography>
                  <Typography variant="body2">
                    Submit your products for review. Include high-quality images, accurate descriptions, and competitive pricing.
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ mt: 2 }}
                    onClick={() => navigate(ROUTES.SELLER_ADD_PRODUCT)}
                  >
                    Add Product
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    2. Wait for Approval
                  </Typography>
                  <Typography variant="body2">
                    Our team will review your submissions and approve them if they meet our quality standards.
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mt: 2 }}
                    onClick={handleCheckStatus}
                  >
                    Check Status
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    3. Manage Your Store
                  </Typography>
                  <Typography variant="body2">
                    Once approved, your products will be listed on our platform. Monitor your sales and update your inventory.
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mt: 2 }}
                    onClick={handleViewProducts}
                  >
                    View Products
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default SellerOverview; 