import React, { useState } from 'react';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Alert,
  Fade,
  SvgIcon
} from '@mui/material';
import { useSession } from '../context/SessionContext';

// Inline SVG icons
function PersonIcon(props: any) {
  return (
    <SvgIcon {...props}>
      <path d="M12 12c2.7 0 8 1.34 8 4v2H4v-2c0-2.66 5.3-4 8-4zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
    </SvgIcon>
  );
}
function EmailIcon(props: any) {
  return (
    <SvgIcon {...props}>
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </SvgIcon>
  );
}
function LockIcon(props: any) {
  return (
    <SvgIcon {...props}>
      <path d="M12 17a2 2 0 0 0 2-2v-2a2 2 0 0 0-4 0v2a2 2 0 0 0 2 2zm6-6V9a6 6 0 0 0-12 0v2H4v10h16V11h-2zm-8-2a4 4 0 0 1 8 0v2H8V9z" />
    </SvgIcon>
  );
}
function VisibilityIcon(props: any) {
  return (
    <SvgIcon {...props}>
      <path d="M12 6c-5 0-9 3.58-9 6s4 6 9 6 9-3.58 9-6-4-6-9-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
    </SvgIcon>
  );
}
function VisibilityOffIcon(props: any) {
  return (
    <SvgIcon {...props}>
      <path d="M12 6c-5 0-9 3.58-9 6s4 6 9 6c1.73 0 3.37-.41 4.78-1.13l-1.45-1.45C14.36 15.7 13.21 16 12 16c-3.31 0-6-2.69-6-6 0-.88.18-1.72.5-2.47L3.1 7.1C2.39 8.36 2 9.64 2 11c0 2.42 3.58 6 10 6 1.73 0 3.37-.41 4.78-1.13l-1.45-1.45C14.36 15.7 13.21 16 12 16c-3.31 0-6-2.69-6-6 0-.88.18-1.72.5-2.47L3.1 7.1C2.39 8.36 2 9.64 2 11c0 2.42 3.58 6 10 6 1.73 0 3.37-.41 4.78-1.13l-1.45-1.45C14.36 15.7 13.21 16 12 16c-3.31 0-6-2.69-6-6 0-.88.18-1.72.5-2.47L3.1 7.1C2.39 8.36 2 9.64 2 11c0 2.42 3.58 6 10 6 1.73 0 3.37-.41 4.78-1.13l-1.45-1.45C14.36 15.7 13.21 16 12 16c-3.31 0-6-2.69-6-6 0-.88.18-1.72.5-2.47L3.1 7.1C2.39 8.36 2 9.64 2 11c0 2.42 3.58 6 10 6 1.73 0 3.37-.41 4.78-1.13l-1.45-1.45C14.36 15.7 13.21 16 12 16c-3.31 0-6-2.69-6-6 0-.88.18-1.72.5-2.47L3.1 7.1C2.39 8.36 2 9.64 2 11c0 2.42 3.58 6 10 6z" />
    </SvgIcon>
  );
}

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useSession();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const data = await response.json();
      login(data.user);
    } catch (err) {
      setError('Failed to sign up. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 4,
        px: 2
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          background: 'linear-gradient(to bottom right, #ffffff, #f8f9fa)'
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: 'primary.main',
            textAlign: 'center',
            mb: 4
          }}
        >
          Create Account
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />
          {error && (
            <Fade in={!!error}>
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            </Fade>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{
              mt: 2,
              py: 1.5,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
              }
            }}
          >
            Sign Up
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default SignUp; 