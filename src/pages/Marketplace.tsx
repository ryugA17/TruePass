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
import { useNFTs } from '../context/NFTContext';

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
  const { nfts: userCreatedNFTs } = useNFTs(); // Get user-created NFTs from context
  
  // States for each section
  const [hoveredNFTId, setHoveredNFTId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [trendingStep, setTrendingStep] = useState(0);
  const [popularStep, setPopularStep] = useState(0);
  const [upcomingStep, setUpcomingStep] = useState(0);
  const [userNFTsStep, setUserNFTsStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isTrendingAnimating, setIsTrendingAnimating] = useState(false);
  const [isPopularAnimating, setIsPopularAnimating] = useState(false);
  const [isUpcomingAnimating, setIsUpcomingAnimating] = useState(false);
  const [isUserNFTsAnimating, setIsUserNFTsAnimating] = useState(false);
  const [showAddedToCart, setShowAddedToCart] = useState(false);

  // Reset pagination when search query changes
  useEffect(() => {
    setActiveStep(0);
    setTrendingStep(0);
    setPopularStep(0);
    setUpcomingStep(0);
    setUserNFTsStep(0);
  }, [searchQuery]);

  // Filter NFTs based on search term
  const filterNFTs = (nfts: any[]) => {
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
  const filteredUserNFTs = filterNFTs(userCreatedNFTs);

  // Navigation handlers for each section - updated for one-at-a-time navigation
  const createHandlers = (
    currentStep: number,
    setStep: React.Dispatch<React.SetStateAction<number>>,
    setAnimating: React.Dispatch<React.SetStateAction<boolean>>,
    maxSteps: number
  ) => ({
    handleNext: () => {
      if (!setAnimating || currentStep >= maxSteps - 1) return;
      setAnimating(true);
      setStep((prev) => prev + 1); // Move one item at a time
      setTimeout(() => setAnimating(false), 500);
    },
    handleBack: () => {
      if (!setAnimating || currentStep <= 0) return;
      setAnimating(true);
      setStep((prev) => prev - 1); // Move one item at a time
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
    nfts: any[];
    step: number;
    isAnimating: boolean;
    onNext: () => void;
    onBack: () => void;
    sectionKey: string;
  }) => {
    
    // If there are no NFTs, don't render the section
    if (nfts.length === 0) {
      return null;
    }
    
    // Handle adding an NFT to the cart
    const handleAddToCart = (nft: any) => {
      addToCart({
        id: nft.id,
        title: nft.title,
        creator: nft.creator,
        price: typeof nft.price === 'string' && nft.price.includes(' ') 
          ? nft.price.split(' ')[0] 
          : nft.price, // Handle different price formats
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
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              zIndex: 2,
              width: 48,
              height: 48,
              boxShadow: '0 0 10px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.2)',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.9)',
                border: '1px solid rgba(255,255,255,0.4)',
              },
              '&.Mui-disabled': {
                opacity: 0.3,
                display: 'flex'
              }
            }}
          >
            <KeyboardArrowLeft fontSize="large" />
          </IconButton>

          <IconButton
            onClick={onNext}
            disabled={step >= nfts.length - 1 || isAnimating}
            sx={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              zIndex: 2,
              width: 48,
              height: 48,
              boxShadow: '0 0 10px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.2)',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.9)',
                border: '1px solid rgba(255,255,255,0.4)',
              },
              '&.Mui-disabled': {
                opacity: 0.3,
                display: 'flex'
              }
            }}
          >
            <KeyboardArrowRight fontSize="large" />
          </IconButton>

          <Box
            sx={{
              display: 'flex',
              transition: 'transform 0.5s ease-in-out',
              transform: `translateX(-${step * (100 / ITEMS_PER_PAGE)}%)`,
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
                    flex: `0 0 ${100 / ITEMS_PER_PAGE}%`,
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
                            bgcolor: 'rgba(0, 0, 0, 0.7)',
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
                              fontWeight: 'bold',
                              '&:hover': {
                                bgcolor: 'white',
                                transform: 'scale(1.05)',
                                boxShadow: '0 4px 20px rgba(255,255,255,0.25)'
                              },
                              borderRadius: '20px',
                              padding: '8px 16px',
                            }}
                          >
                            Add to Cart
                          </Button>
                        </Box>
                      )}
                    </CardActionArea>
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        bgcolor: 'rgba(0, 0, 0, 0.8)',
                        p: 1,
                        borderBottomLeftRadius: 8,
                        borderBottomRightRadius: 8,
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" component="div" noWrap>
                          {nft.title}
                        </Typography>
                        {nft.isVerified && (
                          <VerifiedIcon color="primary" sx={{ fontSize: 18, ml: 0.5 }} />
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary" noWrap sx={{ opacity: 0.7 }}>
                          {nft.creator}
                        </Typography>
                        <Typography variant="caption" color="primary" noWrap>
                          {nft.price}
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

  const latestHandlers = createHandlers(activeStep, setActiveStep, setIsAnimating, filteredNFTs.length);
  const trendingHandlers = createHandlers(trendingStep, setTrendingStep, setIsTrendingAnimating, filteredTrendingNFTs.length);
  const popularHandlers = createHandlers(popularStep, setPopularStep, setIsPopularAnimating, filteredPopularNFTs.length);
  const upcomingHandlers = createHandlers(upcomingStep, setUpcomingStep, setIsUpcomingAnimating, filteredUpcomingNFTs.length);
  const userNFTsHandlers = createHandlers(userNFTsStep, setUserNFTsStep, setIsUserNFTsAnimating, filteredUserNFTs.length);

  return (
    <Container maxWidth="xl" sx={{ pt: 2, pb: 8 }}>
      {/* Show user-created NFTs first if any exist */}
      {filteredUserNFTs.length > 0 && (
        <NFTGridSection
          title="Your Creations"
          nfts={filteredUserNFTs}
          step={userNFTsStep}
          isAnimating={isUserNFTsAnimating}
          onNext={userNFTsHandlers.handleNext}
          onBack={userNFTsHandlers.handleBack}
          sectionKey="user-nfts"
        />
      )}
      
      <NFTGridSection
        title="Latest Drops"
        nfts={filteredNFTs}
        step={activeStep}
        isAnimating={isAnimating}
        onNext={latestHandlers.handleNext}
        onBack={latestHandlers.handleBack}
        sectionKey="latest"
      />
      
      <NFTGridSection
        title="Trending NFTs"
        nfts={filteredTrendingNFTs}
        step={trendingStep}
        isAnimating={isTrendingAnimating}
        onNext={trendingHandlers.handleNext}
        onBack={trendingHandlers.handleBack}
        sectionKey="trending"
      />
      
      <NFTGridSection
        title="Popular Collections"
        nfts={filteredPopularNFTs}
        step={popularStep}
        isAnimating={isPopularAnimating}
        onNext={popularHandlers.handleNext}
        onBack={popularHandlers.handleBack}
        sectionKey="popular"
      />
      
      <NFTGridSection
        title="Upcoming Drops"
        nfts={filteredUpcomingNFTs}
        step={upcomingStep}
        isAnimating={isUpcomingAnimating}
        onNext={upcomingHandlers.handleNext}
        onBack={upcomingHandlers.handleBack}
        sectionKey="upcoming"
      />
      
      <Snackbar
        open={showAddedToCart}
        autoHideDuration={3000}
        onClose={() => setShowAddedToCart(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={() => setShowAddedToCart(false)} severity="success" sx={{ width: '100%' }} variant="filled">
          NFT added to cart!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Marketplace; 