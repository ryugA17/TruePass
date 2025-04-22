import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  InputBase,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Alert,
  Snackbar,
  Divider,
  Modal,
  Paper,
  Tooltip,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import WarningIcon from '@mui/icons-material/Warning';
import QrCodeIcon from '@mui/icons-material/QrCode';
import PaymentIcon from '@mui/icons-material/Payment';
import { useSearch } from '../../context/SearchContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import editPencilIcon from '../../assets/Edit_Pencil_01.png';
import shoppingCartIcon from '../../assets/Shopping_Cart_01.png';
import userIcon from '../../assets/User_Icon.png';
import AddIcon from '@mui/icons-material/Add';

// Define window.ethereum for TypeScript
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (eventName: string, callback: (...args: any[]) => void) => void;
      removeListener: (eventName: string, callback: (...args: any[]) => void) => void;
    };
  }
}

const Navbar = () => {
  const [inputValue, setInputValue] = useState('');
  const { handleSearch } = useSearch();
  const { cartItemCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Wallet states
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('0');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'error' | 'info' | 'success' | 'warning';
  }>({
    show: false,
    message: '',
    type: 'info',
  });

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return window.ethereum && window.ethereum.isMetaMask;
  };

  // Format wallet address for display
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Format balance to 4 decimal places
  const formatBalance = (balanceInWei: string) => {
    // Convert wei to ETH (1 ETH = 10^18 wei)
    const ethBalance = parseInt(balanceInWei, 16) / Math.pow(10, 18);
    return ethBalance.toFixed(4);
  };

  // Handle account changes from MetaMask
  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // User has disconnected all accounts
      setWalletConnected(false);
      setWalletAddress('');
      setWalletBalance('0');
      setNotification({
        show: true,
        message: 'Wallet disconnected',
        type: 'info',
      });
    } else {
      // User has changed the active account
      setWalletAddress(accounts[0]);
      getBalance(accounts[0]);
    }
  };

  // Handle chain changes from MetaMask
  const handleChainChanged = () => {
    // Recommended by MetaMask to refresh the page on chain change
    window.location.reload();
  };

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskInstalled()) {
        try {
          // Check if user is already connected
          const accounts = await window.ethereum!.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            setWalletConnected(true);
            setWalletAddress(accounts[0]);
            getBalance(accounts[0]);
          }

          // Add event listeners
          window.ethereum!.on('accountsChanged', handleAccountsChanged);
          window.ethereum!.on('chainChanged', handleChainChanged);
        } catch (error) {
          console.error('Failed to connect to MetaMask:', error);
        }
      }
    };

    checkConnection();

    // Cleanup event listeners
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  // Sync input value with URL search param when on marketplace
  useEffect(() => {
    if (location.pathname === '/marketplace') {
      const params = new URLSearchParams(location.search);
      const searchQuery = params.get('search') || '';
      setInputValue(searchQuery);
    } else {
      setInputValue('');
    }
  }, [location]);

  // Get ETH balance for the account
  const getBalance = async (account: string) => {
    if (!account || !isMetaMaskInstalled()) return;

    try {
      const balance = await window.ethereum!.request({
        method: 'eth_getBalance',
        params: [account, 'latest'],
      });

      setWalletBalance(formatBalance(balance));
    } catch (error) {
      console.error('Error getting balance:', error);
      setNotification({
        show: true,
        message: 'Failed to get wallet balance',
        type: 'error',
      });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    if (location.pathname === '/marketplace') {
      handleSearch(newValue);
    }
  };

  const handleSearchClick = () => {
    if (inputValue.trim()) {
      if (location.pathname !== '/marketplace') {
        navigate(`/marketplace?search=${encodeURIComponent(inputValue.trim())}`);
      } else {
        handleSearch(inputValue.trim());
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearchClick();
    }
  };

  const handleClearSearch = () => {
    setInputValue('');
    handleSearch('');
  };

  const handleCartClick = () => {
    // Navigate to cart page
    navigate('/cart');
  };

  const handleConnectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      setNotification({
        show: true,
        message: 'Please install MetaMask extension to connect a wallet',
        type: 'warning',
      });
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    try {
      // Request access to the user's accounts
      const accounts = await window.ethereum!.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const account = accounts[0];
        setWalletAddress(account);
        setWalletConnected(true);
        getBalance(account);

        setNotification({
          show: true,
          message: 'Wallet connected successfully',
          type: 'success',
        });
      }
    } catch (error: any) {
      console.error('Error connecting to MetaMask:', error);

      // Handle user rejected request
      if (error.code === 4001) {
        setNotification({
          show: true,
          message: 'Connection request rejected by user',
          type: 'info',
        });
      } else {
        setNotification({
          show: true,
          message: 'Failed to connect wallet: ' + (error.message || 'Unknown error'),
          type: 'error',
        });
      }
    }
  };

  const handleDisconnectWallet = () => {
    // Note: MetaMask doesn't provide a way to disconnect programmatically
    // But we can clear our local state
    setWalletConnected(false);
    setWalletAddress('');
    setWalletBalance('0');
    setAnchorEl(null);

    setNotification({
      show: true,
      message: 'Wallet disconnected from app',
      type: 'info',
    });
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
    handleUserMenuClose();
  };

  const handleCreateNFTClick = () => {
    navigate('/create-nft');
    handleUserMenuClose();
  };

  const handleWalletClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const copyAddressToClipboard = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setNotification({
        show: true,
        message: 'Wallet address copied to clipboard',
        type: 'success',
      });
    }
    handleCloseMenu();
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      show: false,
    });
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backdropFilter: 'blur(10px)',
          background: 'rgba(10, 10, 27, 0.8)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <Toolbar sx={{ py: 1, justifyContent: 'space-between' }}>
          {/* Logo and Brand */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'primary.main',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #6C63FF, #2DD4BF)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitTextFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                mr: 0.5,
              }}
            >
              TruePass
            </Typography>
          </Box>

          {/* Navigation Links - Desktop */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Button
              component={RouterLink}
              to="/"
              color="inherit"
              sx={{
                fontWeight: location.pathname === '/' ? 700 : 500,
                opacity: location.pathname === '/' ? 1 : 0.8,
                px: 2,
              }}
            >
              Home
            </Button>
            <Button
              component={RouterLink}
              to="/marketplace"
              color="inherit"
              sx={{
                fontWeight: location.pathname === '/marketplace' ? 700 : 500,
                opacity: location.pathname === '/marketplace' ? 1 : 0.8,
                px: 2,
              }}
            >
              Marketplace
            </Button>
          </Box>

          {/* Search Bar */}
          <Box
            sx={{
              position: 'relative',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              display: 'flex',
              width: { xs: '40%', sm: '30%', md: '25%' },
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
              },
              ml: { xs: 1, sm: 2 },
            }}
          >
            <IconButton sx={{ p: 1 }} onClick={handleSearchClick}>
              <SearchIcon />
            </IconButton>
            <InputBase
              placeholder="Search events..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              sx={{
                flex: 1,
                color: 'text.primary',
                '& .MuiInputBase-input': {
                  py: 1,
                },
              }}
            />
            {inputValue && (
              <IconButton sx={{ p: 1 }} onClick={handleClearSearch}>
                <ClearIcon />
              </IconButton>
            )}
          </Box>

          {/* Actions Area */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Cart Button */}
            <Tooltip title="Your Cart">
              <IconButton
                onClick={handleCartClick}
                sx={{
                  position: 'relative',
                  background: cartItemCount > 0 ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Badge
                  badgeContent={cartItemCount}
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontWeight: 'bold',
                      fontSize: '0.7rem',
                    },
                  }}
                >
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Wallet Button */}
            {walletConnected ? (
              <Tooltip title="Wallet Details">
                <Button
                  onClick={handleWalletClick}
                  variant="outlined"
                  startIcon={<AccountBalanceWalletIcon />}
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    borderRadius: '12px',
                    borderWidth: '1.5px',
                    textTransform: 'none',
                    px: 1.5,
                    py: 0.5,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: { xs: '120px', sm: '150px' },
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'primary.light',
                      background: 'rgba(108, 99, 255, 0.08)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {formatAddress(walletAddress)}
                </Button>
              </Tooltip>
            ) : (
              <Button
                onClick={handleConnectWallet}
                variant="contained"
                startIcon={<AccountBalanceWalletIcon />}
                sx={{
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #6C63FF, #4B44CC)',
                  boxShadow: '0 4px 10px rgba(108, 99, 255, 0.3)',
                  px: 2,
                  py: 0.75,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7E77FF, #5955D9)',
                    boxShadow: '0 6px 15px rgba(108, 99, 255, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Connect
              </Button>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <Box sx={{ ml: 1 }}>
                <Tooltip title="User Menu">
                  <IconButton
                    onClick={handleUserMenuOpen}
                    sx={{
                      border: '2px solid',
                      borderColor: 'primary.main',
                      p: 0.5,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'primary.light',
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    <Avatar
                      src={(user as any)?.photoURL || ''}
                      alt={(user as any)?.displayName || 'User'}
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: 'primary.dark',
                      }}
                    >
                      {(user as any)?.displayName?.charAt(0) || <PersonIcon fontSize="small" />}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={userMenuAnchorEl}
                  open={Boolean(userMenuAnchorEl)}
                  onClose={handleUserMenuClose}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      mt: 1.5,
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.2))',
                      backgroundImage: 'none',
                      backgroundColor: 'background.paper',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      minWidth: '200px',
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle1" fontWeight="600">
                      {user?.displayName}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ wordBreak: 'break-all' }}
                    >
                      {user?.email}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.05)' }} />
                  <MenuItem
                    onClick={handleProfileClick}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      px: 1.5,
                      py: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      },
                    }}
                  >
                    <ListItemIcon>
                      <PersonIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                  </MenuItem>
                  <MenuItem
                    onClick={handleCreateNFTClick}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      px: 1.5,
                      py: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      },
                    }}
                  >
                    <ListItemIcon>
                      <AddIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Create Event" />
                  </MenuItem>
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      px: 1.5,
                      py: 1,
                      mt: 1,
                      color: 'error.main',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 77, 98, 0.05)',
                      },
                    }}
                  >
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button
                variant="outlined"
                color="primary"
                onClick={handleLogin}
                startIcon={<LoginIcon />}
                sx={{
                  ml: 1,
                  borderColor: 'primary.main',
                  borderWidth: '1.5px',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'primary.light',
                    background: 'rgba(108, 99, 255, 0.08)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Wallet Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.2))',
            backgroundImage: 'none',
            backgroundColor: 'background.paper',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            minWidth: '220px',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
            Wallet Connected
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Address:
            </Typography>
            <Tooltip title="Copy Address">
              <Chip
                label={formatAddress(walletAddress)}
                size="small"
                onClick={copyAddressToClipboard}
                sx={{
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              />
            </Tooltip>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Balance:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
              }}
            >
              {walletBalance} ETH
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.05)' }} />
        <MenuItem
          onClick={handleDisconnectWallet}
          sx={{
            borderRadius: 1,
            mx: 1,
            px: 1.5,
            py: 1,
            color: 'error.main',
            '&:hover': {
              backgroundColor: 'rgba(255, 77, 98, 0.05)',
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Disconnect" />
        </MenuItem>
      </Menu>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.show}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.type}
          variant="filled"
          sx={{
            width: '100%',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Toolbar Spacer */}
      <Toolbar sx={{ mb: 2 }} />
    </>
  );
};

export default Navbar;
