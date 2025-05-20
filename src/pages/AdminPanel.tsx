import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  styled,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import ProductList from '../components/admin/ProductList';
import AddProduct from '../components/admin/AddProduct';
import EditProduct from '../components/admin/EditProduct';

const AdminContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const TabPanel = styled(Box)({
  padding: '24px 0',
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CustomTabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <TabPanel
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
    >
      {value === index && children}
    </TabPanel>
  );
};

const AdminPanel: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [editProductId, setEditProductId] = useState<string | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleEditProduct = (productId: string) => {
    setEditProductId(productId);
    setCurrentTab(2); // Switch to edit tab
  };

  return (
    <AdminContainer maxWidth="xl">
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="admin navigation tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            icon={<DashboardIcon />}
            label="Products"
            iconPosition="start"
          />
          <Tab
            icon={<AddIcon />}
            label="Add Product"
            iconPosition="start"
          />
          <Tab
            icon={<EditIcon />}
            label="Edit Product"
            iconPosition="start"
            disabled={!editProductId}
          />
        </Tabs>

        <CustomTabPanel value={currentTab} index={0}>
          <ProductList onEditProduct={handleEditProduct} />
        </CustomTabPanel>

        <CustomTabPanel value={currentTab} index={1}>
          <AddProduct onSuccess={() => setCurrentTab(0)} />
        </CustomTabPanel>

        <CustomTabPanel value={currentTab} index={2}>
          {editProductId && (
            <EditProduct
              productId={editProductId}
              onSuccess={() => {
                setCurrentTab(0);
                setEditProductId(null);
              }}
            />
          )}
        </CustomTabPanel>
      </Paper>
    </AdminContainer>
  );
};

export default AdminPanel; 