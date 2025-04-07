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
import { useNavigate, useLocation } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import VerifiedIcon from '@mui/icons-material/Verified';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCart } from '../context/CartContext';

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

// Featured NFTs data
const featuredNFTs = [
  {
    "title": "Dreamscape",
    "creator": "PixelWizard.eth",
    "platform": "Surreal",
    "price": "0.00420 ETH",
    "description": "A journey into the subconscious through shapes and shades. Vibrant hues meet deep symbolism.",
    "image": nftAssets['1'],
    "status": "AVAILABLE NOW",
    "mintedCount": "24",
    "maxPerWallet": "5",
    timeLeft: "2d 23h",
    isVerified: true,
    gradient: 'linear-gradient(135deg, #00ff9d 0%, #00ff9d40 100%)'
  },
  {
    title: "Digital Renaissance",
    creator: "CryptoMaster.eth",
    platform: "Abstract",
    price: "0.0089 ETH",
    description: "A fusion of classical art and digital innovation, where Renaissance masterpieces meet contemporary digital techniques. Each stroke represents the bridge between centuries of artistic evolution...",
    image: nftAssets['2'],
    status: "MINTING NOW",
    mintedCount: "8",
    maxPerWallet: "5",
    timeLeft: "1d 12h",
    isVerified: true,
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF6B6B40 100%)'
  },
  {
    title: "Quantum Dreamscape",
    creator: "NeonArtist.eth",
    platform: "Abstract",
    price: "0.0075 ETH",
    description: "Dive into a world where quantum mechanics meets digital art. This piece explores the multiple realities of our existence through vibrant colors and geometric patterns...",
    image: nftAssets['3'],
    status: "MINTING NOW",
    mintedCount: "15",
    maxPerWallet: "8",
    timeLeft: "3d 8h",
    isVerified: true,
    gradient: 'linear-gradient(135deg, #4E65FF 0%, #4E65FF40 100%)'
  }
];

// Mock data for latest drops
const allNFTs = [
  {
    id: 1,
    title: 'Abstract Thought of Art',
    creator: 'ZafGod.eth',
    price: '0.00069 ETH',
    image: nftAssets['4'],
    status: 'Now',
    isVerified: true
  },
  {
    id: 2,
    title: 'Harvested Opulence',
    creator: 'Fame Identity',
    price: '0.005 ETH',
    image: nftAssets['5'],
    status: '23 hours',
    isVerified: true
  },
  {
    id: 3,
    title: 'RELAX',
    creator: 'brain pasta',
    price: '0.0038 ETH',
    image: nftAssets['6'],
    status: 'Now',
    isVerified: true
  },
  {
    id: 4,
    title: 'Spring will come',
    creator: 'Reza Milani',
    price: '0.0004 ETH',
    image: nftAssets['7'],
    status: 'Now',
    isVerified: true
  },
  {
    id: 5,
    title: 'Cyber Dreams',
    creator: 'neon.eth',
    price: '0.0089 ETH',
    image: nftAssets['8'],
    status: 'Now',
    isVerified: true
  },
  {
    id: 6,
    title: 'Digital Wilderness',
    creator: 'artmaster',
    price: '0.0123 ETH',
    image: nftAssets['9'],
    status: '2 hours',
    isVerified: true
  },
  {
    id: 7,
    title: 'Neon Nights',
    creator: 'pixelart.eth',
    price: '0.0075 ETH',
    image: nftAssets['10'],
    status: 'Now',
    isVerified: true
  },
  {
    id: 8,
    title: 'Future Past',
    creator: 'retro.eth',
    price: '0.0055 ETH',
    image: nftAssets['11'],
    status: '5 hours',
    isVerified: true
  },
  {
    id: 9,
    title: 'Quantum Dreams',
    creator: 'quantum.art',
    price: '0.0095 ETH',
    image: nftAssets['12'],
    status: 'Now',
    isVerified: true
  },
  {
    id: 10,
    title: 'Virtual Reality',
    creator: 'vr.master',
    price: '0.0082 ETH',
    image: nftAssets['13'],
    status: '12 hours',
    isVerified: true
  },
  {
    id: 11,
    title: 'Digital Genesis',
    creator: 'crypto.art',
    price: '0.0067 ETH',
    image: nftAssets['14'],
    status: 'Now',
    isVerified: true
  },
  {
    id: 12,
    title: 'Pixel Paradise',
    creator: 'pixel.master',
    price: '0.0043 ETH',
    image: nftAssets['15'],
    status: '8 hours',
    isVerified: true
  },{
    id: 13,
    title: 'Spectral Mirage',
    creator: 'VoidCrafter.eth',
    price: '0.0091 ETH',
    image: nftAssets['16'],
    status: 'Now',
    isVerified: true
  },
  {
    id: 14,
    title: 'Drift Circuit',
    creator: 'HelixDriver',
    price: '0.007 ETH',
    image: nftAssets['17'],
    status: '1 hour',
    isVerified: true
  },
  {
    id: 15,
    title: 'Rustcore Bloom',
    creator: 'IronMoth',
    price: '0.0063 ETH',
    image: nftAssets['18'],
    status: 'Now',
    isVerified: false
  },
  {
    id: 16,
    title: 'Liminal Tape',
    creator: 'NoSignal404',
    price: '0.0056 ETH',
    image: nftAssets['19'],
    status: '3 hours',
    isVerified: true
  },
  {
    id: 17,
    title: 'PERFECTL00P: Link Formations',
    creator: 'StudioEcho',
    price: '0.0049 ETH',
    image: nftAssets['20'],
    status: 'Now',
    isVerified: false
  },
  {
    id: 18,
    title: 'Dreams in Ascii',
    creator: 'bitform',
    price: '0.0034 ETH',
    image: nftAssets['21'],
    status: '2 hours',
    isVerified: true
  },
  {
    id: 19,
    title: 'Shadow Protocol',
    creator: 'EncryptedArtz',
    price: '0.011 ETH',
    image: nftAssets['22'],
    status: 'Now',
    isVerified: true
  },
  {
    id: 20,
    title: 'Skybound Memories',
    creator: 'CloudWalker',
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

// Fixed dimensions for featured section
const FEATURED_HEIGHT = 400;
const FEATURED_WIDTH = 1150; // Double the card width since it's a featured item

// Create a component to handle different media types (videos and images)
const MediaDisplay = ({ src, alt, style }: { src: string, alt: string, style?: React.CSSProperties }) => {
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
};

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchTerm } = useSearch();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search') || '';
  const { addToCart } = useCart();
  
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
  const [activeFeaturedStep, setActiveFeaturedStep] = useState(0);
  const [isFeaturedAnimating, setIsFeaturedAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [mintQuantity, setMintQuantity] = useState(1);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const maxSteps = allNFTs.length;
  const maxFeaturedSteps = featuredNFTs.length;

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

  const handleFeaturedNext = () => {
    if (isFeaturedAnimating || activeFeaturedStep >= maxFeaturedSteps - 1) return;
    setIsFeaturedAnimating(true);
    setActiveFeaturedStep((prevStep) => prevStep + 1);
    setTimeout(() => setIsFeaturedAnimating(false), 500);
  };

  const handleFeaturedBack = () => {
    if (isFeaturedAnimating || activeFeaturedStep <= 0) return;
    setIsFeaturedAnimating(true);
    setActiveFeaturedStep((prevStep) => prevStep - 1);
    setTimeout(() => setIsFeaturedAnimating(false), 500);
  };

  // Calculate which NFTs to show with one item sliding
  const visibleNFTs = allNFTs.slice(
    Math.max(0, activeStep - 2),
    Math.min(activeStep + 3, allNFTs.length)
  );

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
    
    // If there are no NFTs, don't render the section
    if (nfts.length === 0) {
      return null;
    }
    
    const handleAddToCart = (nft: any) => {
      addToCart({
        id: nft.id,
        title: nft.title,
        creator: nft.creator,
        price: typeof nft.price === 'string' && nft.price.includes(' ') 
          ? nft.price.split(' ')[0] 
          : nft.price,
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

        <Box sx={{ 
          position: 'relative', 
          width: '100%', 
          overflow: 'hidden',
          height: `${CARD_HEIGHT}px`, // Fixed height for the container
        }}>
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
              height: '100%',
            }}
          >
            {nfts.map((nft) => {
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
                    height: `${CARD_HEIGHT}px`,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
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
                    onMouseEnter={() => setHoveredNFTId(uniqueId)}
                    onMouseLeave={() => setHoveredNFTId(null)}
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
                      
                      {hoveredNFTId === uniqueId && (
                        <Box
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

  return (
    <Container maxWidth="xl" sx={{ pt: 2, pb: 8 }}>
      {/* Featured NFT Section with video background */}
      <Box 
        sx={{ 
          width: '100vw',
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          py: 4,
          mb: 4,
          overflow: 'hidden',
        }}
      >
        {/* Video Background */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(5, 14, 66, 0.3)', // Reduced opacity to let the video show through better
              zIndex: 1
            }
          }}
        >
          <video
            autoPlay
            muted
            loop
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
            }}
          >
            <source src="./videos/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>

        <Container 
          maxWidth="xl" 
          sx={{ 
            position: 'relative',
            zIndex: 1 // Ensure content appears above the video
          }}
        >
          <Box sx={{ 
            position: 'relative', 
            width: '100%', 
            overflow: 'hidden', 
            height: `${FEATURED_HEIGHT}px`,
          }}>
            <IconButton
              onClick={handleFeaturedBack}
              disabled={activeFeaturedStep === 0 || isFeaturedAnimating}
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
              onClick={handleFeaturedNext}
              disabled={activeFeaturedStep >= maxFeaturedSteps - 1 || isFeaturedAnimating}
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
                transform: `translateX(-${activeFeaturedStep * 100}%)`,
                height: '100%',
              }}
            >
              {featuredNFTs.map((nft, index) => (
                <Box
                  key={index}
                  sx={{ 
                    flex: '0 0 100%',
                    transition: 'all 0.5s ease-in-out',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      borderRadius: 4,
                      overflow: 'hidden',
                      background: nft.gradient,
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      width: `${FEATURED_WIDTH}px`,
                      height: '100%',
                    }}
                  >
                    <Grid container spacing={0} sx={{ height: '100%' }}>
                      <Grid item xs={12} md={6} sx={{ 
                        p: 3,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            bgcolor: 'rgba(0, 0, 0, 0.2)',
                            color: nft.gradient.includes('#00ff9d') ? '#00ff9d' : 'white',
                            px: 2,
                            py: 0.5,
                            borderRadius: 2,
                            mb: 1,
                            display: 'inline-block'
                          }}
                        >
                          {nft.status}
                        </Typography>
                        
                        <Typography variant="h4" component="h1" sx={{ mt: 1, mb: 1, fontWeight: 'bold', color: '#000' }}>
                          {nft.title}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Typography variant="body2" sx={{ color: '#000' }}>by</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#000' }}>{nft.creator}</Typography>
                            {nft.isVerified && <VerifiedIcon sx={{ fontSize: 16, color: '#2196f3' }} />}
                          </Box>
                          <Typography variant="body2" sx={{ color: '#000' }}>on</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#000' }}>{nft.platform}</Typography>
                        </Box>

                        <Typography variant="body2" sx={{ mb: 2, color: '#000', opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {nft.description}
                        </Typography>

                        <Box sx={{ 
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: 2,
                          p: 2,
                          mb: 2
                        }}>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ color: '#000', fontWeight: 'bold' }}>
                                {nft.price}
                              </Typography>
                              
                              <Button
                                variant="contained"
                                sx={{
                                  bgcolor: '#000',
                                  color: '#fff',
                                  px: 3,
                                  py: 1,
                                  borderRadius: 2,
                                  '&:hover': {
                                    bgcolor: 'rgba(0, 0, 0, 0.8)',
                                  }
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart({
                                    id: index + 100,
                                    title: nft.title,
                                    creator: nft.creator,
                                    price: nft.price.split(' ')[0],
                                    image: nft.image
                                  });
                                  setShowAddedToCart(true);
                                }}
                              >
                                Add to Cart
                              </Button>
                            </Box>
                          </Stack>
                        </Box>

                        <Stack direction="row" spacing={3} sx={{ color: '#000', mt: 'auto' }}>
                          <Box>
                            <Typography variant="caption">Minted</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{nft.mintedCount} minted</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption">Per wallet</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{nft.maxPerWallet} per wallet</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption">Time left</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{nft.timeLeft} left</Typography>
                          </Box>
                        </Stack>
                      </Grid>

                      <Grid item xs={12} md={6} sx={{ height: '100%' }}>
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            position: 'relative',
                          }}
                          onMouseEnter={() => setHoveredNFTId(`featured-${index}`)}
                          onMouseLeave={() => setHoveredNFTId(null)}
                        >
                          <MediaDisplay
                            src={nft.image}
                            alt={nft.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                          
                          {hoveredNFTId === `featured-${index}` && (
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
                                  addToCart({
                                    id: index + 100,
                                    title: nft.title,
                                    creator: nft.creator,
                                    price: nft.price.split(' ')[0],
                                    image: nft.image
                                  });
                                  setShowAddedToCart(true);
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
                                Quick Add
                              </Button>
                            </Box>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Latest NFTs Section */}
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
        <Alert 
          onClose={() => setShowAddedToCart(false)} 
          severity="success" 
          sx={{ width: '100%' }} 
          variant="filled"
        >
          NFT added to cart!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Home; 