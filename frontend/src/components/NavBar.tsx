import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

const NavBar: React.FC = () => {
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography 
            variant="h6" 
            component={Link}
            to="/"
            sx={{ 
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 700,
            }}
          >
            Finance Tracker
          </Typography>

          {isAuthenticated ? (
            <>
              <Box sx={{ display: 'flex', gap: 2, mr: 2 }}>
              <Button 
                color="inherit" 
                  component={Link}
                  to="/transactions"
              >
                Transactions
              </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/invoices"
                >
                  Invoices
                </Button>
              </Box>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                {user?.name ? (
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                    {user.name[0].toUpperCase()}
                </Avatar>
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem disabled>
                  <Typography variant="body2">{user?.name}</Typography>
                </MenuItem>
                <MenuItem onClick={() => {
                  handleClose();
                  signOut();
                }}>
                  Sign Out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                color="inherit" 
                component={Link}
                to="/login"
              >
                Sign In
              </Button>
              <Button 
                variant="contained"
                color="secondary"
                component={Link}
                to="/signup"
              >
                Sign Up
              </Button>
            </Box>
          )}
      </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar; 