import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  SvgIcon,
  useTheme
} from '@mui/material';
import { useSession } from '../context/SessionContext';

interface NavBarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

// Inline SVG for wallet icon
function WalletIcon(props: any) {
  return (
    <SvgIcon {...props}>
      <path d="M2 7c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V7zm2 0v10h16V7H4zm2 2h8v2H6V9z" />
    </SvgIcon>
  );
}

const NavBar: React.FC<NavBarProps> = ({ onNavigate, currentPage }) => {
  const { isAuthenticated, user, logout } = useSession();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <WalletIcon sx={{ mr: 1 }} />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 600,
              letterSpacing: '0.5px'
            }}
          >
            Finance Tracker
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isAuthenticated ? (
            <>
              <Button 
                variant="outlined"
                color="inherit" 
                onClick={() => onNavigate('transactions')}
                sx={{ 
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Transactions
              </Button>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: theme.palette.primary.dark
                  }}
                >
                  {user?.name?.[0]?.toUpperCase()}
                </Avatar>
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
                <MenuItem onClick={handleClose}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {user?.name}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => {
                  handleClose();
                  logout();
                }}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button 
                variant="outlined"
                color="inherit" 
                onClick={() => onNavigate('login')}
                sx={{ 
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Login
              </Button>
              <Button 
                variant="contained"
                color="inherit" 
                onClick={() => onNavigate('signup')}
                sx={{ 
                  backgroundColor: 'white',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                  }
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar; 