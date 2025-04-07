import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/contract';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
  InputAdornment,
  Divider,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useNFTs } from '../context/NFTContext';
import { useAuth } from '../context/AuthContext';
import EventIcon from '@mui/icons-material/Event';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`host-tabpanel-${index}`}
      aria-labelledby={`host-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const HostPage = () => {
  const { addNFT } = useNFTs();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    seatNumber: '',
    price: '',
    image: null as File | null,
  });
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Dashboard stats (could be fetched from an API in a real application)
  const dashboardStats = {
    totalEvents: 5,
    activeEvents: 3,
    totalTicketsSold: 157,
    revenue: 4.32
  };

  // Ensure only hosts can access this page and user is authenticated
  useEffect(() => {
    // Redirect if user is not logged in
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Redirect if user is not a host
    if (user.userType !== 'host') {
      navigate('/marketplace');
    }
  }, [user, navigate]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      if (!window.ethereum) throw new Error('MetaMask is not installed.');
      
      if (!user) {
        throw new Error('You must be logged in to create tickets');
      }
  
      await window.ethereum.request({ method: 'eth_requestAccounts' });
  
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      try {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        
        // For now, hardcode some dummy values since your contract expects:
        // (address to, string eventName, string seatNumber, uint256 eventDate)
        const eventName = formData.name;
        const seatNumber = formData.seatNumber;
        const eventDate = Math.floor(Date.now() / 1000) + 3600 * 24 * 30; // 30 days from now as timestamp
        
        const tx = await contract.mintTicket(eventName, seatNumber, eventDate);
        await tx.wait();
        
        // Add to NFT context
        if (formData.image) {
          const reader = new FileReader();
          reader.onloadend = () => {
            addNFT({
              title: eventName,
              description: `Seat: ${seatNumber}`,
              price: formData.price,
              image: reader.result as string,
              creator: user.email,
              isVerified: true
            });
          };
          reader.readAsDataURL(formData.image);
        } else {
          // Use a placeholder image if no image was uploaded
          addNFT({
            title: eventName,
            description: `Seat: ${seatNumber}`,
            price: formData.price,
            image: "https://source.unsplash.com/random/300x200/?ticket",
            creator: user.email,
            isVerified: true
          });
        }
      
        setNotification({
          open: true,
          message: 'NFT ticket created successfully!',
          severity: 'success'
        });
      
        setFormData({ name: '', seatNumber: '', price: '', image: null });
        setPreviewUrl(null);
      
        // Refresh the page after 2 seconds to show the new event
        setTimeout(() => {
          setTabValue(0); // Switch to the Dashboard tab
        }, 2000);
      } catch (contractError: any) {
        console.error("Contract error:", contractError);
        setNotification({
          open: true,
          message: 'Contract error: ' + (contractError.message || 'Failed to interact with contract'),
          severity: 'error'
        });
      }
    } catch (err: any) {
      console.error(err);
      setNotification({
        open: true,
        message: err.message || 'Failed to create ticket',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // Mock event data (would come from your backend/blockchain in a real app)
  const mockEvents = [
    {
      id: 1,
      name: "Summer Music Festival",
      date: "2023-08-15",
      ticketsSold: 120,
      totalTickets: 200,
      image: "https://source.unsplash.com/random/300x200/?concert"
    },
    {
      id: 2,
      name: "Tech Conference 2023",
      date: "2023-09-20",
      ticketsSold: 85,
      totalTickets: 150,
      image: "https://source.unsplash.com/random/300x200/?tech"
    },
    {
      id: 3,
      name: "Art Exhibition",
      date: "2023-07-10",
      ticketsSold: 45,
      totalTickets: 100,
      image: "https://source.unsplash.com/random/300x200/?art"
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white', mb: 3 }}>
        Host Dashboard
      </Typography>

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="host dashboard tabs"
            sx={{
              '& .MuiTab-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-selected': {
                  color: 'white'
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'primary.main'
              }
            }}
          >
            <Tab label="Dashboard" />
            <Tab label="Create Ticket" />
            <Tab label="My Events" />
          </Tabs>
        </Box>

        {/* Dashboard Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={3}>
              <Paper sx={{ p: 3, borderRadius: 2, background: 'rgba(22, 28, 36, 0.8)', backdropFilter: 'blur(10px)' }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                  Total Events
                </Typography>
                <Typography variant="h3" sx={{ color: 'white' }}>
                  {dashboardStats.totalEvents}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Paper sx={{ p: 3, borderRadius: 2, background: 'rgba(22, 28, 36, 0.8)', backdropFilter: 'blur(10px)' }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                  Active Events
                </Typography>
                <Typography variant="h3" sx={{ color: 'white' }}>
                  {dashboardStats.activeEvents}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Paper sx={{ p: 3, borderRadius: 2, background: 'rgba(22, 28, 36, 0.8)', backdropFilter: 'blur(10px)' }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                  Tickets Sold
                </Typography>
                <Typography variant="h3" sx={{ color: 'white' }}>
                  {dashboardStats.totalTicketsSold}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Paper sx={{ p: 3, borderRadius: 2, background: 'rgba(22, 28, 36, 0.8)', backdropFilter: 'blur(10px)' }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                  Revenue (ETH)
                </Typography>
                <Typography variant="h3" sx={{ color: 'white' }}>
                  {dashboardStats.revenue}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 2, background: 'rgba(22, 28, 36, 0.8)', backdropFilter: 'blur(10px)', mt: 2 }}>
                <Typography variant="h5" sx={{ color: 'white', mb: 3 }}>
                  Recent Activity
                </Typography>
                <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                <Box sx={{ color: 'white' }}>
                  <Typography variant="body1" sx={{ mb: 1 }}>• New ticket purchase for Summer Music Festival - 0.2 ETH</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>• Created Tech Conference 2023 event with 150 tickets</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>• 5 ticket purchases for Art Exhibition - 0.5 ETH</Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Create Ticket Tab */}
        <TabPanel value={tabValue} index={1}>
          <Paper sx={{ p: 4, borderRadius: 2, background: 'rgba(22, 28, 36, 0.8)', backdropFilter: 'blur(10px)' }}>
            <Typography variant="h5" sx={{ color: 'white', mb: 3 }}>
              Create New NFT Ticket
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Event Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    InputProps={{ 
                      sx: { borderRadius: 2 },
                      startAdornment: (
                        <InputAdornment position="start">
                          <EventIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                        </InputAdornment>
                      )
                    }}
                    sx={muiInputStyles}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Seat Number"
                    name="seatNumber"
                    value={formData.seatNumber}
                    onChange={handleInputChange}
                    required
                    InputProps={{ 
                      sx: { borderRadius: 2 },
                      startAdornment: (
                        <InputAdornment position="start">
                          <EventSeatIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                        </InputAdornment>
                      )
                    }}
                    sx={muiInputStyles}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Price (ETH)"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      sx: { borderRadius: 2 },
                      startAdornment: (
                        <InputAdornment position="start">
                          <MonetizationOnIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                        </InputAdornment>
                      ),
                      endAdornment: <InputAdornment position="end" sx={{ color: 'white' }}>ETH</InputAdornment>,
                      inputProps: { min: 0, step: 0.001 }
                    }}
                    sx={muiInputStyles}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={<AddPhotoAlternateIcon />}
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: 2,
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      '&:hover': { borderColor: 'white' }
                    }}
                  >
                    Upload Event Image
                    <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                  </Button>
                  {formData.image && (
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Selected file: {formData.image.name}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {previewUrl && (
                    <Box sx={{ mt: 1, borderRadius: 2, overflow: 'hidden', height: '120px' }}>
                      <img
                        src={previewUrl}
                        alt="Ticket Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading}
                    sx={{
                      borderRadius: 2,
                      p: 1.5,
                      background: 'linear-gradient(45deg, #6a1b9a 30%, #4527a0 90%)',
                      '&:hover': { background: 'linear-gradient(45deg, #7b1fa2 30%, #512da8 90%)' }
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Create NFT Ticket'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </TabPanel>

        {/* My Events Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            {mockEvents.map((event) => (
              <Grid item xs={12} md={4} key={event.id}>
                <Card sx={{ borderRadius: 2, overflow: 'hidden', background: 'rgba(22, 28, 36, 0.8)', backdropFilter: 'blur(10px)' }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={event.image}
                    alt={event.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" sx={{ color: 'white' }}>
                      {event.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                      Event Date: {event.date}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Tickets Sold: {event.ticketsSold}/{event.totalTickets}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {Math.round(event.ticketsSold / event.totalTickets * 100)}%
                      </Typography>
                    </Box>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      sx={{
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        color: 'white',
                        '&:hover': { borderColor: 'white' }
                      }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} variant="filled" sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

const muiInputStyles = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)'
  },
  '& .MuiInputBase-input': {
    color: 'white'
  }
};

export default HostPage; 