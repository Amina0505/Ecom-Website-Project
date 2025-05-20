import React from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AddCircle as AddIcon,
  Inventory as InventoryIcon,
  QueryStats as StatsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const SellerSidebar: React.FC = () => {
  const menuItems = [
    {
      text: 'Overview',
      icon: <DashboardIcon />,
      path: '/seller/dashboard',
    },
    {
      text: 'Add Product',
      icon: <AddIcon />,
      path: '/seller/products/new',
    },
    {
      text: 'My Products',
      icon: <InventoryIcon />,
      path: '/seller/products',
    },
    {
      text: 'Submissions',
      icon: <StatsIcon />,
      path: '/seller/submissions',
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/seller/settings',
    },
  ];

  return (
    <Paper
      sx={{
        width: 240,
        minHeight: '80vh',
        borderRadius: 2,
        mr: 3,
        boxShadow: (theme) => theme.shadows[3],
      }}
    >
      <Box sx={{ p: 2 }}>
        <List>
          {menuItems.map((item) => (
            <React.Fragment key={item.text}>
              <ListItem disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    '&.active': {
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText',
                      '& .MuiListItemIcon-root': {
                        color: 'primary.contrastText',
                      },
                    },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
              {item.text === 'My Products' && <Divider sx={{ my: 1 }} />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default SellerSidebar; 