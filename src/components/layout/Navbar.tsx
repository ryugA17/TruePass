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
} from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useSearch } from '../../context/SearchContext';
import { useCart } from '../../context/CartContext';

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
  const location = useLocation();
  const navigate = useNavigate();
  
  // Wallet states
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('0');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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
    // MetaMask doesn't support programmatic disconnection via API
    // We can only reset our app's state to simulate disconnection
    setWalletConnected(false);
    setWalletAddress('');
    setWalletBalance('0');
    setAnchorEl(null);
    
    setNotification({
      show: true,
      message: 'Wallet disconnected from application',
      type: 'info'
    });
  };
  
  const handleWalletClick = (event: React.MouseEvent<HTMLElement>) => {
    if (walletConnected) {
      setAnchorEl(event.currentTarget);
    } else {
      handleConnectWallet();
    }
  };
  
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  
  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setNotification({
      show: true,
      message: 'Address copied to clipboard',
      type: 'success'
    });
    handleCloseMenu();
  };
  
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        bgcolor: 'rgba(22, 28, 36, 0.8)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography 
          variant="h6" 
          component={RouterLink} 
          to="/"
          sx={{ 
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold'
          }}
        >
          TruePass
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              position: 'relative',
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              width: '300px',
              transition: 'width 0.3s ease-in-out',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.25)',
              },
            }}
          >
            <InputBase
              placeholder="Search NFTs..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              sx={{
                color: 'inherit',
                flex: 1,
                '& .MuiInputBase-input': {
                  p: 1,
                  pl: 2,
                  width: '100%',
                  '&::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    opacity: 1,
                  },
                },
              }}
            />
            {inputValue && (
              <IconButton 
                size="small"
                onClick={handleClearSearch}
                sx={{ 
                  color: 'inherit',
                  opacity: 0.7,
                  p: 0.5,
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton 
              size="small"
              onClick={handleSearchClick}
              sx={{ 
                color: 'inherit',
                opacity: 0.7,
                mr: 1,
                ml: 0.5,
              }}
            >
              <SearchIcon fontSize="small" />
            </IconButton>
          </Box>

          <Button
            color="inherit"
            component={RouterLink}
            to="/marketplace"
            sx={{
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            Marketplace
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/create-nft"
            sx={{
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            Create NFT
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/profile"
            sx={{
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            Profile
          </Button>
          
          <IconButton 
            color="inherit"
            onClick={handleCartClick}
            sx={{
              ml: 1,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <Badge badgeContent={cartItemCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          
          {walletConnected ? (
            <>
              <Chip
                onClick={handleWalletClick}
                avatar={<Avatar sx={{ bgcolor: '#ff9800' }}><AccountBalanceWalletIcon /></Avatar>}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {formatAddress(walletAddress)}
                    </Typography>
                    <KeyboardArrowDownIcon fontSize="small" />
                  </Box>
                }
                variant="filled"
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.25)' },
                  height: 36,
                  borderRadius: 4,
                  px: 0.5
                }}
              />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                PaperProps={{
                  sx: {
                    bgcolor: 'rgba(22, 28, 36, 0.95)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    mt: 1.5,
                    minWidth: 200
                  }
                }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>Wallet</Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>{walletAddress}</Typography>
                </Box>
                <Box sx={{ px: 2, py: 1, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>Balance</Typography>
                  <Typography variant="body2">{walletBalance} ETH</Typography>
                </Box>
                <MenuItem 
                  onClick={copyAddressToClipboard} 
                  sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', mt: 1 }}
                >
                  Copy Address
                </MenuItem>
                <MenuItem onClick={handleDisconnectWallet}>
                  Disconnect
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="contained"
              startIcon={<AccountBalanceWalletIcon />}
              onClick={handleConnectWallet}
              sx={{
                bgcolor: '#ff9800',
                color: 'white',
                '&:hover': {
                  bgcolor: '#f57c00',
                },
                ml: 1,
                borderRadius: 4
              }}
            >
              Connect MetaMask
            </Button>
          )}
        </Box>
      </Toolbar>
      
      {/* Notifications */}
      <Snackbar 
        open={notification.show}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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