import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  TablePagination,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { sellerService } from '../../api';

interface Submission {
  _id: string;
  product: {
    _id: string;
    title: string;
    price: number;
    category: string;
    image: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

const MySubmissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await sellerService.getSubmissions();
      setSubmissions(response.submissions || []);
    } catch (err: any) {
      console.error('Submissions error details:', err);
      if (err.response) {
        console.error('Error response:', {
          status: err.response.status,
          data: err.response.data
        });
      }
      
      setError(
        err.response?.data?.message ||
          'Failed to fetch submissions. Please try again.'
      );
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewFeedback = (submission: Submission) => {
    setSelectedSubmission(submission);
    setFeedbackDialogOpen(true);
  };

  const handleCloseFeedbackDialog = () => {
    setFeedbackDialogOpen(false);
  };

  const handleOpenDeleteDialog = (submission: Submission) => {
    setSelectedSubmission(submission);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteSubmission = async () => {
    if (!selectedSubmission) return;
    
    setDeleteLoading(true);
    
    try {
      await sellerService.deleteSubmission(selectedSubmission._id);

      // Remove the deleted submission from the state
      setSubmissions(submissions.filter(s => s._id !== selectedSubmission._id));
      handleCloseDeleteDialog();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Failed to delete submission. Please try again.'
      );
      console.error('Error deleting submission:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'warning';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        My Product Submissions
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Track the status of your product submissions here. Products approved by our team will be listed on the marketplace.
      </Typography>

      {submissions.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          You haven't submitted any products yet. Get started by submitting your first product!
        </Alert>
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Date Submitted</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {submissions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((submission) => (
                    <TableRow key={submission._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            component="img"
                            sx={{
                              width: 40,
                              height: 40,
                              objectFit: 'cover',
                              borderRadius: 1,
                              mr: 2,
                            }}
                            src={submission.product.image}
                            alt={submission.product.title}
                          />
                          <Typography variant="body2">
                            {submission.product.title}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {submission.product.category.charAt(0).toUpperCase() + 
                          submission.product.category.slice(1)}
                      </TableCell>
                      <TableCell>${submission.product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={submission.status.charAt(0).toUpperCase() + 
                                submission.status.slice(1)}
                          color={getStatusChipColor(submission.status) as "success" | "error" | "warning"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          {submission.status === 'rejected' && (
                            <Tooltip title="View Feedback">
                              <IconButton
                                size="small"
                                onClick={() => handleViewFeedback(submission)}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {submission.status === 'pending' && (
                            <>
                              <Tooltip title="Edit Submission">
                                <IconButton size="small">
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Submission">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenDeleteDialog(submission)}
                                >
                                  <DeleteIcon fontSize="small" />
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
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={submissions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}

      {/* Feedback Dialog */}
      <Dialog
        open={feedbackDialogOpen}
        onClose={handleCloseFeedbackDialog}
        aria-labelledby="feedback-dialog-title"
      >
        <DialogTitle id="feedback-dialog-title">Rejection Feedback</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedSubmission?.feedback || 'No feedback provided.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFeedbackDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Product Submission
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product submission? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteSubmission} 
            color="error" 
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default MySubmissions; 