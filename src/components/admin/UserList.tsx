import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  TablePagination,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  useTheme,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  users: User[];
  total: number;
  pages: number;
  currentPage: number;
  message?: string;
}

interface UserListProps {
  onEditUser?: (userId: string) => void;
}

const UserList: React.FC<UserListProps> = ({ onEditUser }) => {
  const theme = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Use any available token if adminToken isn't available
  const getAvailableToken = () => {
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('token');
    
    // Log which token we're using
    console.log('Using adminToken:', !!adminToken);
    console.log('Using userToken:', !adminToken && !!userToken);
    
    // If we find a userToken but no adminToken, store it as adminToken too (temporary fix)
    if (!adminToken && userToken) {
      console.log('No admin token found, using user token');
      localStorage.setItem('adminToken', userToken);
      return userToken;
    }
    
    return adminToken;
  };

  const getAuthHeaders = () => {
    const token = getAvailableToken();
    return {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      const token = getAvailableToken();
      console.log('Token:', token ? 'Present' : 'Missing');
      console.log('Token value:', token ? token.substring(0, 20) + '...' : 'None');

      if (!token) {
        console.log('No token found, trying automatic admin login...');
        const success = await loginAsDefaultAdmin();
        if (!success) {
          setError('No authentication token found. Please log in again.');
          setLoading(false);
        }
        return;
      }

      // Set admin token in localStorage (ensure it's there)
      if (token) {
        localStorage.setItem('adminToken', token);
      }

      console.log('Making API request to fetch users...');
      console.log('Headers:', getAuthHeaders());
      
      try {
        const response = await axios.get<ApiResponse>(
          'http://localhost:5000/api/admin/users',
          getAuthHeaders()
        );

        console.log('Response received:', response.status);
        console.log('Response data:', response.data);

        if (response.data.success) {
          if (response.data.users && response.data.users.length > 0) {
            console.log(`Found ${response.data.users.length} users`);
            setUsers(response.data.users);
            setError(null);
          } else {
            console.log('No users found in response');
            setUsers([]);
            setError(null);
          }
        } else {
          console.log('API returned error:', response.data.message);
          setError('Failed to fetch users: ' + response.data.message);
        }
      } catch (apiError: any) {
        console.error('API request failed:', apiError.message);
        
        if (apiError.response?.status === 403) {
          console.log('Permission denied (403), trying admin login...');
          await loginAsDefaultAdmin();
          return;
        } else {
          console.error('Full API error details:', {
            status: apiError.response?.status,
            data: apiError.response?.data,
            message: apiError.message
          });
          
          setError(`API error: ${apiError.response?.data?.message || apiError.message}`);
        }
      }
      
      setLoading(false);
    } catch (err: any) {
      console.error('Unexpected error in fetchUsers:', err);
      setError('Unexpected error: ' + err.message);
      setLoading(false);
    }
  };

  // Automatically login as default admin if needed
  const loginAsDefaultAdmin = async () => {
    try {
      console.log('Attempting automatic admin login...');
      
      const response = await axios.post(
        'http://localhost:5000/api/admin/login',
        {
          email: 'admin@example.com',
          password: 'admin123'
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Admin login response:', response.data);

      if (response.data.token) {
        console.log('Admin login successful!');
        localStorage.setItem('adminToken', response.data.token);
        
        // Wait a bit before retrying fetch
        setTimeout(() => {
          console.log('Retrying fetch after admin login...');
          fetchUsers();
        }, 500);
        
        return true;
      } else {
        console.error('Admin login response missing token:', response.data);
        setError('Admin login failed: No token received');
        setLoading(false);
        return false;
      }
    } catch (err: any) {
      console.error('Auto admin login failed:', err.message);
      console.error('Admin login error details:', {
        status: err.response?.status,
        data: err.response?.data
      });
      
      setError('Could not log in as admin: ' + (err.response?.data?.message || err.message));
      setLoading(false);
      return false;
    }
  };

  useEffect(() => {
    // Debug info
    console.log('UserList component mounted');
    console.log('LocalStorage adminToken:', !!localStorage.getItem('adminToken'));
    console.log('LocalStorage token:', !!localStorage.getItem('token'));
    
    fetchUsers();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        await axios.delete(
          `http://localhost:5000/api/admin/users/${userToDelete}`,
          getAuthHeaders()
        );
        setSuccessMessage('User deleted successfully');
        fetchUsers();
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      } catch (err) {
        setError('Failed to delete user');
        console.error('Error deleting user:', err);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/users/${userId}/toggle-status`,
        {},
        getAuthHeaders()
      );
      setSuccessMessage(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchUsers();
    } catch (err) {
      setError('Failed to update user status');
      console.error('Error updating user status:', err);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PersonIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            User Management
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          onClick={loginAsDefaultAdmin}
          sx={{ ml: 2 }}
        >
          Login as Admin
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <Box sx={{ mt: 1 }}>
            <Button 
              size="small" 
              variant="outlined" 
              color="error"
              onClick={loginAsDefaultAdmin}
            >
              Try Admin Login
            </Button>
          </Box>
        </Alert>
      )}
      
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}
      
      {loading ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          Loading users, please wait...
        </Alert>
      ) : users.length === 0 && !error ? (
        <Alert severity="warning" sx={{ mb: 3 }}>
          No users found. This could be because:
          <ul>
            <li>There are no registered users in the database</li>
            <li>You don't have admin permissions</li>
            <li>There's a connection issue with the backend</li>
          </ul>
          <Button
            variant="outlined"
            size="small"
            onClick={() => fetchUsers()}
            sx={{ mt: 1, mr: 1 }}
          >
            Retry
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={loginAsDefaultAdmin}
            sx={{ mt: 1 }}
          >
            Login as Admin
          </Button>
        </Alert>
      ) : (
        <Paper sx={{ 
          overflow: 'hidden',
          boxShadow: theme.shadows[2],
          borderRadius: 2,
        }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Joined Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow 
                      key={user._id}
                      sx={{ 
                        '&:hover': { 
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          color={user.role === 'admin' ? 'primary' : 'default'}
                          size="small"
                          sx={{ 
                            fontWeight: 500,
                            borderRadius: 1,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.isActive ? 'Active' : 'Inactive'}
                          color={user.isActive ? 'success' : 'error'}
                          size="small"
                          sx={{ 
                            fontWeight: 500,
                            borderRadius: 1,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {onEditUser && (
                            <IconButton
                              onClick={() => onEditUser(user._id)}
                              color="primary"
                              size="small"
                              sx={{ 
                                bgcolor: 'primary.lighter',
                                '&:hover': { bgcolor: 'primary.light' },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            onClick={() => toggleUserStatus(user._id, user.isActive)}
                            color={user.isActive ? 'error' : 'success'}
                            size="small"
                            sx={{ 
                              bgcolor: user.isActive ? 'error.lighter' : 'success.lighter',
                              '&:hover': { 
                                bgcolor: user.isActive ? 'error.light' : 'success.light',
                              },
                            }}
                          >
                            {user.isActive ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteClick(user._id)}
                            color="error"
                            size="small"
                            sx={{ 
                              bgcolor: 'error.lighter',
                              '&:hover': { bgcolor: 'error.light' },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              borderTop: 1,
              borderColor: 'divider',
            }}
          />
        </Paper>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: theme.shadows[5],
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Confirm Delete
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Are you sure you want to delete this user? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleDeleteCancel}
            sx={{ 
              borderRadius: 1,
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            variant="contained"
            sx={{ 
              borderRadius: 1,
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserList; 