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
        sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(10px)' }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 0,
              fontWeight: 'bold',
              color: 'white',
              textDecoration: 'none',
              marginRight: 2,
            }}
          >
            TruePass
          </Typography>

          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              justifyContent: 'flex-start',
              marginRight: '20px',
              borderRadius: '20px',
              marginLeft: '280px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              padding: '6px 18px',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              maxWidth: '600px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              },
            }}
          >
            <InputBase
              placeholder="Search Events..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              sx={{
                color: 'white',
                width: '100%',
                fontSize: '1rem',
                fontWeight: 500,
                '& input': {
                  padding: '4px 0',
                },
                '& ::placeholder': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  opacity: 1,
                  fontWeight: 400,
                },
              }}
            />
            {inputValue && (
              <IconButton
                size="small"
                onClick={handleClearSearch}
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton
              size="medium"
              edge="end"
              onClick={handleSearchClick}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                padding: '10px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                },
              }}
            >
              <SearchIcon fontSize="medium" />
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              component={RouterLink}
              to="/marketplace"
              sx={{ color: 'white', textTransform: 'none' }}
            >
              Marketplace
            </Button>

            <Tooltip
              title={
                isAuthenticated && user?.userType === 'host'
                  ? 'Create Event'
                  : 'Login to create events'
              }
            >
              <IconButton
                onClick={
                  isAuthenticated && user?.userType !== 'host' ? handleLogin : handleConnectWallet
                }
                sx={{
                  p: 1,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                  },
                  display: isAuthenticated && user?.userType !== 'host' ? 'none' : 'flex',
                }}
              >
                <img
                  src={editPencilIcon}
                  alt="Create"
                  style={{
                    width: '24px',
                    height: '24px',
                    filter: 'brightness(0) invert(1)', // Make the icon white
                  }}
                />
              </IconButton>
            </Tooltip>

            <Tooltip title="Cart">
              <IconButton
                onClick={handleCartClick}
                sx={{
                  p: 1,
                  mr: 1,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                <Badge
                  badgeContent={cartItemCount}
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      top: -5,
                      right: -5,
                    },
                  }}
                >
                  <img
                    src={shoppingCartIcon}
                    alt="Shopping Cart"
                    style={{
                      width: '24px',
                      height: '24px',
                      filter: 'brightness(0) invert(1)', // Make the icon white
                    }}
                  />
                </Badge>
              </IconButton>
            </Tooltip>

            {!walletConnected ? (
              <Button
                variant="outlined"
                startIcon={<AccountBalanceWalletIcon />}
                onClick={handleConnectWallet}
                size="small"
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  textTransform: 'none',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  mr: 1,
                }}
              >
                Connect Wallet
              </Button>
            ) : (
              <Chip
                icon={<AccountBalanceWalletIcon />}
                label={`${formatAddress(walletAddress)} (${walletBalance} ETH)`}
                onClick={handleWalletClick}
                deleteIcon={<KeyboardArrowDownIcon />}
                onDelete={handleWalletClick}
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  borderRadius: '20px',
                  px: 1,
                  mr: 1,
                }}
              />
            )}

            {/* User Menu */}
            {isAuthenticated && user ? (
              <>
                <Button
                  onClick={handleUserMenuOpen}
                  color="inherit"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 3,
                    px: 2,
                    py: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    },
                  }}
                  endIcon={<KeyboardArrowDownIcon />}
                >
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      mr: 1,
                      bgcolor: 'secondary.main',
                    }}
                  >
                    {user.email.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="subtitle2" noWrap>
                    {user.email.split('@')[0]}
                  </Typography>
                </Button>
                <Menu
                  anchorEl={userMenuAnchorEl}
                  open={Boolean(userMenuAnchorEl)}
                  onClose={handleUserMenuClose}
                  PaperProps={{
                    sx: {
                      borderRadius: 3,
                      minWidth: 180,
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                      mt: 1.5,
                      '& .MuiMenuItem-root': {
                        px: 2,
                        py: 1.5,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ px: 2, pt: 1, pb: 0.5, fontWeight: 'bold', color: 'text.secondary' }}
                  >
                    My Account
                  </Typography>
                  <MenuItem onClick={handleProfileClick}>
                    <PersonIcon fontSize="small" sx={{ mr: 2 }} />
                    Profile
                  </MenuItem>
                  {user?.userType === 'host' && (
                    <MenuItem onClick={handleCreateNFTClick}>
                      <>
                        <ListItemIcon>
                          <AddIcon fontSize="small" />
                        </ListItemIcon>
                        Create Event
                      </>
                    </MenuItem>
                  )}
                  <MenuItem onClick={() => navigate('/verify-tickets')}>
                    <>
                      <ListItemIcon>
                        <QrCodeIcon fontSize="small" />
                      </ListItemIcon>
                      Verify Tickets
                    </>
                  </MenuItem>
                  <MenuItem onClick={() => navigate('/blockchain-tickets')}>
                    <>
                      <ListItemIcon>
                        <QrCodeIcon fontSize="small" color="secondary" />
                      </ListItemIcon>
                      Blockchain Tickets
                    </>
                  </MenuItem>
                  <Divider sx={{ my: 1 }} />
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <LogoutIcon fontSize="small" sx={{ mr: 2 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <IconButton
                onClick={handleLogin}
                sx={{
                  p: 1,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                <img
                  src={userIcon}
                  alt="Login"
                  style={{
                    width: '24px',
                    height: '24px',
                    filter: 'brightness(0) invert(1)', // Make the icon white
                  }}
                />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* MetaMask warning modal - centered on screen */}
      <Modal
        open={
          notification.show &&
          (notification.message.includes('MetaMask') || notification.message.includes('wallet'))
        }
        onClose={handleCloseNotification}
        aria-labelledby="metamask-modal"
        aria-describedby="metamask-warning-message"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(5px)',
        }}
      >
        <Paper
          elevation={10}
          sx={{
            maxWidth: '600px',
            width: '90%',
            bgcolor: '#FF9800',
            borderRadius: 2,
            p: 3,
            position: 'relative',
            border: '1px solid #FB8C00',
            color: '#000',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <WarningIcon fontSize="large" sx={{ color: '#000' }} />
            <Typography variant="h6" component="h2" id="metamask-modal">
              Wallet Connection Required
            </Typography>
            <IconButton
              aria-label="close"
              onClick={handleCloseNotification}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: '#000',
              }}
            >
              <ClearIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
            <img
              src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg"
              alt="MetaMask"
              width={40}
              height={40}
            />
            <Typography variant="body1" id="metamask-warning-message">
              {notification.message}
            </Typography>
          </Box>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="inherit"
              sx={{
                bgcolor: '#000',
                color: '#fff',
                '&:hover': {
                  bgcolor: '#333',
                },
              }}
              onClick={() => window.open('https://metamask.io/download/', '_blank')}
            >
              Install MetaMask
            </Button>
            <Button onClick={handleCloseNotification} sx={{ ml: 2, color: '#000' }}>
              Dismiss
            </Button>
          </Box>
        </Paper>
      </Modal>

      {/* Regular notifications */}
      <Snackbar
        open={
          notification.show &&
          !(
            notification.message.includes('MetaMask') ||
            notification.message.includes('wallet') ||
            notification.message.includes('disconnected')
          )
        }
        autoHideDuration={5000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Wallet disconnect notification - top banner */}
      <Snackbar
        open={notification.show && notification.message.includes('disconnected')}
        autoHideDuration={5000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          width: '100%',
          top: 0,
          '& .MuiPaper-root': {
            width: '100%',
            maxWidth: '100%',
            borderRadius: 0,
            backgroundColor: '#0288d1',
            color: 'white',
            padding: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          },
        }}
      >
        <Alert
          icon={<AccountBalanceWalletIcon />}
          onClose={handleCloseNotification}
          severity="info"
          variant="filled"
          sx={{
            width: '100%',
            backgroundColor: '#0288d1',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white',
            },
            '& .MuiAlert-action': {
              paddingTop: 0,
            },
          }}
        >
          <Box
            sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}
          >
            <Typography variant="body1">{notification.message}</Typography>
          </Box>
        </Alert>
      </Snackbar>
    </>
  );
};

export default Navbar;
