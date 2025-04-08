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

// Import asset paths directly
const getAssetPath = (path: string) => `${process.env.PUBLIC_URL}${path}`;

const nftAssets = {
  '1': getAssetPath('/assets/nft-icons/1.mp4'),
  '2': getAssetPath('/assets/nft-icons/2.gif'),
  '3': getAssetPath('/assets/nft-icons/3.mp4'),
  '4': getAssetPath('/assets/nft-icons/4.mp4'),
  '5': getAssetPath('/assets/nft-icons/5.mp4'),
  '6': getAssetPath('/assets/nft-icons/6.mp4'),
  '7': getAssetPath('/assets/nft-icons/7.mp4'),
  '8': getAssetPath('/assets/nft-icons/8.gif'),
  '9': getAssetPath('/assets/nft-icons/9.mp4'),
  '10': getAssetPath('/assets/nft-icons/10.gif'),
  '11': getAssetPath('/assets/nft-icons/11.gif'),
  '12': getAssetPath('/assets/nft-icons/12.gif'),
  '13': getAssetPath('/assets/nft-icons/13.mp4'),
  '14': getAssetPath('/assets/nft-icons/14.gif'),
  '15': getAssetPath('/assets/nft-icons/15.gif'),
  '16': getAssetPath('/assets/nft-icons/16.gif'),
  '17': getAssetPath('/assets/nft-icons/17.png'),
  '18': getAssetPath('/assets/nft-icons/18.gif'),
  '19': getAssetPath('/assets/nft-icons/19.gif'),
  '20': getAssetPath('/assets/nft-icons/20.gif'),
  '21': getAssetPath('/assets/nft-icons/21.gif'),
  '22': getAssetPath('/assets/nft-icons/22.gif'),
  '23': getAssetPath('/assets/nft-icons/23.gif'),
  '24': getAssetPath('/assets/nft-icons/24.gif'),
  '25': getAssetPath('/assets/nft-icons/25.mp4'),
  '26': getAssetPath('/assets/nft-icons/26.gif'),
  '27': getAssetPath('/assets/nft-icons/27.gif'),
  '28': getAssetPath('/assets/nft-icons/28.mp4'),
  '29': getAssetPath('/assets/nft-icons/29.gif'),
  '30': getAssetPath('/assets/nft-icons/30.gif'),
  '31': getAssetPath('/assets/nft-icons/31.mp4'),
  '32': getAssetPath('/assets/nft-icons/32.gif'),
  '33': getAssetPath('/assets/nft-icons/33.mp4'),
  '34': getAssetPath('/assets/nft-icons/34.gif'),
  '35': getAssetPath('/assets/nft-icons/35.gif'),
  '36': getAssetPath('/assets/nft-icons/36.jpg')
};

// Mock data for latest drops
const allNFTs = [
  {
    id: 1,
    title: 'Sufi Night with Kailash Kher',
    creator: 'Kailasa Band',
    price: '0.00069 ETH',
    image: nftAssets['4'],
    status: 'Now',
    isVerified: true
  },
  {
    id: 2,
    title: 'Pro Kabaddi Final',
    creator: 'PKL 2025',
    price: '0.005 ETH',
    image: nftAssets['5'],
    status: '23 hours',
    isVerified: true
  },
  {
    id: 3,
    title: 'Punjabi Beats ft. Diljit Dosanjh',
    creator: 'Diljit Live',
    price: '0.0038 ETH',
    image: nftAssets['6'],
    status: 'Now',
    isVerified: true
  },
  {
    id: 4,
    title: 'Spring Classical Gala',
    creator: 'IndianRaga Ensemble',
    price: '0.0004 ETH',
    image: nftAssets['7'],
    status: 'Now',
    isVerified: true
  },
  {
    id: 5,
    title: 'Techno Mahotsav',
    creator: 'Sunburn Goa',
    price: '0.0089 ETH',
    image: nftAssets['8'],
    status: 'Now',
    isVerified: true
  },
  {
    id: 6,
    title: 'India vs Australia – ODI Series',
    creator: 'BCCI Official',
    price: '0.0123 ETH',
    image: nftAssets['9'],
    status: '2 hours',
    isVerified: true
  },
  {
    id: 7,
    title: 'Midnight Indie Jam',
    creator: 'Prateek Kuhad',
    price: '0.0075 ETH',
    image: nftAssets['10'],
    status: 'Now',
    isVerified: true
  },
  {
    id: 8,
    title: 'Retro Bollywood Rewind',
    creator: 'Bollywood Classics',
    price: '0.0055 ETH',
    image: nftAssets['11'],
    status: '5 hours',
    isVerified: true
  },
  {
    id: 9,
    title: 'Indian Ocean - Live in Concert',
    creator: 'Indian Ocean Band',
    price: '0.0095 ETH',
    image: nftAssets['12'],
    status: 'Now',
    isVerified: true
  },
  {
    id: 10,
    title: 'Virtual Garba Night',
    creator: 'Gujarati Beats',
    price: '0.0082 ETH',
    image: nftAssets['13'],
    status: '12 hours',
    isVerified: true
  },
  {
    id: 11,
    title: 'Desi Hip-Hop Cypher',
    creator: 'Raftaar x KR$NA',
    price: '0.0067 ETH',
    image: nftAssets['14'],
    status: 'Now',
    isVerified: true
  },
  {
    id: 12,
    title: 'Monsoon Melodies',
    creator: 'Shreya Ghoshal',
    price: '0.0043 ETH',
    image: nftAssets['15'],
    status: '8 hours',
    isVerified: true
  },
  {
    id: 13,
    title: 'Mystic Folk Fusion',
    creator: 'Swarathma',
    price: '0.0091 ETH',
    image: nftAssets['16'],
    status: 'Now',
    isVerified: true
  },
  {
    id: 14,
    title: 'Formula India: Street Drift',
    creator: 'IN Drift League',
    price: '0.007 ETH',
    image: nftAssets['17'],
    status: '1 hour',
    isVerified: true
  },
  {
    id: 15,
    title: 'Rustic Symphony',
    creator: 'Rural Strings Ensemble',
    price: '0.0063 ETH',
    image: nftAssets['18'],
    status: 'Now',
    isVerified: false
  },
  {
    id: 16,
    title: 'Darkwave Delhi',
    creator: 'Synth Lab',
    price: '0.0056 ETH',
    image: nftAssets['19'],
    status: '3 hours',
    isVerified: true
  },
  {
    id: 17,
    title: 'Looped Motion Tour',
    creator: 'Nucleya Live',
    price: '0.0049 ETH',
    image: nftAssets['20'],
    status: 'Now',
    isVerified: false
  },
  {
    id: 18,
    title: 'Code & Chill Hackathon',
    creator: 'Dev Bharat',
    price: '0.0034 ETH',
    image: nftAssets['21'],
    status: '2 hours',
    isVerified: true
  },
  {
    id: 19,
    title: 'Cyber Sitar Night',
    creator: 'DJ Ravi + SitarFusion',
    price: '0.011 ETH',
    image: nftAssets['22'],
    status: 'Now',
    isVerified: true
  },
  {
    id: 20,
    title: 'Sky Lantern Festival',
    creator: 'Jaipur Nights',
    price: '0.0081 ETH',
    image: nftAssets['23'],
    status: '6 hours',
    isVerified: true
  }
];


const ITEMS_PER_PAGE = 5;

// Additional NFT collections
const trendingNFTs = allNFTs.filter(nft => nft.id >= 13 && nft.id <= 20).map(nft => ({
  ...nft,
  price: (parseFloat(nft.price) * 1.5).toFixed(4) + ' ETH', // Higher prices for trending
  status: Math.random() > 0.5 ? 'Trending' : 'Hot'
}));

const popularNFTs = allNFTs.filter(nft => nft.id >= 21 && nft.id <= 27).map(nft => ({
  ...nft,
  price: (parseFloat(nft.price) * 2).toFixed(4) + ' ETH', // Higher prices for popular
  status: Math.random() > 0.5 ? 'Popular' : 'Featured'
}));

const upcomingNFTs = allNFTs.filter(nft => nft.id >= 28 && nft.id <= 32).map(nft => ({
  ...nft,
  price: (parseFloat(nft.price) * 0.8).toFixed(4) + ' ETH', // Lower prices for upcoming
  status: Math.random() > 0.5 ? '1d left' : '2d left'
}));

// Fixed card dimensions for consistency
const CARD_WIDTH = 400;
const CARD_HEIGHT = 400;
const IMAGE_HEIGHT = 340;
const INFO_HEIGHT = 60;

// Memoize the MediaDisplay component to prevent unnecessary re-renders
const MediaDisplay = React.memo(({ src, alt, style }: { src: string, alt: string, style?: React.CSSProperties }) => {
  const isVideo = src.endsWith('.mp4');
  
  return isVideo ? (
    <video
      autoPlay
      loop
      muted
      playsInline
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center',
        ...style
      }}
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  ) : (
    <img
      src={src}
      alt={alt}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center',
        ...style
      }}
    />
  );
});

// Individual NFT Card component - memoized to prevent re-renders
const NFTCard = React.memo(({ 
  nft, 
  handleAddToCart,
  uniqueId
}: { 
  nft: any, 
  handleAddToCart: (nft: any) => void,
  uniqueId: string
}) => {
  // Use callback for add to cart to prevent recreation on each render
  const onAddToCart = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddToCart(nft);
  }, [nft, handleAddToCart]);

  return (
    <Card 
      sx={{ 
        bgcolor: 'rgba(22, 28, 36, 0.95)',
        borderRadius: 2,
        position: 'relative',
        height: `${CARD_HEIGHT}px`,
        width: `${CARD_WIDTH}px`,
        cursor: 'pointer',
        transition: 'transform 0.3s ease-in-out',
        overflow: 'hidden',
        '&:hover': {
          transform: 'scale(1.02)'
        }
      }}
    >
      <CardActionArea 
        sx={{ 
          height: '100%', 
          width: '100%',
          position: 'relative',
          display: 'block'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${IMAGE_HEIGHT}px`,
            overflow: 'hidden'
          }}
        >
          <MediaDisplay
            src={nft.image}
            alt={nft.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        </Box>
        
        {/* CSS-based hover overlay with optimized event handling */}
        <Box
          className="nft-hover-overlay"
          onClick={(e) => e.stopPropagation()}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: `${IMAGE_HEIGHT}px`,
            bgcolor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'opacity 0.3s ease-in-out',
            opacity: 0,
            pointerEvents: 'none',
            '.MuiCardActionArea-root:hover &': {
              opacity: 1,
              pointerEvents: 'auto',
            }
          }}
        >
          <Button
            variant="contained"
            onClick={onAddToCart}
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
          height: `${INFO_HEIGHT}px`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2" component="div" noWrap sx={{ color: 'white' }}>
            {nft.title}
          </Typography>
          {nft.isVerified && (
            <VerifiedIcon color="primary" sx={{ fontSize: 18, ml: 0.5 }} />
          )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" noWrap sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            {nft.creator}
          </Typography>
          <Typography variant="caption" color="primary" noWrap>
            {nft.price}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
});

// Create NFT Grid Section component with optimizations
const NFTGridSection = React.memo(({ 
    title, 
    nfts, 
    step, 
    isAnimating, 
    onNext, 
    onBack,
  sectionKey,
  handleAddToCart 
  }: { 
    title: string;
    nfts: any[];
    step: number;
    isAnimating: boolean;
    onNext: () => void;
    onBack: () => void;
    sectionKey: string;
  handleAddToCart: (nft: any) => void;
  }) => {
  // Memoize the slider content to prevent unnecessary re-renders
  const sliderContent = React.useMemo(() => {
    return nfts.map((nft) => {
      const uniqueId = `${sectionKey}-${nft.id}`;
      return (
        <Box
          key={nft.id}
          sx={{
            flex: `0 0 ${100 / ITEMS_PER_PAGE}%`,
            padding: '0 8px',
            height: `${CARD_HEIGHT}px`,
            display: 'flex',
            justifyContent: 'center',
            willChange: 'transform', // Hardware acceleration hint
          }}
        >
          <NFTCard 
            nft={nft} 
            handleAddToCart={handleAddToCart} 
            uniqueId={uniqueId} 
          />
        </Box>
      );
    });
  }, [nfts, sectionKey, handleAddToCart]);
  
  // Use callbacks for navigation to prevent recreation on each render
  const handleNextClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAnimating) onNext();
  }, [onNext, isAnimating]);
  
  const handleBackClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAnimating) onBack();
  }, [onBack, isAnimating]);
  
  // If there are no NFTs, return null after hooks are called
    if (nfts.length === 0) {
      return null;
    }
    
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

      <Box sx={{ 
        position: 'relative', 
        width: '100%', 
        overflow: 'hidden',
        height: `${CARD_HEIGHT}px`, // Fixed height for the container
      }}>
          <IconButton
          onClick={handleBackClick}
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
          onClick={handleNextClick}
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
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)', // Smoother easing
              transform: `translateX(-${step * (100 / ITEMS_PER_PAGE)}%)`,
              ml: 0,
                          height: '100%',
            willChange: 'transform', // Hardware acceleration hint
          }}
        >
          {sliderContent}
          </Box>
        </Box>
      </>
    );
});

const Marketplace = () => {
  const { searchTerm } = useSearch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search') || '';
  const { addToCart } = useCart(); // Use the cart context
  const { nfts: userCreatedNFTs } = useNFTs(); // Get user-created NFTs from context
  
  // States for each section
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
  const filterNFTs = React.useCallback((nfts: any[]) => {
    const searchLower = searchQuery.toLowerCase();
    return nfts.filter((nft) => (
      nft.title.toLowerCase().includes(searchLower) ||
      nft.creator.toLowerCase().includes(searchLower) ||
      nft.price.toLowerCase().includes(searchLower)
    ));
  }, [searchQuery]);

  // Memoize filtered arrays to prevent recalculation on every render
  const filteredNFTs = React.useMemo(() => filterNFTs(allNFTs), [filterNFTs, allNFTs]);
  const filteredTrendingNFTs = React.useMemo(() => filterNFTs(trendingNFTs), [filterNFTs, trendingNFTs]);
  const filteredPopularNFTs = React.useMemo(() => filterNFTs(popularNFTs), [filterNFTs, popularNFTs]);
  const filteredUpcomingNFTs = React.useMemo(() => filterNFTs(upcomingNFTs), [filterNFTs, upcomingNFTs]);
  const filteredUserNFTs = React.useMemo(() => filterNFTs(userCreatedNFTs), [filterNFTs, userCreatedNFTs]);

  // Optimize handlers to use useCallback
  const handleAddToCart = React.useCallback((nft: any) => {
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
  }, [addToCart]);

  // Navigation handlers for each section - updated to use useCallback
  const createHandlers = React.useCallback((
    currentStep: number,
    setStep: React.Dispatch<React.SetStateAction<number>>,
    setAnimating: React.Dispatch<React.SetStateAction<boolean>>,
    maxSteps: number
  ) => ({
    handleNext: () => {
      if (!setAnimating || currentStep >= maxSteps - 1) return;
      setAnimating(true);
      setStep((prev) => prev + 1); // Move one item at a time
      setTimeout(() => setAnimating(false), 300); // Reduce timeout for faster response
    },
    handleBack: () => {
      if (!setAnimating || currentStep <= 0) return;
      setAnimating(true);
      setStep((prev) => prev - 1); // Move one item at a time
      setTimeout(() => setAnimating(false), 300); // Reduce timeout for faster response
    }
  }), []);

  // Memoize handler creation to prevent recreation on every render
  const latestHandlers = React.useMemo(() => 
    createHandlers(activeStep, setActiveStep, setIsAnimating, filteredNFTs.length),
    [createHandlers, activeStep, filteredNFTs.length]);
    
  const trendingHandlers = React.useMemo(() => 
    createHandlers(trendingStep, setTrendingStep, setIsTrendingAnimating, filteredTrendingNFTs.length),
    [createHandlers, trendingStep, filteredTrendingNFTs.length]);
    
  const popularHandlers = React.useMemo(() => 
    createHandlers(popularStep, setPopularStep, setIsPopularAnimating, filteredPopularNFTs.length),
    [createHandlers, popularStep, filteredPopularNFTs.length]);
    
  const upcomingHandlers = React.useMemo(() => 
    createHandlers(upcomingStep, setUpcomingStep, setIsUpcomingAnimating, filteredUpcomingNFTs.length),
    [createHandlers, upcomingStep, filteredUpcomingNFTs.length]);
    
  const userNFTsHandlers = React.useMemo(() => 
    createHandlers(userNFTsStep, setUserNFTsStep, setIsUserNFTsAnimating, filteredUserNFTs.length),
    [createHandlers, userNFTsStep, filteredUserNFTs.length]);

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
          handleAddToCart={handleAddToCart}
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
        handleAddToCart={handleAddToCart}
      />
      
      <NFTGridSection
        title="Trending NFTs"
        nfts={filteredTrendingNFTs}
        step={trendingStep}
        isAnimating={isTrendingAnimating}
        onNext={trendingHandlers.handleNext}
        onBack={trendingHandlers.handleBack}
        sectionKey="trending"
        handleAddToCart={handleAddToCart}
      />
      
      <NFTGridSection
        title="Popular Collections"
        nfts={filteredPopularNFTs}
        step={popularStep}
        isAnimating={isPopularAnimating}
        onNext={popularHandlers.handleNext}
        onBack={popularHandlers.handleBack}
        sectionKey="popular"
        handleAddToCart={handleAddToCart}
      />
      
      <NFTGridSection
        title="Upcoming Drops"
        nfts={filteredUpcomingNFTs}
        step={upcomingStep}
        isAnimating={isUpcomingAnimating}
        onNext={upcomingHandlers.handleNext}
        onBack={upcomingHandlers.handleBack}
        sectionKey="upcoming"
        handleAddToCart={handleAddToCart}
      />
      
      <Snackbar
        open={showAddedToCart}
        autoHideDuration={2000} // Reduced duration for faster UX
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