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
  Chip,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  IconButton,
  Tabs,
  Tab,
  Tooltip,
  Avatar,
} from '@mui/material';
import {
  CheckCircleOutline as ApproveIcon,
  HighlightOff as RejectIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import axios from 'axios';

interface Seller {
  _id: string;
  name: string;
  email: string;
  storeName: string;
}

interface ProductSubmission {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  seller: Seller;
  status: 'pending' | 'approved' | 'rejected';
  adminFeedback?: string;
  createdAt: string;
}

const ProductSubmissionList: React.FC = () => {
  const [submissions, setSubmissions] = useState<ProductSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [selectedSubmission, setSelectedSubmission] = useState<ProductSubmission | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, [tabValue]);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setError('Admin authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/admin/product-submissions?status=${tabValue}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSubmissions(response.data.submissions);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Failed to fetch submissions. Please try again.'
      );
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: 'pending' | 'approved' | 'rejected') => {
    setTabValue(newValue);
  };

  const handleViewSubmission = (submission: ProductSubmission) => {
    setSelectedSubmission(submission);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
  };

  const handleOpenRejectDialog = (submission: ProductSubmission) => {
    setSelectedSubmission(submission);
    setFeedback('');
    setRejectDialogOpen(true);
  };

  const handleCloseRejectDialog = () => {
    setRejectDialogOpen(false);
  };

  const handleOpenApproveDialog = (submission: ProductSubmission) => {
    setSelectedSubmission(submission);
    setFeedback('');
    setApproveDialogOpen(true);
  };

  const handleCloseApproveDialog = () => {
    setApproveDialogOpen(false);
  };

  const handleRejectSubmission = async () => {
    if (!selectedSubmission) return;
    
    if (!feedback.trim()) {
      setError('Feedback is required when rejecting a submission.');
      return;
    }
    
    setActionLoading(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setError('Admin authentication token not found. Please log in again.');
        setActionLoading(false);
        return;
      }

      await axios.post(
        `http://localhost:5000/api/admin/product-submissions/${selectedSubmission._id}/reject`,
        { feedback },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state to remove the rejected submission from the list
      if (tabValue === 'pending') {
        setSubmissions(submissions.filter(s => s._id !== selectedSubmission._id));
      }
      
      handleCloseRejectDialog();
      
      // Refresh the list if we're viewing rejected submissions
      if (tabValue === 'rejected') {
        fetchSubmissions();
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Failed to reject submission. Please try again.'
      );
      console.error('Error rejecting submission:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveSubmission = async () => {
    if (!selectedSubmission) return;
    
    setActionLoading(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setError('Admin authentication token not found. Please log in again.');
        setActionLoading(false);
        return;
      }

      await axios.post(
        `http://localhost:5000/api/admin/product-submissions/${selectedSubmission._id}/approve`,
        { feedback },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state to remove the approved submission from the list
      if (tabValue === 'pending') {
        setSubmissions(submissions.filter(s => s._id !== selectedSubmission._id));
      }
      
      handleCloseApproveDialog();
      
      // Refresh the list if we're viewing approved submissions
      if (tabValue === 'approved') {
        fetchSubmissions();
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Failed to approve submission. Please try again.'
      );
      console.error('Error approving submission:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading && submissions.length === 0) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        Product Submissions
      </Typography>
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}
      
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        sx={{ mb: 3 }}
      >
        <Tab value="pending" label={`Pending (${tabValue === 'pending' ? submissions.length : '...'})`} />
        <Tab value="approved" label="Approved" />
        <Tab value="rejected" label="Rejected" />
      </Tabs>
      
      {submissions.length === 0 ? (
        <Alert severity="info">
          No {tabValue} submissions found.
        </Alert>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Seller</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        variant="rounded"
                        src={submission.image}
                        alt={submission.title}
                        sx={{ width: 40, height: 40, mr: 2 }}
                      />
                      <Typography variant="body2" sx={{ maxWidth: 200 }} noWrap>
                        {submission.title}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {submission.category.charAt(0).toUpperCase() + 
                      submission.category.slice(1)}
                  </TableCell>
                  <TableCell>${submission.price.toFixed(2)}</TableCell>
                  <TableCell>{submission.stock}</TableCell>
                  <TableCell>
                    <Tooltip title={`${submission.seller.email}`}>
                      <Typography variant="body2">
                        {submission.seller.storeName || submission.seller.name}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{formatDate(submission.createdAt)}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewSubmission(submission)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      
                      {tabValue === 'pending' && (
                        <>
                          <Tooltip title="Approve">
                            <IconButton 
                              size="small" 
                              color="success"
                              onClick={() => handleOpenApproveDialog(submission)}
                            >
                              <ApproveIcon />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Reject">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleOpenRejectDialog(submission)}
                            >
                              <RejectIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* View Submission Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedSubmission && (
          <>
            <DialogTitle>
              Product Details
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                <Box sx={{ width: { xs: '100%', md: 300 } }}>
                  <img 
                    src={selectedSubmission.image} 
                    alt={selectedSubmission.title}
                    style={{ 
                      width: '100%', 
                      height: 'auto', 
                      maxHeight: 300,
                      objectFit: 'contain',
                      borderRadius: 8,
                    }}
                  />
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {selectedSubmission.title}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Category
                    </Typography>
                    <Typography variant="body1">
                      {selectedSubmission.category.charAt(0).toUpperCase() + 
                        selectedSubmission.category.slice(1)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Price
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      ${selectedSubmission.price.toFixed(2)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Stock Quantity
                    </Typography>
                    <Typography variant="body1">
                      {selectedSubmission.stock} units
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Seller Information
                    </Typography>
                    <Typography variant="body1">
                      {selectedSubmission.seller.storeName || selectedSubmission.seller.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedSubmission.seller.email}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Submission Date
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(selectedSubmission.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Product Description
                </Typography>
                <Typography variant="body2" paragraph sx={{ whiteSpace: 'pre-line' }}>
                  {selectedSubmission.description}
                </Typography>
              </Box>
              
              {selectedSubmission.status === 'rejected' && selectedSubmission.adminFeedback && (
                <Box sx={{ mt: 2, mb: 1 }}>
                  <Alert severity="error">
                    <Typography variant="subtitle2">Rejection Feedback:</Typography>
                    <Typography variant="body2">
                      {selectedSubmission.adminFeedback}
                    </Typography>
                  </Alert>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseViewDialog}>
                Close
              </Button>
              
              {tabValue === 'pending' && (
                <>
                  <Button 
                    variant="contained" 
                    color="success"
                    onClick={() => {
                      handleCloseViewDialog();
                      handleOpenApproveDialog(selectedSubmission);
                    }}
                  >
                    Approve
                  </Button>
                  <Button 
                    variant="contained" 
                    color="error"
                    onClick={() => {
                      handleCloseViewDialog();
                      handleOpenRejectDialog(selectedSubmission);
                    }}
                  >
                    Reject
                  </Button>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Reject Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={handleCloseRejectDialog}
      >
        <DialogTitle>Reject Product Submission</DialogTitle>
        <DialogContent>
          <DialogContentText gutterBottom>
            Please provide feedback for the seller explaining why this product was rejected.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Rejection Feedback"
            fullWidth
            multiline
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            error={feedback.trim() === ''}
            helperText={feedback.trim() === '' ? 'Feedback is required' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectDialog} disabled={actionLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleRejectSubmission} 
            color="error" 
            disabled={actionLoading || !feedback.trim()}
          >
            {actionLoading ? <CircularProgress size={24} /> : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Approve Dialog */}
      <Dialog
        open={approveDialogOpen}
        onClose={handleCloseApproveDialog}
      >
        <DialogTitle>Approve Product Submission</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve this product? It will be immediately available in the marketplace.
          </DialogContentText>
          <TextField
            margin="dense"
            label="Feedback (Optional)"
            fullWidth
            multiline
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            helperText="You can provide optional feedback for the seller"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseApproveDialog} disabled={actionLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleApproveSubmission} 
            color="success" 
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={24} /> : 'Approve'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ProductSubmissionList; 