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
import { useSearch } from '../../context/SearchContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

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
    type: 'info'
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
        type: 'info'
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
        params: [account, 'latest']
      });
      
      setWalletBalance(formatBalance(balance));
    } catch (error) {
      console.error('Error getting balance:', error);
      setNotification({
        show: true,
        message: 'Failed to get wallet balance',
        type: 'error'
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
        type: 'warning'
      });
      window.open('https://metamask.io/download/', '_blank');
      return;
    }
    
    try {
      // Request access to the user's accounts
      const accounts = await window.ethereum!.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length > 0) {
        const account = accounts[0];
        setWalletAddress(account);
        setWalletConnected(true);
        getBalance(account);
        
        setNotification({
          show: true,
          message: 'Wallet connected successfully',
          type: 'success'
        });
      }
    } catch (error: any) {
      console.error('Error connecting to MetaMask:', error);
      
      // Handle user rejected request
      if (error.code === 4001) {
        setNotification({
          show: true,
          message: 'Connection request rejected by user',
          type: 'info'
        });
      } else {
        setNotification({
          show: true,
          message: 'Failed to connect wallet: ' + (error.message || 'Unknown error'),
          type: 'error'
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
      type: 'info'
    });
  };
  
  const handleLogout = () => {
    logout();
    setUserMenuAnchorEl(null);
    setNotification({
      show: true,
      message: 'You have been logged out',
      type: 'info'
    });
  };
  
  const handleLogin = () => {
    navigate('/login');
    setUserMenuAnchorEl(null);
  };
  
  const handleCreateNFT = () => {
    navigate('/create-nft');
    setUserMenuAnchorEl(null);
  };
  
  const handleWalletClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };
  
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  
  const handleCloseUserMenu = () => {
    setUserMenuAnchorEl(null);
  };
  
  const copyAddressToClipboard = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setNotification({
        show: true,
        message: 'Wallet address copied to clipboard',
        type: 'success'
      });
    }
    handleCloseMenu();
  };
  
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      show: false
    });
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(10px)' }}>
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
            marginRight: 2
          }}
        >
          NFT Marketplace
        </Typography>

        <Box sx={{ 
          flexGrow: 0.1, 
          display: 'flex', 
          borderRadius: '20px', 
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '5px 15px',
          transition: 'width 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
          }
        }}>
          <InputBase
            placeholder="Search…"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            sx={{
              color: 'white',
              width: '100%',
              '& ::placeholder': {
                color: 'rgba(255, 255, 255, 0.7)',
                opacity: 1
              }
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
            size="small"
            edge="end"
            onClick={handleSearchClick}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            <SearchIcon />
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
          
          <Button
            onClick={isAuthenticated ? handleCreateNFT : handleLogin}
            sx={{ color: 'white', textTransform: 'none' }}
          >
            Create
          </Button>
          
          <IconButton
            color="inherit"
            onClick={handleCartClick}
            sx={{ mr: 1 }}
          >
            <Badge badgeContent={cartItemCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          
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
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                },
                textTransform: 'none',
                borderRadius: '20px',
                fontSize: '0.875rem',
                mr: 1
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
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                },
                borderRadius: '20px',
                px: 1,
                mr: 1
              }}
            />
          )}
          
          {isAuthenticated ? (
            <Chip
              avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>{user?.email.charAt(0).toUpperCase()}</Avatar>}
              label={user?.email.split('@')[0]}
              onClick={handleUserMenuClick}
              deleteIcon={<KeyboardArrowDownIcon />}
              onDelete={handleUserMenuClick}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                },
                borderRadius: '20px',
                px: 1
              }}
            />
          ) : (
            <Button
              variant="contained"
              startIcon={<LoginIcon />}
              onClick={handleLogin}
              size="small"
              color="primary"
              sx={{
                textTransform: 'none',
                borderRadius: '20px',
                fontSize: '0.875rem'
              }}
            >
              Login
            </Button>
          )}
          
          {/* Wallet Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                mt: 1,
                bgcolor: 'background.paper',
                boxShadow: 3,
                borderRadius: 2,
                minWidth: 200
              }
            }}
          >
            <MenuItem onClick={copyAddressToClipboard}>
              <Typography variant="body2">Copy Address</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleDisconnectWallet}>
              <Typography variant="body2" color="error">Disconnect Wallet</Typography>
            </MenuItem>
          </Menu>
          
          {/* User Menu */}
          <Menu
            anchorEl={userMenuAnchorEl}
            open={Boolean(userMenuAnchorEl)}
            onClose={handleCloseUserMenu}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                mt: 1,
                bgcolor: 'background.paper',
                boxShadow: 3,
                borderRadius: 2,
                minWidth: 200
              }
            }}
          >
            <MenuItem
              component={RouterLink}
              to="/profile"
              onClick={handleCloseUserMenu}
            >
              <PersonIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">Profile</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2" color="error">Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
      
      <Snackbar
        open={notification.show}
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
    </AppBar>
  );
};

export default Navbar; 