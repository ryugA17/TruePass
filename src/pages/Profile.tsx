import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Tabs,
  Tab,
  Chip,
  Avatar,
  Button,
  CardActions,
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useAuth } from '../context/AuthContext';
import { useNFTs } from '../context/NFTContext';

const Profile = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const { user } = useAuth();
  const { nfts } = useNFTs();
  
  // Filter NFTs created by the current user
  const userCreatedNFTs = nfts.filter(nft => nft.creator === user?.email);
  
  // For simplicity, we'll consider all other NFTs as "owned"
  // In a real app, you'd have a separate owned NFTs collection
  const ownedNFTs = nfts.filter(nft => nft.creator !== user?.email).slice(0, 3);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ 
        mb: 4, 
        p: 3, 
        borderRadius: 2, 
        background: 'rgba(22, 28, 36, 0.8)', 
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 3
      }}>
        <Avatar
          sx={{
            width: 100,
            height: 100,
            bgcolor: 'primary.main',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
          }}
        >
          {user?.email.charAt(0).toUpperCase() || 'U'}
        </Avatar>
        
        <Box>
          <Typography variant="h4" component="h1" gutterBottom color="white">
            {user?.email.split('@')[0] || 'User'}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            {user?.email || 'user@example.com'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Chip 
              label={`${userCreatedNFTs.length} Created`} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
            <Chip 
              label={`${ownedNFTs.length} Owned`} 
              size="small" 
              color="secondary" 
              variant="outlined"
            />
          </Box>
        </Box>
      </Box>

      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        sx={{ 
          mb: 4,
          '& .MuiTabs-indicator': {
            backgroundColor: 'primary.main',
          },
          '& .MuiTab-root': {
            color: 'rgba(255,255,255,0.7)',
            '&.Mui-selected': {
              color: 'white',
            },
          },
        }}
      >
        <Tab label="My NFTs" />
        <Tab label="Created NFTs" />
        <Tab label="Activity" />
      </Tabs>

      {tabValue === 0 && (
        <Grid container spacing={4}>
          {ownedNFTs.length > 0 ? (
            ownedNFTs.map((nft) => (
              <Grid item key={nft.id} xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  bgcolor: 'rgba(22, 28, 36, 0.95)',
                  borderRadius: 2,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.3)'
                  }
                }}>
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={nft.image}
                      alt={nft.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <Box sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8, 
                      bgcolor: 'rgba(0,0,0,0.6)', 
                      borderRadius: 1,
                      px: 1, 
                      py: 0.5
                    }}>
                      <Typography variant="caption" sx={{ color: 'white' }}>
                        {nft.status}
                      </Typography>
                    </Box>
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography gutterBottom variant="h6" component="div" sx={{ mr: 0.5, color: 'white' }}>
                        {nft.title}
                      </Typography>
                      {nft.isVerified && <VerifiedIcon color="primary" fontSize="small" />}
                    </Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                      Creator: {nft.creator}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                      {nft.price}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 1 }}>
                      {nft.description && nft.description.substring(0, 60)}
                      {nft.description && nft.description.length > 60 ? '...' : ''}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" variant="outlined" fullWidth>
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Box sx={{ width: '100%', py: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                You don't own any NFTs yet.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mt: 2 }}
                href="/marketplace"
              >
                Browse Marketplace
              </Button>
            </Box>
          )}
        </Grid>
      )}

      {tabValue === 1 && (
        <Grid container spacing={4}>
          {userCreatedNFTs.length > 0 ? (
            userCreatedNFTs.map((nft) => (
              <Grid item key={nft.id} xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  bgcolor: 'rgba(22, 28, 36, 0.95)',
                  borderRadius: 2,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.3)'
                  }
                }}>
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={nft.image}
                      alt={nft.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <Box sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8, 
                      bgcolor: 'rgba(0,0,0,0.6)', 
                      borderRadius: 1,
                      px: 1, 
                      py: 0.5
                    }}>
                      <Typography variant="caption" sx={{ color: 'white' }}>
                        {nft.status}
                      </Typography>
                    </Box>
                    <Chip 
                      label="Created by you" 
                      size="small" 
                      color="primary"
                      sx={{ 
                        position: 'absolute', 
                        bottom: 8, 
                        left: 8, 
                        bgcolor: 'primary.main'
                      }} 
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography gutterBottom variant="h6" component="div" sx={{ mr: 0.5, color: 'white' }}>
                        {nft.title}
                      </Typography>
                      {nft.isVerified && <VerifiedIcon color="primary" fontSize="small" />}
                    </Box>
                    <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                      {nft.price}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 1 }}>
                      {nft.description && nft.description.substring(0, 60)}
                      {nft.description && nft.description.length > 60 ? '...' : ''}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" variant="outlined" fullWidth>
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Box sx={{ width: '100%', py: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                You haven't created any NFTs yet.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mt: 2 }}
                href="/create-nft"
              >
                Create NFT
              </Button>
            </Box>
          )}
        </Grid>
      )}

      {tabValue === 2 && (
        <Box sx={{ 
          p: 3, 
          borderRadius: 2, 
          background: 'rgba(22, 28, 36, 0.8)', 
          textAlign: 'center',
          py: 8
        }}>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            No recent activity
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 1 }}>
            Your transaction history will appear here
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Profile; 