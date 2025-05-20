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
  Button, 
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Card,
  CardMedia,
  CardContent,
  Divider
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';

interface Seller {
  _id: string;
  name: string;
  email: string;
  storeName?: string;
}

interface Submission {
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
  updatedAt: string;
}

const ProductSubmissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState<'pending' | 'approved' | 'rejected'>('pending');

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
      
      const response = await axios.get(
        `http://localhost:5000/api/admin/product-submissions?status=${tabValue}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log('Fetched submissions:', response.data);
      setSubmissions(response.data.submissions || []);
    } catch (err: any) {
      console.error('Error fetching submissions:', err);
      setError(err.response?.data?.message || 'Failed to load submissions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: 'pending' | 'approved' | 'rejected') => {
    setTabValue(newValue);
  };

  const handleViewDetails = (submission: Submission) => {
    setSelectedSubmission(submission);
    setDialogOpen(true);
  };

  const handleApprove = async (submission: Submission) => {
    setSelectedSubmission(submission);
    setActionLoading(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setError('Admin authentication token not found. Please log in again.');
        setActionLoading(false);
        return;
      }
      
      console.log('Approving submission:', submission._id);
      
      const response = await axios.post(
        `http://localhost:5000/api/admin/product-submissions/${submission._id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log('Approval response complete:', response.data);
      console.log('New product created:', response.data.product);
      
      // Remove from pending list if we're on pending tab
      if (tabValue === 'pending') {
        setSubmissions(submissions.filter(sub => sub._id !== submission._id));
      }
      
      setSuccessMessage('Product approved successfully!');
      
      // Close dialog if open
      if (dialogOpen) setDialogOpen(false);
    } catch (err: any) {
      console.error('Error approving submission:', err);
      setError(err.response?.data?.message || 'Failed to approve product. Please try again.');
    } finally {
      setActionLoading(false);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleReject = (submission: Submission) => {
    setSelectedSubmission(submission);
    setRejectDialogOpen(true);
  };

  const confirmReject = async () => {
    if (!selectedSubmission) return;
    
    if (!rejectionReason.trim()) {
      setError('Please provide feedback for the rejection');
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
      
      const response = await axios.post(
        `http://localhost:5000/api/admin/product-submissions/${selectedSubmission._id}/reject`,
        { feedback: rejectionReason },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log('Rejection response:', response.data);
      
      // Remove from pending list if we're on pending tab
      if (tabValue === 'pending') {
        setSubmissions(submissions.filter(sub => sub._id !== selectedSubmission._id));
      }
      
      setSuccessMessage('Product rejected successfully.');
      
      // Close dialogs
      setRejectDialogOpen(false);
      if (dialogOpen) setDialogOpen(false);
      
      // Reset rejection reason
      setRejectionReason('');
    } catch (err: any) {
      console.error('Error rejecting submission:', err);
      setError(err.response?.data?.message || 'Failed to reject product. Please try again.');
    } finally {
      setActionLoading(false);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
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
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Product Submissions
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Review and manage product submissions from sellers.
        </Typography>
        
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ mb: 3 }}
        >
          <Tab label="Pending" value="pending" />
          <Tab label="Approved" value="approved" />
          <Tab label="Rejected" value="rejected" />
        </Tabs>
        
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {submissions.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No {tabValue} submissions found.
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography variant="subtitle2">Product</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2">Category</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2">Seller</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2">Price</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2">Submitted Date</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2">Status</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2">Actions</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission._id}>
                    <TableCell>{submission.title}</TableCell>
                    <TableCell>
                      {submission.category.charAt(0).toUpperCase() + submission.category.slice(1)}
                    </TableCell>
                    <TableCell>
                      {submission.seller.storeName || submission.seller.name}
                    </TableCell>
                    <TableCell>${submission.price.toFixed(2)}</TableCell>
                    <TableCell>{formatDate(submission.createdAt)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={submission.status} 
                        color={
                          submission.status === 'approved' ? 'success' :
                          submission.status === 'rejected' ? 'error' : 'warning'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleViewDetails(submission)}
                        >
                          View
                        </Button>
                        
                        {tabValue === 'pending' && (
                          <>
                            <Button
                              size="small"
                              color="success"
                              startIcon={<CheckCircleIcon />}
                              onClick={() => handleApprove(submission)}
                              disabled={actionLoading}
                            >
                              Approve
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              startIcon={<CancelIcon />}
                              onClick={() => handleReject(submission)}
                              disabled={actionLoading}
                            >
                              Reject
                            </Button>
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
      </Paper>

      {/* View Submission Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Product Submission Details</DialogTitle>
        <DialogContent>
          {selectedSubmission && (
            <Box sx={{ mt: 2 }}>
              <Card sx={{ mb: 3 }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={selectedSubmission.image}
                  alt={selectedSubmission.title}
                  sx={{ objectFit: 'contain', bgcolor: '#f5f5f5' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Available';
                  }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>{selectedSubmission.title}</Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1" color="text.secondary">
                      Price: ${selectedSubmission.price.toFixed(2)}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Stock: {selectedSubmission.stock} units
                    </Typography>
                  </Box>
                  
                  <Typography variant="body1" paragraph>
                    {selectedSubmission.description}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>Seller Information</Typography>
                  <Typography variant="body2">
                    Store: {selectedSubmission.seller.storeName || 'Not specified'}
                  </Typography>
                  <Typography variant="body2">
                    Name: {selectedSubmission.seller.name}
                  </Typography>
                  <Typography variant="body2">
                    Email: {selectedSubmission.seller.email}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>Submission Details</Typography>
                  <Typography variant="body2">
                    Status: <Chip 
                      label={selectedSubmission.status} 
                      color={
                        selectedSubmission.status === 'approved' ? 'success' :
                        selectedSubmission.status === 'rejected' ? 'error' : 'warning'
                      }
                      size="small"
                    />
                  </Typography>
                  <Typography variant="body2">
                    Submitted: {formatDate(selectedSubmission.createdAt)}
                  </Typography>
                  
                  {selectedSubmission.adminFeedback && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>Admin Feedback</Typography>
                      <Alert severity={selectedSubmission.status === 'rejected' ? 'error' : 'success'}>
                        {selectedSubmission.adminFeedback}
                      </Alert>
                    </Box>
                  )}
                </CardContent>
              </Card>
              
              {tabValue === 'pending' && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleApprove(selectedSubmission)}
                    disabled={actionLoading}
                  >
                    Approve Product
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleReject(selectedSubmission)}
                    disabled={actionLoading}
                  >
                    Reject Product
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
        <DialogTitle>Reject Product Submission</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph sx={{ mt: 1 }}>
            Please provide feedback for the seller about why this submission is being rejected:
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Rejection Reason"
            fullWidth
            multiline
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={confirmReject} 
            color="error" 
            variant="contained"
            disabled={actionLoading || !rejectionReason.trim()}
          >
            {actionLoading ? <CircularProgress size={24} /> : 'Reject Submission'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductSubmissions; 