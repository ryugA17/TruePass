import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/contract';
import { PaymentService } from '../services/PaymentService';
import { BlockchainTOTPService } from '../services/BlockchainTOTPService';
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
  CardMedia,
  LinearProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useNFTs } from '../context/NFTContext';
import { useAuth } from '../context/AuthContext';
import EventIcon from '@mui/icons-material/Event';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const HostPage = () => {
  const { addNFT, nfts } = useNFTs();
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

  // Calculate dashboard stats based on user's NFTs
  const userNFTs = nfts.filter(nft => nft.creator === user?.email);

  // Dashboard stats with calculated values from actual NFTs
  const dashboardStats = {
    totalEvents: userNFTs.length,
    activeEvents: userNFTs.filter(
      nft => new Date(nft.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length,
    totalTicketsSold: Math.floor(Math.random() * 50) + userNFTs.length * 5, // Simulated data
    revenue: userNFTs
      .reduce((total, nft) => {
        const price = parseFloat(nft.price.replace(' ETH', '')) || 0;
        return total + price;
      }, 0)
      .toFixed(2),
  };

  // Monthly sales data (simulated)
  const monthlySalesData = [
    { month: 'Jan', sales: 12 },
    { month: 'Feb', sales: 19 },
    { month: 'Mar', sales: 15 },
    { month: 'Apr', sales: 25 },
    { month: 'May', sales: 32 },
    { month: 'Jun', sales: 40 },
    { month: 'Jul', sales: 35 },
    { month: 'Aug', sales: dashboardStats.totalTicketsSold },
  ];

  // Revenue by date data (mockup)
  const revenueByDate = [
    { date: '2023-01-05', revenue: 0.5 },
    { date: '2023-01-12', revenue: 0.8 },
    { date: '2023-01-19', revenue: 1.2 },
    { date: '2023-01-26', revenue: 0.9 },
    { date: '2023-02-02', revenue: 1.5 },
    { date: '2023-02-09', revenue: 2.1 },
    { date: '2023-02-16', revenue: 1.8 },
    { date: '2023-02-23', revenue: 2.4 },
    { date: '2023-03-02', revenue: 2.7 },
    { date: '2023-03-09', revenue: 3.2 },
    { date: '2023-03-16', revenue: 2.9 },
    { date: '2023-03-23', revenue: 3.5 },
    { date: '2023-03-30', revenue: 4.0 },
    { date: '2023-04-06', revenue: 3.8 },
    { date: '2023-04-13', revenue: 4.2 },
    { date: '2023-04-20', revenue: 4.5 },
    { date: '2023-04-27', revenue: 5.0 },
    { date: '2023-05-04', revenue: 5.5 },
    { date: '2023-05-11', revenue: 6.0 },
    { date: '2023-05-18', revenue: 6.5 },
    { date: '2023-05-25', revenue: 7.0 },
    { date: '2023-06-01', revenue: 7.5 },
    { date: '2023-06-08', revenue: 8.0 },
    { date: '2023-06-15', revenue: 8.5 },
    { date: '2023-06-22', revenue: 9.0 },
    { date: '2023-06-29', revenue: 9.5 },
    { date: '2023-07-06', revenue: 10.0 },
    { date: '2023-07-13', revenue: 10.5 },
    { date: '2023-07-20', revenue: 11.0 },
    { date: '2023-07-27', revenue: 11.5 },
    { date: '2023-08-03', revenue: 12.0 },
    { date: '2023-08-10', revenue: 12.5 },
    { date: '2023-08-17', revenue: 13.0 },
    { date: '2023-08-24', revenue: 13.5 },
    { date: '2023-08-31', revenue: 14.0 },
  ];

  // Revenue by event (based on actual user NFTs)
  const revenueByEvent = userNFTs.slice(0, 5).map(nft => ({
    name: nft.title,
    revenue: parseFloat(nft.price.replace(' ETH', '')) || 0,
    ticketsSold: Math.floor(Math.random() * 30) + 5, // Simulated data
  }));

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
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
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

        // Get values from form
        const eventName = formData.name;
        const seatNumber = formData.seatNumber;
        const eventDate = Math.floor(Date.now() / 1000) + 3600 * 24 * 30; // 30 days from now

        // Generate TOTP secret for ticket validation
        const ticketId = `ticket-${Date.now()}`;
        const secret = BlockchainTOTPService.generateSecret(ticketId, eventName, 24 * 365); // 1 year expiry

        // Simulate payment processing
        const payment = PaymentService.initializePayment(parseFloat(formData.price), {
          eventName,
          seatNumber,
          userEmail: user.email,
          walletAddress: await signer.getAddress(),
        });

        const paymentResponse = await PaymentService.processPayment(payment);

        if (!paymentResponse.success) {
          throw new Error(
            'Payment processing failed: ' + (paymentResponse.error || 'Unknown error')
          );
        }

        // Mint ticket with payment ID
        const tx = await contract.mintTicket(
          await signer.getAddress(),
          eventName,
          seatNumber,
          eventDate,
          secret.secretHash,
          paymentResponse.paymentId
        );

        await tx.wait();

        // Add to NFT context
        if (formData.image) {
          const reader = new FileReader();
          reader.onloadend = () => {
            addNFT({
              title: eventName,
              description: `Seat: ${seatNumber}`,
              price: PaymentService.formatPrice(parseFloat(formData.price)),
              image: reader.result as string,
              creator: user.email,
              isVerified: true,
              transferable: false,
            });

            // Show success notification
            setNotification({
              open: true,
              message: 'Event created successfully!',
              severity: 'success',
            });

            // Clear form
            setFormData({ name: '', seatNumber: '', price: '', image: null });
            setPreviewUrl(null);

            // Navigate to profile after short delay
            setTimeout(() => {
              navigate('/profile');
            }, 2000);
          };
          reader.readAsDataURL(formData.image);
        } else {
          // Use a placeholder image if no image was uploaded
          addNFT({
            title: eventName,
            description: `Seat: ${seatNumber}`,
            price: PaymentService.formatPrice(parseFloat(formData.price)),
            image: 'https://source.unsplash.com/random/300x200/?ticket',
            creator: user.email,
            isVerified: true,
            transferable: false,
          });

          setNotification({
            open: true,
            message: 'Event created successfully!',
            severity: 'success',
          });

          setFormData({ name: '', seatNumber: '', price: '', image: null });
          setPreviewUrl(null);

          // Navigate to profile after short delay
          setTimeout(() => {
            navigate('/profile');
          }, 2000);
        }
      } catch (contractError: any) {
        console.error('Contract error:', contractError);
        setNotification({
          open: true,
          message:
            'Contract error: ' + (contractError.message || 'Failed to interact with contract'),
          severity: 'error',
        });
        setLoading(false);
      }
    } catch (err: any) {
      console.error(err);
      setNotification({
        open: true,
        message: err.message || 'Failed to create ticket',
        severity: 'error',
      });
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Mock event data (would come from your backend/blockchain in a real app)
  const mockEvents = [
    {
      id: 1,
      name: 'Summer Music Festival',
      date: '2023-08-15',
      ticketsSold: 120,
      totalTickets: 200,
      image: 'https://source.unsplash.com/random/300x200/?concert',
    },
    {
      id: 2,
      name: 'Tech Conference 2023',
      date: '2023-09-20',
      ticketsSold: 85,
      totalTickets: 150,
      image: 'https://source.unsplash.com/random/300x200/?tech',
    },
    {
      id: 3,
      name: 'Art Exhibition',
      date: '2023-07-10',
      ticketsSold: 45,
      totalTickets: 100,
      image: 'https://source.unsplash.com/random/300x200/?art',
    },
  ];

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        mb: 6,
        background: 'linear-gradient(135deg, #040615 0%, #040615 100%)',
        minHeight: '100vh',
        py: 4,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,99,255,0.2) 0%, rgba(108,99,255,0) 70%)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(45,212,191,0.15) 0%, rgba(45,212,191,0) 70%)',
          zIndex: 0,
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            color: 'white',
            mb: 3,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textFillColor: 'transparent',
          }}
        >
          Host Dashboard
        </Typography>

        <Box sx={{ width: '100%' }}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              background: 'rgba(28, 28, 56, 0.5)',
              backdropFilter: 'blur(8px)',
              borderRadius: '12px',
              mb: 3,
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="host dashboard tabs"
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 600,
                  px: 3,
                  py: 2,
                  '&.Mui-selected': {
                    color: 'white',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: 'primary.main',
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                },
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
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: 2,
                    background:
                      'linear-gradient(135deg, rgba(156, 39, 176, 0.15) 0%, rgba(106, 27, 154, 0.5) 100%)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(156, 39, 176, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 15px 50px rgba(156, 39, 176, 0.3)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: '12px',
                        bgcolor: 'rgba(156, 39, 176, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                      }}
                    >
                      <LocalActivityIcon sx={{ color: '#9c27b0', fontSize: 28 }} />
                    </Box>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                      Total Events
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>
                    {dashboardStats.totalEvents}
                  </Typography>
                  <Box
                    sx={{
                      mt: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      p: 1,
                      borderRadius: 1,
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#e1bee7', fontWeight: 'medium' }}>
                      {dashboardStats.activeEvents} active events
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: 2,
                    background:
                      'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(46, 125, 50, 0.4) 100%)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(76, 175, 80, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: '12px',
                        bgcolor: 'rgba(76, 175, 80, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                      }}
                    >
                      <PeopleIcon sx={{ color: '#4caf50', fontSize: 28 }} />
                    </Box>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                      Tickets Sold
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>
                    {dashboardStats.totalTicketsSold}
                  </Typography>
                  <Box
                    sx={{
                      mt: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      p: 1,
                      borderRadius: 1,
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#c8e6c9', fontWeight: 'medium' }}>
                      {Math.floor(dashboardStats.totalTicketsSold / 30)} tickets/day
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: 2,
                    background:
                      'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(25, 118, 210, 0.4) 100%)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(33, 150, 243, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: '12px',
                        bgcolor: 'rgba(33, 150, 243, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                      }}
                    >
                      <TrendingUpIcon sx={{ color: '#2196f3', fontSize: 28 }} />
                    </Box>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                      Revenue (INR)
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>
                    {dashboardStats.revenue}
                  </Typography>
                  <Box
                    sx={{
                      mt: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      p: 1,
                      borderRadius: 1,
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#bbdefb', fontWeight: 'medium' }}>
                      Avg ₹
                      {(
                        parseFloat(dashboardStats.revenue) / (dashboardStats.totalEvents || 1)
                      ).toFixed(2)}{' '}
                      per event
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: 2,
                    background:
                      'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(230, 81, 0, 0.4) 100%)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(255, 152, 0, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: '12px',
                        bgcolor: 'rgba(255, 152, 0, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                      }}
                    >
                      <AssessmentIcon sx={{ color: '#ff9800', fontSize: 28 }} />
                    </Box>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                      Conversion Rate
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>
                    78%
                  </Typography>
                  <Box
                    sx={{
                      mt: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      p: 1,
                      borderRadius: 1,
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#ffe0b2', fontWeight: 'medium' }}>
                      12% increase from last month
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              {/* Monthly Sales Chart and Revenue by Date Chart */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      p: 4,
                      borderRadius: 2,
                      background: 'rgba(22, 28, 36, 0.95)',
                      backdropFilter: 'blur(10px)',
                      mt: 2,
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                      height: '100%',
                    }}
                  >
                    <Typography variant="h5" sx={{ color: 'white', mb: 4, fontWeight: 'bold' }}>
                      Monthly Ticket Sales
                    </Typography>
                    <Box
                      sx={{
                        height: 400,
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: 2,
                        px: 2,
                        position: 'relative',
                      }}
                    >
                      {/* Horizontal grid lines */}
                      {[0, 25, 50, 75, 100].map(percent => (
                        <Box
                          key={`grid-${percent}`}
                          sx={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: `${100 - percent * 0.75}%`,
                            height: '1px',
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            zIndex: 1,
                            '&::after': {
                              content: `"${Math.round((percent * 0.4 * Math.max(...monthlySalesData.map(d => d.sales))) / 100)}"`,
                              position: 'absolute',
                              left: '-30px',
                              top: '-10px',
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '12px',
                            },
                          }}
                        />
                      ))}

                      {monthlySalesData.map((data, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            flex: 1,
                            zIndex: 2,
                          }}
                        >
                          <Box
                            sx={{
                              height: `${(data.sales / Math.max(...monthlySalesData.map(d => d.sales))) * 300}px`,
                              width: '55%',
                              background:
                                index === monthlySalesData.length - 1
                                  ? 'linear-gradient(180deg, rgba(189, 91, 218, 1) 0%, rgba(106, 27, 154, 1) 100%)'
                                  : 'linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.15) 100%)',
                              borderRadius: '10px',
                              transition: 'all 0.5s ease-in-out',
                              position: 'relative',
                              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
                              '&:hover': {
                                transform: 'translateY(-8px) scale(1.03)',
                                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.4)',
                                background:
                                  index === monthlySalesData.length - 1
                                    ? 'linear-gradient(180deg, rgba(209, 111, 238, 1) 0%, rgba(126, 47, 174, 1) 100%)'
                                    : 'linear-gradient(180deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.25) 100%)',
                              },
                            }}
                          >
                            <Box
                              sx={{
                                position: 'absolute',
                                top: '-40px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                bgcolor:
                                  index === monthlySalesData.length - 1
                                    ? '#9c27b0'
                                    : 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                py: 0.5,
                                px: 1.5,
                                borderRadius: '12px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                whiteSpace: 'nowrap',
                                minWidth: '40px',
                                textAlign: 'center',
                              }}
                            >
                              {data.sales}
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              mt: 2,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{
                                color: 'white',
                                fontWeight:
                                  index === monthlySalesData.length - 1 ? 'bold' : 'normal',
                                bgcolor:
                                  index === monthlySalesData.length - 1
                                    ? 'rgba(156, 39, 176, 0.2)'
                                    : 'transparent',
                                py: index === monthlySalesData.length - 1 ? 0.5 : 0,
                                px: index === monthlySalesData.length - 1 ? 1.5 : 0,
                                borderRadius: index === monthlySalesData.length - 1 ? '4px' : '0',
                              }}
                            >
                              {data.month}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 5,
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        pt: 2,
                      }}
                    >
                      <Typography variant="body2" sx={{ color: '#bb86fc', fontWeight: 'medium' }}>
                        Current month:{' '}
                        <strong>
                          {monthlySalesData[monthlySalesData.length - 1].sales} tickets
                        </strong>
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Average:{' '}
                        {Math.round(
                          monthlySalesData.reduce((sum, data) => sum + data.sales, 0) /
                            monthlySalesData.length
                        )}{' '}
                        tickets/month
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      p: 4,
                      borderRadius: 2,
                      background: 'rgba(22, 28, 36, 0.95)',
                      backdropFilter: 'blur(10px)',
                      mt: 2,
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                      height: '100%',
                    }}
                  >
                    <Typography variant="h5" sx={{ color: 'white', mb: 4, fontWeight: 'bold' }}>
                      Revenue by Date
                    </Typography>
                    <Box
                      sx={{
                        height: 400,
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: 0.1,
                        px: 4,
                        position: 'relative',
                        overflow: 'visible',
                        pb: 6,
                        width: '100%',
                      }}
                    >
                      {/* Horizontal grid lines */}
                      {[0, 25, 50, 75, 100].map(percent => (
                        <Box
                          key={`grid-${percent}`}
                          sx={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: `${100 - percent * 0.75}%`,
                            height: '1px',
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            zIndex: 1,
                            '&::after': {
                              content: `"₹${(percent * 140).toFixed(0)}"`,
                              position: 'absolute',
                              left: '-30px',
                              top: '-10px',
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '12px',
                            },
                          }}
                        />
                      ))}

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-end',
                          gap: 0.1,
                          position: 'relative',
                          width: '100%',
                          justifyContent: 'space-between',
                        }}
                      >
                        {revenueByDate.map((data, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              flex: 1,
                              maxWidth: '40px',
                              position: 'relative',
                              overflow: 'visible',
                              mx: 0.1,
                            }}
                          >
                            <Box
                              sx={{
                                height: `${(data.revenue / Math.max(...revenueByDate.map(d => d.revenue))) * 300}px`,
                                width: '100%',
                                background:
                                  index === revenueByDate.length - 1
                                    ? 'linear-gradient(180deg, rgba(33, 150, 243, 1) 0%, rgba(25, 118, 210, 1) 100%)'
                                    : 'linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.15) 100%)',
                                borderRadius: '6px',
                                transition: 'all 0.5s ease-in-out',
                                position: 'relative',
                                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
                                '&:hover': {
                                  transform: 'translateY(-8px) scale(1.03)',
                                  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.4)',
                                  background:
                                    index === revenueByDate.length - 1
                                      ? 'linear-gradient(180deg, rgba(64, 196, 255, 1) 0%, rgba(33, 150, 243, 1) 100%)'
                                      : 'linear-gradient(180deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.25) 100%)',
                                },
                              }}
                            >
                              {index % 3 === 0 && (
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: '-30px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    bgcolor:
                                      index === revenueByDate.length - 1
                                        ? '#2196f3'
                                        : 'rgba(255, 255, 255, 0.2)',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '12px',
                                    py: 0.3,
                                    px: 0.8,
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                    whiteSpace: 'nowrap',
                                    minWidth: '30px',
                                    textAlign: 'center',
                                    zIndex: 3,
                                  }}
                                >
                                  {data.revenue.toFixed(1)}
                                </Box>
                              )}
                            </Box>
                            {index % 3 === 0 && (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  bottom: '-28px',
                                  left: '50%',
                                  transform: 'translateX(-50%)',
                                  minWidth: 'max-content',
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: 'white',
                                    fontWeight:
                                      index === revenueByDate.length - 1 ? 'bold' : 'normal',
                                    bgcolor:
                                      index === revenueByDate.length - 1
                                        ? 'rgba(33, 150, 243, 0.2)'
                                        : 'transparent',
                                    py: index === revenueByDate.length - 1 ? 0.3 : 0,
                                    px: index === revenueByDate.length - 1 ? 0.8 : 0,
                                    borderRadius: index === revenueByDate.length - 1 ? '4px' : '0',
                                    fontSize: '10px',
                                  }}
                                >
                                  {new Date(data.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 5,
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        pt: 2,
                      }}
                    >
                      <Typography variant="body2" sx={{ color: '#bbdefb', fontWeight: 'medium' }}>
                        Current week:{' '}
                        <strong>
                          {revenueByDate[revenueByDate.length - 1].revenue.toFixed(1)} ETH
                        </strong>
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Average:{' '}
                        {(
                          revenueByDate.reduce((sum, data) => sum + data.revenue, 0) /
                          revenueByDate.length
                        ).toFixed(1)}{' '}
                        ETH/week
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>

              {/* Revenue by Event */}
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: 2,
                    background: 'rgba(22, 28, 36, 0.9)',
                    backdropFilter: 'blur(10px)',
                    mt: 3,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <Typography variant="h5" sx={{ color: 'white', mb: 4, fontWeight: 'bold' }}>
                    Revenue by Event
                  </Typography>
                  <Grid container spacing={3}>
                    {revenueByEvent.length > 0 ? (
                      revenueByEvent.map((event, index) => (
                        <Grid item xs={12} md={6} key={index}>
                          <Box
                            sx={{
                              mb: 3,
                              p: 3,
                              borderRadius: 2,
                              background: 'rgba(255, 255, 255, 0.05)',
                              transition: 'all 0.3s ease',
                              '&:hover': { background: 'rgba(255, 255, 255, 0.1)' },
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                                {event.name}
                              </Typography>
                              <Typography
                                variant="h6"
                                sx={{ color: '#9c27b0', fontWeight: 'bold' }}
                              >
                                {event.revenue.toFixed(2)} ETH
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                              <Typography variant="body1" sx={{ color: 'white' }}>
                                {event.ticketsSold} tickets sold
                              </Typography>
                              <Typography variant="body1" sx={{ color: 'white' }}>
                                {(
                                  (event.revenue / parseFloat(dashboardStats.revenue)) *
                                  100
                                ).toFixed(0)}
                                % of total
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={(event.revenue / parseFloat(dashboardStats.revenue)) * 100}
                              sx={{
                                borderRadius: 2,
                                height: 12,
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                '& .MuiLinearProgress-bar': {
                                  background: 'linear-gradient(90deg, #9c27b0 0%, #6a1b9a 100%)',
                                  borderRadius: 2,
                                },
                              }}
                            />
                          </Box>
                        </Grid>
                      ))
                    ) : (
                      <Grid item xs={12}>
                        <Typography
                          variant="body1"
                          sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' }}
                        >
                          No revenue data available
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: 2,
                    background: 'rgba(22, 28, 36, 0.9)',
                    backdropFilter: 'blur(10px)',
                    mt: 3,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', flex: 1 }}>
                      Recent Activity
                    </Typography>
                    <Button
                      variant="text"
                      size="small"
                      sx={{
                        color: '#9c27b0',
                        '&:hover': {
                          backgroundColor: 'rgba(156, 39, 176, 0.08)',
                        },
                      }}
                    >
                      View All
                    </Button>
                  </Box>
                  <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                  {userNFTs.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: 'rgba(156, 39, 176, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: 'rgba(156, 39, 176, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <MonetizationOnIcon sx={{ color: '#9c27b0' }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" sx={{ color: 'white', fontWeight: 'medium' }}>
                            New ticket purchase for {userNFTs[0]?.title || 'Event'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {userNFTs[0]?.price || '0.2 ETH'} • Just now
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: 'rgba(33, 150, 243, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: 'rgba(33, 150, 243, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <EventIcon sx={{ color: '#2196f3' }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" sx={{ color: 'white', fontWeight: 'medium' }}>
                            Created {userNFTs.length} events with tickets
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Total value: {dashboardStats.revenue} ETH • 2 days ago
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: 'rgba(76, 175, 80, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: 'rgba(76, 175, 80, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <PeopleIcon sx={{ color: '#4caf50' }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" sx={{ color: 'white', fontWeight: 'medium' }}>
                            {Math.floor(Math.random() * 10) + 2} ticket purchases for{' '}
                            {userNFTs[userNFTs.length - 1]?.title || 'Event'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {(Math.random() * 0.5 + 0.1).toFixed(2)} ETH • 3 days ago
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        p: 4,
                        borderRadius: 2,
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: '50%',
                          bgcolor: 'rgba(156, 39, 176, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 1,
                        }}
                      >
                        <EventIcon sx={{ color: '#9c27b0', fontSize: 36 }} />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{ color: 'white', fontWeight: 'medium', textAlign: 'center' }}
                      >
                        No recent activity
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', mb: 2 }}
                      >
                        Create your first event to get started!
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => setTabValue(1)}
                        sx={{
                          borderRadius: 2,
                          p: '10px 24px',
                          background: 'linear-gradient(45deg, #6a1b9a 30%, #4527a0 90%)',
                          fontWeight: 'bold',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #7b1fa2 30%, #512da8 90%)',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                          },
                        }}
                      >
                        Create Event
                      </Button>
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Create Ticket Tab */}
          <TabPanel value={tabValue} index={1}>
            <Paper
              component="form"
              elevation={3}
              onSubmit={handleSubmit}
              sx={{
                p: 4,
                borderRadius: 3,
                background:
                  'linear-gradient(135deg, rgba(28, 28, 56, 0.8) 0%, rgba(20, 20, 40, 0.9) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative elements for form */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -60,
                  right: -60,
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  background:
                    'radial-gradient(circle, rgba(108,99,255,0.1) 0%, rgba(108,99,255,0) 70%)',
                  zIndex: 0,
                }}
              />

              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  mb: 4,
                  color: 'white',
                  position: 'relative',
                }}
              >
                Create New Event Ticket
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Event Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                      '& .MuiInputBase-input': {
                        color: 'white',
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EventIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Seat Number/Section"
                    name="seatNumber"
                    value={formData.seatNumber}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                      '& .MuiInputBase-input': {
                        color: 'white',
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EventSeatIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Price (ETH)"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                      '& .MuiInputBase-input': {
                        color: 'white',
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MonetizationOnIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      border: '2px dashed rgba(255, 255, 255, 0.2)',
                      borderRadius: 2,
                      p: 3,
                      mb: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '240px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        background: 'rgba(108, 99, 255, 0.05)',
                      },
                    }}
                  >
                    {previewUrl ? (
                      <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                        <img
                          src={previewUrl}
                          alt="Event Preview"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '8px',
                          }}
                        />
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            setPreviewUrl(null);
                            setFormData(prev => ({ ...prev, image: null }));
                          }}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            minWidth: 'unset',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            p: 0,
                          }}
                        >
                          ✕
                        </Button>
                      </Box>
                    ) : (
                      <>
                        <input
                          accept="image/*"
                          id="event-image-input"
                          type="file"
                          onChange={handleImageChange}
                          style={{ display: 'none' }}
                        />
                        <label htmlFor="event-image-input">
                          <AddPhotoAlternateIcon
                            sx={{ fontSize: 80, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }}
                          />
                          <Typography variant="body1" sx={{ color: 'white', mb: 1 }}>
                            Upload Event Image
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                            Drag & drop or click to browse
                          </Typography>
                          <Button
                            variant="outlined"
                            component="span"
                            sx={{
                              mt: 2,
                              borderRadius: '12px',
                              borderColor: 'rgba(255, 255, 255, 0.2)',
                              color: 'white',
                              '&:hover': {
                                borderColor: 'primary.main',
                                background: 'rgba(108, 99, 255, 0.08)',
                              },
                            }}
                          >
                            Choose File
                          </Button>
                        </label>
                      </>
                    )}
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: '12px',
                    boxShadow: '0 8px 20px rgba(108, 99, 255, 0.3)',
                    '&:hover': {
                      boxShadow: '0 12px 30px rgba(108, 99, 255, 0.4)',
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Create Ticket'}
                </Button>
              </Box>
            </Paper>
          </TabPanel>

          {/* My Events Tab */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              {mockEvents.map(event => (
                <Grid item xs={12} md={4} key={event.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '16px',
                      background: 'rgba(28, 28, 56, 0.5)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 16px 30px rgba(0, 0, 0, 0.25)',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '4px',
                        background: 'linear-gradient(90deg, #6C63FF, #2DD4BF)',
                      },
                    }}
                  >
                    <Box sx={{ position: 'relative', pt: '56.25%', overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        image={event.image}
                        alt={event.name}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          background: 'rgba(0, 0, 0, 0.6)',
                          backdropFilter: 'blur(4px)',
                          borderRadius: '12px',
                          px: 1.5,
                          py: 0.5,
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.75rem',
                        }}
                      >
                        {new Date(event.date).toLocaleDateString()}
                      </Box>
                    </Box>

                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                        }}
                      >
                        {event.name}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Sales Progress
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(event.ticketsSold / event.totalTickets) * 100}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(90deg, #6C63FF, #2DD4BF)',
                              borderRadius: 4,
                            },
                          }}
                        />
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mt: 0.5,
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            {event.ticketsSold} sold
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {event.totalTickets} total
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mt: 'auto',
                          pt: 1,
                          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 'bold',
                            color: 'primary.main',
                          }}
                        >
                          {Math.round((event.ticketsSold / event.totalTickets) * 100)}% Sold
                        </Typography>

                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => navigate(`/event-details/${event.id}`)}
                          sx={{
                            borderRadius: '10px',
                            background: 'rgba(108, 99, 255, 0.2)',
                            color: 'white',
                            '&:hover': {
                              background: 'rgba(108, 99, 255, 0.3)',
                            },
                          }}
                        >
                          View Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>
        </Box>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
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
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiInputBase-input': {
    color: 'white',
  },
};

export default HostPage;
