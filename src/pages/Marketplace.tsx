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
  Alert,
  Chip,
  Divider,
  Paper,
} from '@mui/material';
import { useSearch } from '../context/SearchContext';
import { useLocation, useNavigate } from 'react-router-dom';
import VerifiedIcon from '@mui/icons-material/Verified';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
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
  '36': getAssetPath('/assets/nft-icons/36.jpg'),
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
    isVerified: true,
  },
  {
    id: 2,
    title: 'Pro Kabaddi Final',
    creator: 'PKL 2025',
    price: '0.005 ETH',
    image: nftAssets['5'],
    status: '23 hours',
    isVerified: true,
  },
  {
    id: 3,
    title: 'Punjabi Beats ft. Diljit Dosanjh',
    creator: 'Diljit Live',
    price: '0.0038 ETH',
    image: nftAssets['6'],
    status: 'Now',
    isVerified: true,
  },
  {
    id: 4,
    title: 'Spring Classical Gala',
    creator: 'IndianRaga Ensemble',
    price: '0.0004 ETH',
    image: nftAssets['7'],
    status: 'Now',
    isVerified: true,
  },
  {
    id: 5,
    title: 'Techno Mahotsav',
    creator: 'Sunburn Goa',
    price: '0.0089 ETH',
    image: nftAssets['8'],
    status: 'Now',
    isVerified: true,
  },
  {
    id: 6,
    title: 'India vs Australia – ODI Series',
    creator: 'BCCI Official',
    price: '0.0123 ETH',
    image: nftAssets['9'],
    status: '2 hours',
    isVerified: true,
  },
  {
    id: 7,
    title: 'Midnight Indie Jam',
    creator: 'Prateek Kuhad',
    price: '0.0075 ETH',
    image: nftAssets['10'],
    status: 'Now',
    isVerified: true,
  },
  {
    id: 8,
    title: 'Retro Bollywood Rewind',
    creator: 'Bollywood Classics',
    price: '0.0055 ETH',
    image: nftAssets['11'],
    status: '5 hours',
    isVerified: true,
  },
  {
    id: 9,
    title: 'Indian Ocean - Live in Concert',
    creator: 'Indian Ocean Band',
    price: '0.0095 ETH',
    image: nftAssets['12'],
    status: 'Now',
    isVerified: true,
  },
  {
    id: 10,
    title: 'Virtual Garba Night',
    creator: 'Gujarati Beats',
    price: '0.0082 ETH',
    image: nftAssets['13'],
    status: '12 hours',
    isVerified: true,
  },
  {
    id: 11,
    title: 'Desi Hip-Hop Cypher',
    creator: 'Raftaar x KR$NA',
    price: '0.0067 ETH',
    image: nftAssets['14'],
    status: 'Now',
    isVerified: true,
  },
  {
    id: 12,
    title: 'Monsoon Melodies',
    creator: 'Shreya Ghoshal',
    price: '0.0043 ETH',
    image: nftAssets['15'],
    status: '8 hours',
    isVerified: true,
  },
  {
    id: 13,
    title: 'Mystic Folk Fusion',
    creator: 'Swarathma',
    price: '0.0091 ETH',
    image: nftAssets['16'],
    status: 'Now',
    isVerified: true,
  },
  {
    id: 14,
    title: 'Formula India: Street Drift',
    creator: 'IN Drift League',
    price: '0.007 ETH',
    image: nftAssets['17'],
    status: '1 hour',
    isVerified: true,
  },
  {
    id: 15,
    title: 'Rustic Symphony',
    creator: 'Rural Strings Ensemble',
    price: '0.0063 ETH',
    image: nftAssets['18'],
    status: 'Now',
    isVerified: false,
  },
  {
    id: 16,
    title: 'Darkwave Delhi',
    creator: 'Synth Lab',
    price: '0.0056 ETH',
    image: nftAssets['19'],
    status: '3 hours',
    isVerified: true,
  },
  {
    id: 17,
    title: 'Looped Motion Tour',
    creator: 'Nucleya Live',
    price: '0.0049 ETH',
    image: nftAssets['20'],
    status: 'Now',
    isVerified: false,
  },
  {
    id: 18,
    title: 'Code & Chill Hackathon',
    creator: 'Dev Bharat',
    price: '0.0034 ETH',
    image: nftAssets['21'],
    status: '2 hours',
    isVerified: true,
  },
  {
    id: 19,
    title: 'Cyber Sitar Night',
    creator: 'DJ Ravi + SitarFusion',
    price: '0.011 ETH',
    image: nftAssets['22'],
    status: 'Now',
    isVerified: true,
  },
  {
    id: 20,
    title: 'Sky Lantern Festival',
    creator: 'Jaipur Nights',
    price: '0.0081 ETH',
    image: nftAssets['23'],
    status: '6 hours',
    isVerified: true,
  },
];

const ITEMS_PER_PAGE = 5;

// Additional NFT collections
const trendingNFTs = allNFTs
  .filter(nft => nft.id >= 13 && nft.id <= 20)
  .map(nft => ({
    ...nft,
    price: (parseFloat(nft.price) * 1.5).toFixed(4) + ' ETH', // Higher prices for trending
    status: Math.random() > 0.5 ? 'Trending' : 'Hot',
  }));

const popularNFTs = allNFTs
  .filter(nft => nft.id >= 21 && nft.id <= 27)
  .map(nft => ({
    ...nft,
    price: (parseFloat(nft.price) * 2).toFixed(4) + ' ETH', // Higher prices for popular
    status: Math.random() > 0.5 ? 'Popular' : 'Featured',
  }));

const upcomingNFTs = allNFTs
  .filter(nft => nft.id >= 28 && nft.id <= 32)
  .map(nft => ({
    ...nft,
    price: (parseFloat(nft.price) * 0.8).toFixed(4) + ' ETH', // Lower prices for upcoming
    status: Math.random() > 0.5 ? '1d left' : '2d left',
  }));

// Fixed card dimensions for consistency
const CARD_WIDTH = 400;
const CARD_HEIGHT = 400;
const IMAGE_HEIGHT = 340;
const INFO_HEIGHT = 60;

// Memoize the MediaDisplay component to prevent unnecessary re-renders
const MediaDisplay = React.memo(
  ({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) => {
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
          ...style,
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
          ...style,
        }}
      />
    );
  }
);

// Individual NFT Card component - memoized to prevent re-renders
const NFTCard = React.memo(
  ({
    nft,
    handleAddToCart,
    uniqueId,
  }: {
    nft: any;
    handleAddToCart: (nft: any) => void;
    uniqueId: string;
  }) => {
    // Use callback for add to cart to prevent recreation on each render
    const onAddToCart = React.useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        handleAddToCart(nft);
      },
      [nft, handleAddToCart]
    );

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
            transform: 'scale(1.02)',
          },
        }}
      >
        <CardActionArea
          sx={{
            height: '100%',
            width: '100%',
            position: 'relative',
            display: 'block',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${IMAGE_HEIGHT}px`,
              overflow: 'hidden',
            }}
          >
            <MediaDisplay
              src={nft.image}
              alt={nft.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          </Box>

          {/* CSS-based hover overlay with optimized event handling */}
          <Box
            className="nft-hover-overlay"
            onClick={e => e.stopPropagation()}
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
              },
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
                  boxShadow: '0 4px 20px rgba(255,255,255,0.25)',
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
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2" component="div" noWrap sx={{ color: 'white' }}>
              {nft.title}
            </Typography>
            {nft.isVerified && <VerifiedIcon color="primary" sx={{ fontSize: 18, ml: 0.5 }} />}
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
  }
);

// Create NFT Grid Section component with optimizations
const NFTGridSection = React.memo(
  ({
    title,
    nfts,
    step,
    isAnimating,
    onNext,
    onBack,
    sectionKey,
    handleAddToCart,
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
      return nfts.map(nft => {
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
            <NFTCard nft={nft} handleAddToCart={handleAddToCart} uniqueId={uniqueId} />
          </Box>
        );
      });
    }, [nfts, sectionKey, handleAddToCart]);

    // Use callbacks for navigation to prevent recreation on each render
    const handleNextClick = React.useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAnimating) onNext();
      },
      [onNext, isAnimating]
    );

    const handleBackClick = React.useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAnimating) onBack();
      },
      [onBack, isAnimating]
    );

    // If there are no NFTs, return null after hooks are called
    if (nfts.length === 0) {
      return null;
    }

    return (
      <>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
            mt: 8,
          }}
        >
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Box>

        <Box
          sx={{
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
            height: `${CARD_HEIGHT}px`, // Fixed height for the container
          }}
        >
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
                display: 'flex',
              },
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
                display: 'flex',
              },
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
  }
);

const Marketplace = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchTerm, handleSearch } = useSearch();
  const { addToCart } = useCart();
  const [activeStep, setActiveStep] = useState(0);
  const [visibleNFTs, setVisibleNFTs] = useState<typeof allNFTs>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    type: 'success',
  });

  const itemsPerPage = 8;
  const totalPages = Math.ceil(allNFTs.length / itemsPerPage);

  // Extract categories
  useEffect(() => {
    const allCategories = Array.from(new Set(allNFTs.map(nft => nft.creator.split(' ')[0])));
    setCategories(['All', ...allCategories]);
  }, []);

  // Apply filters and update visible NFTs
  useEffect(() => {
    let filtered = [...allNFTs];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        nft =>
          nft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          nft.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
          nft.price.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(nft => nft.creator.split(' ')[0] === selectedCategory);
    }

    // Apply pagination
    const startIndex = activeStep * itemsPerPage;
    setVisibleNFTs(filtered.slice(startIndex, startIndex + itemsPerPage));
  }, [searchTerm, selectedCategory, activeStep]);

  const handleNextPage = () => {
    if (activeStep < totalPages - 1) {
      setActiveStep(prevStep => prevStep + 1);
    }
  };

  const handlePrevPage = () => {
    if (activeStep > 0) {
      setActiveStep(prevStep => prevStep - 1);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setActiveStep(0); // Reset pagination when changing category
  };

  const handleAddToCart = (nft: any) => {
    addToCart({
      id: nft.id,
      title: nft.title,
      creator: nft.creator,
      price: typeof nft.price === 'string' ? nft.price.split(' ')[0] : nft.price,
      image: nft.image,
    });
    setNotification({
      open: true,
      message: `Added ${nft.title} to cart!`,
      type: 'success',
    });
  };

  const handleCloseNotification = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({
      ...notification,
      open: false,
    });
  };

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 }, mb: 6 }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          mb: 6,
          background:
            'linear-gradient(135deg, rgba(108, 99, 255, 0.1) 0%, rgba(45, 212, 191, 0.05) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
          py: { xs: 4, md: 5 },
          px: { xs: 3, md: 5 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 800,
            mb: 2,
            background: 'linear-gradient(135deg, #6C63FF, #2DD4BF)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textFillColor: 'transparent',
            letterSpacing: '-0.02em',
          }}
        >
          Discover Unique Events
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            maxWidth: '800px',
            mb: 4,
            fontWeight: 400,
          }}
        >
          Browse our collection of verified event tickets secured by blockchain technology
        </Typography>

        {/* Category Pills */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1.5,
            justifyContent: 'center',
            maxWidth: '900px',
          }}
        >
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'contained' : 'outlined'}
              onClick={() => handleCategoryChange(category)}
              sx={{
                borderRadius: '12px',
                borderWidth: selectedCategory === category ? 0 : 1.5,
                px: 2.5,
                py: 1,
                fontWeight: 600,
                transition: 'all 0.3s ease',
                ...(selectedCategory === category
                  ? {
                      background: 'linear-gradient(135deg, #6C63FF, #4B44CC)',
                      boxShadow: '0 6px 15px rgba(108, 99, 255, 0.2)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 20px rgba(108, 99, 255, 0.3)',
                      },
                    }
                  : {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'text.primary',
                      '&:hover': {
                        borderColor: 'primary.main',
                        background: 'rgba(108, 99, 255, 0.08)',
                        transform: 'translateY(-2px)',
                      },
                    }),
              }}
            >
              {category}
            </Button>
          ))}
        </Box>

        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(108,99,255,0.1) 0%, rgba(108,99,255,0) 70%)',
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
            background: 'radial-gradient(circle, rgba(45,212,191,0.08) 0%, rgba(45,212,191,0) 70%)',
            zIndex: 0,
          }}
        />
      </Box>

      {/* Results Count and Pagination Controls */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            '&::before': {
              content: '""',
              display: 'inline-block',
              width: 6,
              height: 28,
              backgroundColor: 'secondary.main',
              borderRadius: 1,
              mr: 2,
            },
          }}
        >
          {searchTerm
            ? `Search Results for "${searchTerm}"`
            : selectedCategory !== 'All'
              ? `${selectedCategory} Events`
              : 'All Events'}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={handlePrevPage}
            disabled={activeStep === 0}
            sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <KeyboardArrowLeft />
          </IconButton>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 2,
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <Typography variant="body2">
              Page {activeStep + 1} of {Math.max(1, totalPages)}
            </Typography>
          </Box>
          <IconButton
            onClick={handleNextPage}
            disabled={activeStep >= totalPages - 1}
            sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <KeyboardArrowRight />
          </IconButton>
        </Box>
      </Box>

      {/* NFT Grid */}
      {visibleNFTs.length > 0 ? (
        <Grid container spacing={3}>
          {visibleNFTs.map(nft => (
            <Grid item xs={12} sm={6} md={3} key={nft.id}>
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
                }}
              >
                <CardActionArea>
                  <Box sx={{ position: 'relative', pt: '100%', overflow: 'hidden' }}>
                    <CardMedia
                      component={nft.image.endsWith('.mp4') ? 'video' : 'img'}
                      {...(nft.image.endsWith('.mp4')
                        ? { autoPlay: true, muted: true, loop: true }
                        : {})}
                      image={nft.image}
                      alt={nft.title}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    {nft.status !== 'Now' && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          background: 'rgba(0, 0, 0, 0.6)',
                          backdropFilter: 'blur(4px)',
                          borderRadius: '8px',
                          px: 1,
                          py: 0.5,
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.75rem',
                        }}
                      >
                        {nft.status}
                      </Box>
                    )}
                  </Box>
                </CardActionArea>

                <Box sx={{ p: 2 }}>
                  <Typography
                    variant="subtitle1"
                    component="h3"
                    sx={{
                      fontWeight: 600,
                      mb: 0.5,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {nft.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: 'text.secondary',
                      mb: 1,
                    }}
                  >
                    {nft.creator}
                    {nft.isVerified && (
                      <VerifiedIcon
                        sx={{
                          ml: 0.5,
                          fontSize: '0.875rem',
                          color: 'primary.main',
                        }}
                      />
                    )}
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 'bold',
                        color: 'primary.main',
                      }}
                    >
                      {nft.price}
                    </Typography>

                    <Button
                      size="small"
                      variant="contained"
                      onClick={e => {
                        e.stopPropagation();
                        handleAddToCart(nft);
                      }}
                      sx={{
                        minWidth: 'unset',
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        p: 0,
                      }}
                    >
                      <ShoppingCartIcon fontSize="small" />
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: 4,
            border: '1px dashed rgba(255, 255, 255, 0.1)',
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No events found matching your search criteria
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              setSelectedCategory('All');
              handleSearch('');
            }}
            sx={{ mt: 2 }}
          >
            Reset Filters
          </Button>
        </Box>
      )}

      {/* Pagination - Bottom */}
      {visibleNFTs.length > 0 && totalPages > 1 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 6,
            gap: 1,
          }}
        >
          <Button
            variant="outlined"
            onClick={handlePrevPage}
            disabled={activeStep === 0}
            sx={{
              borderRadius: '10px',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: 'text.primary',
              '&:hover': {
                borderColor: 'primary.main',
                background: 'rgba(108, 99, 255, 0.08)',
              },
            }}
          >
            Previous
          </Button>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 3,
              mx: 1,
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <Typography variant="body2">
              {activeStep + 1} / {totalPages}
            </Typography>
          </Box>

          <Button
            variant="outlined"
            onClick={handleNextPage}
            disabled={activeStep >= totalPages - 1}
            sx={{
              borderRadius: '10px',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: 'text.primary',
              '&:hover': {
                borderColor: 'primary.main',
                background: 'rgba(108, 99, 255, 0.08)',
              },
            }}
          >
            Next
          </Button>
        </Box>
      )}

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.type}
          variant="filled"
          sx={{
            borderRadius: '12px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Marketplace;
