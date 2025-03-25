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
} from '@mui/material';

// Temporary mock data
const mockUserNFTs = [
  {
    id: 1,
    title: 'My NFT #1',
    price: '0.5 ETH',
    image: 'https://via.placeholder.com/300',
    status: 'owned',
  },
  {
    id: 2,
    title: 'My NFT #2',
    price: '1.5 ETH',
    image: 'https://via.placeholder.com/300',
    status: 'created',
  },
];

const Profile = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Profile
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Wallet Address: 0x1234...5678
        </Typography>
      </Box>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 4 }}>
        <Tab label="My NFTs" />
        <Tab label="Created NFTs" />
        <Tab label="Activity" />
      </Tabs>

      {tabValue === 0 && (
        <Grid container spacing={4}>
          {mockUserNFTs
            .filter((nft) => nft.status === 'owned')
            .map((nft) => (
              <Grid item key={nft.id} xs={12} sm={6} md={4} lg={3}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={nft.image}
                    alt={nft.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {nft.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price: {nft.price}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      )}

      {tabValue === 1 && (
        <Grid container spacing={4}>
          {mockUserNFTs
            .filter((nft) => nft.status === 'created')
            .map((nft) => (
              <Grid item key={nft.id} xs={12} sm={6} md={4} lg={3}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={nft.image}
                    alt={nft.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {nft.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price: {nft.price}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      )}

      {tabValue === 2 && (
        <Box>
          <Typography variant="body1" color="text.secondary">
            No recent activity
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Profile; 