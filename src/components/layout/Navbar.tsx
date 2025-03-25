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
} from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useSearch } from '../../context/SearchContext';
import { useCart } from '../../context/CartContext';

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
  
  // Format wallet address for display
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

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
  
  const handleConnectWallet = () => {
    // Simulate wallet connection
    setWalletConnected(true);
    // Generate random wallet address for demo
    const randomAddress = '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setWalletAddress(randomAddress);
    // Set random ETH balance for demo
    const randomBalance = (Math.random() * 10).toFixed(4);
    setWalletBalance(randomBalance);
  };
  
  const handleDisconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress('');
    setWalletBalance('0');
    setAnchorEl(null);
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
          NFT Marketplace
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
                avatar={<Avatar sx={{ bgcolor: '#3f51b5' }}><AccountBalanceWalletIcon /></Avatar>}
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
                <MenuItem onClick={handleDisconnectWallet} sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', mt: 1 }}>
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
                bgcolor: '#3f51b5',
                color: 'white',
                '&:hover': {
                  bgcolor: '#303f9f',
                },
                ml: 1,
                borderRadius: 4
              }}
            >
              Connect Wallet
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 