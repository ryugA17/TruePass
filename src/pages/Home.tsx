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

// Featured NFTs data
const featuredNFTs = [
  {
    "title": "Dreamscape",
  "creator": "PixelWizard.eth",
  "platform": "Surreal",
  "price": "0.00420 ETH",
  "description": "A journey into the subconscious through shapes and shades. Vibrant hues meet deep symbolism.",
  "image": "https://v5.airtableusercontent.com/v3/u/39/39/1744056000000/4mhj3z8rY8mx9ttmxbyMHg/eGpRjDZLGoWydWPUpIeOLYiXGyH4BTaH0KUSnKcMTzYxE7x9Zne6O-iQ-xEk711ZsII2SMCjMZcj0K9r0Wx9QCsCejm2zG3o19PPVBBzoMQURSMxMrYj5PMQAV-kytVEGYhO6QRorcw-wyYRpQM77Q/IODStxzZG3iGZj3FbbA50x4Rp0b89dDPTcff3stAgmM",
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
    image: "https://v5.airtableusercontent.com/v3/u/39/39/1744048800000/yTEpfr3FqYHdph-wfRra5g/3H01LAqofh1JJxkxUdSXymQppqakR6dMrodCN_3_e2PaGfVMA7XLMn9gyPkrRHoR_k4IgcLultAcIKpeJ-9AEv7ZYTl7wYRdaciOT1MEZYwN4v4jymhIKEXUjAC-07EomKkYzgpBl6cRz3YDQZodOg/0R0iAjF8k80toA4As3gzAs5EI5nn3gqwCkYPU54Rv7I",
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
    image: "https://v5.airtableusercontent.com/v3/u/39/39/1744048800000/FPPtNfSsuyDASK99CRDASA/9t8ediv6t1vG1kDg__l72dgxDH73zQPJPqxszvIVvJUy-AVA7TMW1lWnKpw0paW1XU-euSFBHRKw7VRKOkf6Pp94K3z6JejX5rsWo8MjcaVC-UOiATv-Ysgh97-fzBSPhBBeIskpgShdn7s6HOSIcQ/R8P96j-wabHzfHebTely4dBZ-Wvp2_R3W25bCKFvUBI",
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
    image: 'https://assets.raribleuserdata.com/prod/v1/image/t_avatar_big/aHR0cHM6Ly9pcGZzLnJhcmlibGV1c2VyZGF0YS5jb20vaXBmcy9iYWZ5YmVpYmtyY3Q2NnZnNWFyc2tpYnR6amxnczUzY28yazNidXBheHdlb2h1YWhnNmwyN3ZyM2g0YQ==',
    status: 'Now',
    isVerified: true
  },
  {
    id: 2,
    title: 'Harvested Opulence',
    creator: 'Fame Identity',
    price: '0.005 ETH',
    image: 'https://assets.raribleuserdata.com/prod/v1/image/t_gif_preview/aHR0cHM6Ly9pcGZzLnJhcmlibGV1c2VyZGF0YS5jb20vaXBmcy9RbVJGVlBxRnVnV0JMWU0xbldXQnhMaW1Gd3dzRHFSTkJVcGQ2Um1XeVNweENYL0dvYXQtZHJvcC0xXzEtZXpnaWYuY29tLW9wdGltaXplLmdpZg==',
    status: '23 hours',
    isVerified: true
  },
  {
    id: 3,
    title: 'RELAX',
    creator: 'brain pasta',
    price: '0.0038 ETH',
    image: 'https://assets.raribleuserdata.com/prod/v1/image/t_avatar_big/aHR0cHM6Ly9pcGZzLnJhcmlibGV1c2VyZGF0YS5jb20vaXBmcy9RbWQ3YWNGUVJGSjlSSjduNmZ4dm1WblhhWjlnVDdmYmdoYUVmeHVnSk1NS2NKL0xPTFJBUklCTEUyMDI1SElHSFJFUzMwMDAyLmdpZg==',
    status: 'Now',
    isVerified: true
  },
  {
    id: 4,
    title: 'Spring will come',
    creator: 'Reza Milani',
    price: '0.0004 ETH',
    image: 'https://assets.raribleuserdata.com/prod/v1/image/t_avatar_big/aHR0cHM6Ly9pcGZzLnJhcmlibGV1c2VyZGF0YS5jb20vaXBmcy9RbWQyTUYyQkZ4NFl4dTl4dnc3amJRRDRqVm8yNXZCbkdObjZzWWQ2bkFLaWVjL21hdGNoYWluMTItZXpnaWYuY29tLW9wdGltaXplLmdpZg==',
    status: 'Now',
    isVerified: true
  },
  {
    id: 5,
    title: 'Cyber Dreams',
    creator: 'neon.eth',
    price: '0.0089 ETH',
    image: 'https://assets.raribleuserdata.com/prod/v1/image/t_avatar_big/aHR0cHM6Ly9pcGZzLnJhcmlibGV1c2VyZGF0YS5jb20vaXBmcy9iYWZ5YmVpZnEya3I2aGVocmRjNXFxbXgzNXZ4a29rczNvaWkydHZwcmRhZnl4YWx4bHNxYWtobXp5bQ==',
    status: 'Now',
    isVerified: true
  },
  {
    id: 6,
    title: 'Digital Wilderness',
    creator: 'artmaster',
    price: '0.0123 ETH',
    image: 'https://assets.raribleuserdata.com/prod/v1/image/t_avatar_big/aHR0cHM6Ly9pcGZzLnJhcmlibGV1c2VyZGF0YS5jb20vaXBmcy9RbVdrY0pnN1FWZTNjWE5TMXROd2s4TmFWaXRCQlRzUGNqdHpLdVYxMnd4Y2V0L3Rob3VnaHRfb2ZfYXJ0LmdpZg==',
    status: '2 hours',
    isVerified: true
  },
  {
    id: 7,
    title: 'Neon Nights',
    creator: 'pixelart.eth',
    price: '0.0075 ETH',
    image: 'https://lh3.googleusercontent.com/RY7_lkqWuNaAXCwks_Xot4D6fueS4s4ubNYt2PzEqEAs1tJFhJLzSVF2PAYtIvNNA4rjoRQhDmGtFeWVZBjcbv70ASTimVVvJ4k=s1000',
    status: 'Now',
    isVerified: true
  },
  {
    id: 8,
    title: 'Future Past',
    creator: 'retro.eth',
    price: '0.0055 ETH',
    image: 'https://v5.airtableusercontent.com/v3/u/39/39/1744056000000/zkGCYPxUQpuuUoRmF0YnuA/hrykuHNhYmaRONeyyUwEVnjqKO_WbKOzj2qDAriyW0xn-jaos3AD5rV1K_Y6WokGLmXikTL9M_Qd_54Wt1J0Mcz0HF84GPB6FQ0D0FSY7YboM_FK0kg4o8iSntIrvavypHn0vaPjolffYpss0YWPeQ/7qClnynZtSmYX_Sw1ipzQHyshLnLUR7BE0jOBMFRE5k',
    status: '5 hours',
    isVerified: true
  },
  {
    id: 9,
    title: 'Quantum Dreams',
    creator: 'quantum.art',
    price: '0.0095 ETH',
    image: 'https://v5.airtableusercontent.com/v3/u/39/39/1744048800000/FPPtNfSsuyDASK99CRDASA/9t8ediv6t1vG1kDg__l72dgxDH73zQPJPqxszvIVvJUy-AVA7TMW1lWnKpw0paW1XU-euSFBHRKw7VRKOkf6Pp94K3z6JejX5rsWo8MjcaVC-UOiATv-Ysgh97-fzBSPhBBeIskpgShdn7s6HOSIcQ/R8P96j-wabHzfHebTely4dBZ-Wvp2_R3W25bCKFvUBI',
    status: 'Now',
    isVerified: true
  },
  {
    id: 10,
    title: 'Virtual Reality',
    creator: 'vr.master',
    price: '0.0082 ETH',
    image: 'https://assets.raribleuserdata.com/prod/v1/image/t_avatar_big/aHR0cHM6Ly9pcGZzLnJhcmlibGV1c2VyZGF0YS5jb20vaXBmcy9RbVppU3F1Z05UNmsxTUJ3N0pySkpBOHM3b3kxZHhNa3U3eW50U0xGb1VCRktYL0FyYml0cnVtLWxpdmUtb24tUmFyaWJsZS1lemdpZi5jb20tb3B0aW1pemUuZ2lm',
    status: '12 hours',
    isVerified: true
  },
  {
    id: 11,
    title: 'Digital Genesis',
    creator: 'crypto.art',
    price: '0.0067 ETH',
    image: 'https://assets.raribleuserdata.com/prod/v1/image/t_gif_preview/aHR0cHM6Ly9pcGZzLnJhcmlibGV1c2VyZGF0YS5jb20vaXBmcy9RbVl0MlEzOHk3ZWh0c3RUOGNXRWl2enJZdEd6QnBKOWZZZEJoSk1yYUdKV2VKLzEuZ2lm',
    status: 'Now',
    isVerified: true
  },
  {
    id: 12,
    title: 'Pixel Paradise',
    creator: 'pixel.master',
    price: '0.0043 ETH',
    image: 'https://ipfs.raribleuserdata.com/ipfs/bafybeico7a2c5v4tgc4hcj76orsdamo5jeg5uzwrhbclq72yfg4ycw3ta4',
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

// Fixed card dimensions for consistency
const CARD_WIDTH = 400;
const CARD_HEIGHT = 400;
const IMAGE_HEIGHT = 340;
const INFO_HEIGHT = 60;

// Fixed dimensions for featured section
const FEATURED_HEIGHT = 400;
const FEATURED_WIDTH = 800; // Double the card width since it's a featured item

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
                        <CardMedia
                          component="img"
                          image={nft.image}
                          alt={nft.title}
                          sx={{ 
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
      {/* Featured NFT Section */}
      <Box sx={{ 
        position: 'relative', 
        width: '100%', 
        overflow: 'hidden', 
        mb: 8,
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
                      <img 
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