import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
  Paper,
} from '@mui/material';
import {
  Menu as MenuIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  LocalShipping as LocalShippingIcon,
} from '@mui/icons-material';
import UserList from './UserList';
import ProductList from './ProductList';
import ProductSubmissions from '../../pages/admin/ProductSubmissions';
import OrderList from './OrderList';

const drawerWidth = 240;

const AdminDashboard: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<'dashboard' | 'users' | 'products' | 'orders' | 'submissions'>('dashboard');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, section: 'dashboard' },
    { text: 'Orders', icon: <LocalShippingIcon />, section: 'orders' },
    { text: 'Users', icon: <PeopleIcon />, section: 'users' },
    { text: 'Products', icon: <ShoppingCartIcon />, section: 'products' },
    { text: 'Submissions', icon: <InventoryIcon />, section: 'submissions' },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap>
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => setCurrentSection(item.section as any)}
              selected={currentSection === item.section}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const renderContent = () => {
    switch (currentSection) {
      case 'users':
        return <UserList />;
      case 'products':
        return <ProductList onEditProduct={() => {}} />;
      case 'submissions':
        return <ProductSubmissions />;
      case 'orders':
        return <OrderList />;
      default:
        return (
          <Typography variant="h6" component="h2">
            {currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}
          </Typography>
        );
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        minHeight: 'calc(100vh - 64px)', // Subtract top navbar height
        bgcolor: 'grey.100',
        mt: '64px', // Add margin for top navbar
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Box
        component="nav"
        sx={{ 
          width: { sm: drawerWidth }, 
          flexShrink: { sm: 0 },
          height: 'calc(100vh - 64px)', // Adjust height
          position: 'fixed', // Fix the sidebar
          top: '64px', // Position below top navbar
          left: 0,
          zIndex: 2,
        }}
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              height: 'calc(100% - 64px)', // Adjust drawer paper height
              top: '64px', // Position below top navbar
              borderRight: '1px solid rgba(0, 0, 0, 0.12)',
              boxShadow: 3,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` }, // Add margin to prevent content overlap
          minHeight: 'calc(100vh - 64px)', // Adjust height
          bgcolor: 'grey.50',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Container maxWidth="lg">
          {renderContent()}
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboard;