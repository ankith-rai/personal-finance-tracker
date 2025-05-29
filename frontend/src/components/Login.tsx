import React, { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, Alert, Grid, useTheme, useMediaQuery } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signIn(email, password);
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <Grid container component="main" sx={{ minHeight: '100vh' }}>
      {/* Left column: illustration or welcome */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1976d2 0%, #21cbf3 100%)',
        }}
      >
        <Box sx={{ color: 'white', textAlign: 'center', px: 6 }}>
          <LockOutlinedIcon sx={{ fontSize: 64, mb: 2, color: 'white' }} />
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Welcome Back!
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Sign in to your personal finance dashboard and take control of your spending, savings, and goals.
          </Typography>
        </Box>
      </Grid>
      {/* Right column: login form */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: { xs: 'none', md: '#f5f5f5' },
        }}
      >
        <Paper elevation={isSmall ? 0 : 3} sx={{ p: 4, borderRadius: 3, width: '100%', maxWidth: 400, mx: 2 }}>
          <Typography variant="h5" component="h1" fontWeight={700} color="primary" textAlign="center" mb={3}>
            Login to Finance Tracker
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 3, py: 1.5 }}
            >
              Login
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
