import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  FormHelperText,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AuthDialog: React.FC<AuthDialogProps> = ({ open, onClose, onSuccess }) => {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (open) {
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      setValidationErrors({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      setError(null);
      setTab(0);
    }
  }, [open]);

  const validateField = (name: string, value: string) => {
    let error = '';

    switch (name) {
      case 'name':
        if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters long';
        }
        break;

      case 'email':
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailRegex.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'password':
        if (value.length < 6) {
          error = 'Password must be at least 6 characters long';
        } else if (!/(?=.*[a-z])/.test(value)) {
          error = 'Password must contain at least one lowercase letter';
        } else if (!/(?=.*[A-Z])/.test(value)) {
          error = 'Password must contain at least one uppercase letter';
        } else if (!/(?=.*\d)/.test(value)) {
          error = 'Password must contain at least one number';
        }
        break;

      case 'confirmPassword':
        if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Only validate if there's a value or if it's the register tab
    if (tab === 1 || value) {
      const error = validateField(name, value);
      setValidationErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (tab === 1) { // Register
      // Validate all fields
      const errors = {
        name: validateField('name', formData.name),
        email: validateField('email', formData.email),
        password: validateField('password', formData.password),
        confirmPassword: validateField('confirmPassword', formData.confirmPassword)
      };

      setValidationErrors(errors);

      // Check if there are any validation errors
      if (Object.values(errors).some(error => error !== '')) {
        return;
      }
    }

    setLoading(true);

    try {
      let userRole = null;
      
      if (tab === 0) { // Login
        userRole = await login(formData.email, formData.password);
      } else { // Register
        userRole = await register(formData.name, formData.email, formData.password);
      }
      
      // Close the dialog first
      onClose();
      
      // Handle redirection based on role
      if (userRole === 'seller') {
        // If user is a seller, redirect to seller dashboard
        navigate('/seller/dashboard');
      } else if (onSuccess) {
        // Use the success callback if provided
        onSuccess();
      } else {
        // Check if there's a stored redirect path
        const redirectPath = sessionStorage.getItem('redirectPath');
        if (redirectPath) {
          sessionStorage.removeItem('redirectPath');
          navigate(redirectPath);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent button from taking focus
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} centered>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {tab === 1 && (
            <TextField
              margin="normal"
              required
              fullWidth
              label="Name"
              name="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              error={!!validationErrors.name}
              helperText={validationErrors.name}
            />
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            error={!!validationErrors.email}
            helperText={validationErrors.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            error={!!validationErrors.password}
            helperText={validationErrors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {tab === 1 && (
            <TextField
              margin="normal"
              required
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!validationErrors.confirmPassword}
              helperText={validationErrors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
          {tab === 1 && (
            <FormHelperText sx={{ mt: 1 }}>
              Password must contain at least:
              <ul style={{ margin: '4px 0' }}>
                <li>6 characters</li>
                <li>One uppercase letter</li>
                <li>One lowercase letter</li>
                <li>One number</li>
              </ul>
            </FormHelperText>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading || (tab === 1 && Object.values(validationErrors).some(error => error !== ''))}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              tab === 0 ? 'Login' : 'Register'
            )}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog; 