import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, CardHeader, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[10],
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: theme.spacing(2, 0),
  '& svg': {
    fontSize: 50,
    color: theme.palette.primary.main,
  },
}));

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Dashboard statistics (would be fetched from API in a real application)
  const stats = {
    pendingApprovals: 12,
    totalProducts: 156,
    totalUsers: 89,
    totalSellers: 24
  };

  // Define the dashboard cards with their respective icons and routes
  const dashboardCards = [
    {
      title: 'Product Submissions',
      description: `${stats.pendingApprovals} pending approvals`,
      icon: <AssignmentTurnedInIcon />,
      route: '/admin/product-submissions'
    },
    {
      title: 'Product Management',
      description: `${stats.totalProducts} products listed`,
      icon: <InventoryIcon />,
      route: '/admin/products'
    },
    {
      title: 'User Management',
      description: `${stats.totalUsers} registered users`,
      icon: <PeopleIcon />,
      route: '/admin/users'
    },
    {
      title: 'System Settings',
      description: 'Configure application settings',
      icon: <SettingsIcon />,
      route: '/admin/settings'
    }
  ];

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <DashboardIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">Admin Dashboard</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Welcome to the admin dashboard. Manage products, users, and monitor site activity.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {dashboardCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StyledCard>
              <CardHeader
                title={card.title}
                titleTypographyProps={{ variant: 'h6' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <IconWrapper>
                  {card.icon}
                </IconWrapper>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => handleCardClick(card.route)}
                >
                  Manage
                </Button>
              </Box>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminDashboard; 