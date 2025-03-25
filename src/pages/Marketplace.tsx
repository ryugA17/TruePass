import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardMedia,
  Button,
  IconButton,
  CardActionArea,
  Stack,
  Snackbar,
  Alert
} from '@mui/material';
import { useSearch } from '../context/SearchContext';
import { useLocation } from 'react-router-dom';
import VerifiedIcon from '@mui/icons-material/Verified';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useCart } from '../context/CartContext';

// Use the same NFT data as Home page
const allNFTs = [
  {
    id: 1,
    title: 'Abstract Thought of Art',
    creator: 'ZafGod.eth',
    price: '0.00069 ETH',
    image: 'https://via.placeholder.com/400x400/1a237e/ffffff',
    status: 'Now',
    isVerified: true
  },
  {
    id: 2,
    title: 'Harvested Opulence',
    creator: 'Fame Identity',
    price: '0.005 ETH',
    image: 'https://via.placeholder.com/400x400/4a148c/ffffff',
    status: '23 hours',
    isVerified: true
  },
  {
    id: 3,
    title: 'RELAX',
    creator: 'brain pasta',
    price: '0.0038 ETH',
    image: 'https://via.placeholder.com/400x400/311b92/ffffff',
    status: 'Now',
    isVerified: true
  },
  {
    id: 4,
    title: 'Spring will come',
    creator: 'Reza Milani',
    price: '0.0004 ETH',
    image: 'https://via.placeholder.com/400x400/6a1b9a/ffffff',
    status: 'Now',
    isVerified: true
  },
  {
    id: 5,
    title: 'Cyber Dreams',
    creator: 'neon.eth',
    price: '0.0089 ETH',
    image: 'https://via.placeholder.com/400x400/00838f/ffffff',
    status: 'Now',
    isVerified: true
  },
  {
    id: 6,
    title: 'Digital Wilderness',
    creator: 'artmaster',
    price: '0.0123 ETH',
    image: 'https://via.placeholder.com/400x400/2e7d32/ffffff',
    status: '2 hours',
    isVerified: true
  },
  {
    id: 7,
    title: 'Neon Nights',
    creator: 'pixelart.eth',
    price: '0.0075 ETH',
    image: 'https://via.placeholder.com/400x400/c2185b/ffffff',
    status: 'Now',
    isVerified: true
  },
  {
    id: 8,
    title: 'Future Past',
    creator: 'retro.eth',
    price: '0.0055 ETH',
    image: 'https://via.placeholder.com/400x400/d84315/ffffff',
    status: '5 hours',
    isVerified: true
  },
  {
    id: 9,
    title: 'Quantum Dreams',
    creator: 'quantum.art',
    price: '0.0095 ETH',
    image: 'https://via.placeholder.com/400x400/4527a0/ffffff',
    status: 'Now',
    isVerified: true
  },
  {
    id: 10,
    title: 'Virtual Reality',
    creator: 'vr.master',
    price: '0.0082 ETH',
    image: 'https://via.placeholder.com/400x400/00695c/ffffff',
    status: '12 hours',
    isVerified: true
  },
  {
    id: 11,
    title: 'Digital Genesis',
    creator: 'crypto.art',
    price: '0.0067 ETH',
    image: 'https://via.placeholder.com/400x400/bf360c/ffffff',
    status: 'Now',
    isVerified: true
  },
  {
    id: 12,
    title: 'Pixel Paradise',
    creator: 'pixel.master',
    price: '0.0043 ETH',
    image: 'https://via.placeholder.com/400x400/0277bd/ffffff',
    status: '8 hours',
    isVerified: true
  }
];

const ITEMS_PER_PAGE = 5;

// Additional NFT collections
const trendingNFTs = allNFTs.map(nft => ({
  ...nft,
  price: (parseFloat(nft.price) * 1.5).toFixed(4) + ' ETH', // Higher prices for trending
  status: Math.random() > 0.5 ? 'Trending' : 'Hot'
}));

const popularNFTs = allNFTs.map(nft => ({
  ...nft,
  price: (parseFloat(nft.price) * 2).toFixed(4) + ' ETH', // Higher prices for popular
  status: Math.random() > 0.5 ? 'Popular' : 'Featured'
}));

const upcomingNFTs = allNFTs.map(nft => ({
  ...nft,
  price: (parseFloat(nft.price) * 0.8).toFixed(4) + ' ETH', // Lower prices for upcoming
  status: Math.random() > 0.5 ? '1d left' : '2d left'
}));

const Marketplace = () => {
  const { searchTerm } = useSearch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search') || '';
  const { addToCart } = useCart(); // Use the cart context
  
  // States for each section
  const [hoveredNFTId, setHoveredNFTId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [trendingStep, setTrendingStep] = useState(0);
  const [popularStep, setPopularStep] = useState(0);
  const [upcomingStep, setUpcomingStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isTrendingAnimating, setIsTrendingAnimating] = useState(false);
  const [isPopularAnimating, setIsPopularAnimating] = useState(false);
  const [isUpcomingAnimating, setIsUpcomingAnimating] = useState(false);
  const [showAddedToCart, setShowAddedToCart] = useState(false);

  // Reset pagination when search query changes
  useEffect(() => {
    setActiveStep(0);
    setTrendingStep(0);
    setPopularStep(0);
    setUpcomingStep(0);
  }, [searchQuery]);

  // Filter NFTs based on search term
  const filterNFTs = (nfts: typeof allNFTs) => {
    const searchLower = searchQuery.toLowerCase();
    return nfts.filter((nft) => (
      nft.title.toLowerCase().includes(searchLower) ||
      nft.creator.toLowerCase().includes(searchLower) ||
      nft.price.toLowerCase().includes(searchLower)
    ));
  };

  const filteredNFTs = filterNFTs(allNFTs);
  const filteredTrendingNFTs = filterNFTs(trendingNFTs);
  const filteredPopularNFTs = filterNFTs(popularNFTs);
  const filteredUpcomingNFTs = filterNFTs(upcomingNFTs);

  // Navigation handlers for each section
  const createHandlers = (
    currentStep: number,
    setStep: React.Dispatch<React.SetStateAction<number>>,
    setAnimating: React.Dispatch<React.SetStateAction<boolean>>,
    maxSteps: number
  ) => ({
    handleNext: () => {
      if (!setAnimating || currentStep >= maxSteps - 1) return;
      setAnimating(true);
      setStep((prev) => prev + 1);
      setTimeout(() => setAnimating(false), 500);
    },
    handleBack: () => {
      if (!setAnimating || currentStep <= 0) return;
      setAnimating(true);
      setStep((prev) => prev - 1);
      setTimeout(() => setAnimating(false), 500);
    }
  });

  // Create NFT Grid Section component
  const NFTGridSection = ({ 
    title, 
    nfts, 
    step, 
    isAnimating, 
    onNext, 
    onBack,
    sectionKey 
  }: { 
    title: string;
    nfts: typeof allNFTs;
    step: number;
    isAnimating: boolean;
    onNext: () => void;
    onBack: () => void;
    sectionKey: string;
  }) => {
    
    // Handle adding an NFT to the cart
    const handleAddToCart = (nft: any) => {
      addToCart({
        id: nft.id,
        title: nft.title,
        creator: nft.creator,
        price: nft.price.split(' ')[0], // Extract just the price number
        image: nft.image
      });
      setShowAddedToCart(true);
    };
    
    return (
      <>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4,
          mt: 8
        }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Box>

        <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
          <IconButton
            onClick={onBack}
            disabled={step === 0 || isAnimating}
            sx={{
              position: 'absolute',
              left: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              zIndex: 2,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)',
              },
              '&.Mui-disabled': {
                display: 'none'
              }
            }}
          >
            <KeyboardArrowLeft />
          </IconButton>

          <IconButton
            onClick={onNext}
            disabled={step >= Math.ceil(nfts.length / ITEMS_PER_PAGE) - 1 || isAnimating}
            sx={{
              position: 'absolute',
              right: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              zIndex: 2,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)',
              },
              '&.Mui-disabled': {
                display: 'none'
              }
            }}
          >
            <KeyboardArrowRight />
          </IconButton>

          <Box
            sx={{
              display: 'flex',
              transition: 'transform 0.5s ease-in-out',
              transform: `translateX(-${step * (100 / 5)}%)`,
              ml: 0,
            }}
          >
            {nfts.map((nft) => {
              // Create a unique ID for each NFT in each section
              const uniqueId = `${sectionKey}-${nft.id}`;
              
              return (
                <Box
                  key={nft.id}
                  sx={{
                    flex: `0 0 ${100 / 5}%`,
                    padding: '0 8px',
                    transition: 'all 0.5s ease-in-out',
                    opacity: 1,
                    transform: 'scale(1)',
                  }}
                >
                  <Card 
                    sx={{ 
                      bgcolor: 'rgba(22, 28, 36, 0.95)',
                      borderRadius: 2,
                      position: 'relative',
                      aspectRatio: '1/1',
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.02)'
                      }
                    }}
                    onMouseEnter={() => setHoveredNFTId(uniqueId)}
                    onMouseLeave={() => setHoveredNFTId(null)}
                  >
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        image={nft.image}
                        alt={nft.title}
                        sx={{ 
                          height: '100%',
                          width: '100%',
                          aspectRatio: '1/1'
                        }}
                      />
                      {hoveredNFTId === uniqueId && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            transition: 'all 0.3s ease-in-out'
                          }}
                        >
                          <Button
                            variant="contained"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(nft);
                            }}
                            sx={{
                              bgcolor: 'white',
                              color: 'black',
                              '&:hover': {
                                bgcolor: 'white',
                              },
                              borderRadius: '20px',
                              px: 3
                            }}
                          >
                            Add to Cart
                          </Button>
                        </Box>
                      )}
                    </CardActionArea>
                    <Box sx={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      left: 0, 
                      right: 0,
                      p: 2,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ color: 'grey.400' }}>
                          {nft.creator}
                        </Typography>
                        {nft.isVerified && (
                          <VerifiedIcon sx={{ fontSize: 16, color: '#2196f3' }} />
                        )}
                      </Box>
                      <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {nft.title}
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 1 
                      }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'grey.400' }}>
                            Price
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                            {nft.price}
                          </Typography>
                        </Box>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: nft.status === 'Now' ? '#4caf50' : 'white',
                            fontWeight: 'bold'
                          }}
                        >
                          • {nft.status}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Box>
              );
            })}
          </Box>
        </Box>
      </>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, pb: 8 }}>
      {/* Latest Drops Section */}
      <NFTGridSection
        title="Latest Drops"
        nfts={filteredNFTs}
        step={activeStep}
        isAnimating={isAnimating}
        onNext={createHandlers(activeStep, setActiveStep, setIsAnimating, Math.ceil(filteredNFTs.length / ITEMS_PER_PAGE)).handleNext}
        onBack={createHandlers(activeStep, setActiveStep, setIsAnimating, Math.ceil(filteredNFTs.length / ITEMS_PER_PAGE)).handleBack}
        sectionKey="latest"
      />

      {/* Trending NFTs Section */}
      <NFTGridSection
        title="Trending NFTs"
        nfts={filteredTrendingNFTs}
        step={trendingStep}
        isAnimating={isTrendingAnimating}
        onNext={createHandlers(trendingStep, setTrendingStep, setIsTrendingAnimating, Math.ceil(filteredTrendingNFTs.length / ITEMS_PER_PAGE)).handleNext}
        onBack={createHandlers(trendingStep, setTrendingStep, setIsTrendingAnimating, Math.ceil(filteredTrendingNFTs.length / ITEMS_PER_PAGE)).handleBack}
        sectionKey="trending"
      />

      {/* Popular Collections */}
      <NFTGridSection
        title="Popular Collections"
        nfts={filteredPopularNFTs}
        step={popularStep}
        isAnimating={isPopularAnimating}
        onNext={createHandlers(popularStep, setPopularStep, setIsPopularAnimating, Math.ceil(filteredPopularNFTs.length / ITEMS_PER_PAGE)).handleNext}
        onBack={createHandlers(popularStep, setPopularStep, setIsPopularAnimating, Math.ceil(filteredPopularNFTs.length / ITEMS_PER_PAGE)).handleBack}
        sectionKey="popular"
      />

      {/* Upcoming Drops */}
      <NFTGridSection
        title="Upcoming Drops"
        nfts={filteredUpcomingNFTs}
        step={upcomingStep}
        isAnimating={isUpcomingAnimating}
        onNext={createHandlers(upcomingStep, setUpcomingStep, setIsUpcomingAnimating, Math.ceil(filteredUpcomingNFTs.length / ITEMS_PER_PAGE)).handleNext}
        onBack={createHandlers(upcomingStep, setUpcomingStep, setIsUpcomingAnimating, Math.ceil(filteredUpcomingNFTs.length / ITEMS_PER_PAGE)).handleBack}
        sectionKey="upcoming"
      />

      {filteredNFTs.length === 0 && (
        <Box sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No NFTs found matching your search criteria
          </Typography>
        </Box>
      )}

      <Snackbar
        open={showAddedToCart}
        autoHideDuration={2000}
        onClose={() => setShowAddedToCart(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" variant="filled">
          Item added to cart!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Marketplace; 