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
    title: "Abstract Thought of Art",
    creator: "ZafGod.eth",
    platform: "Abstract",
    price: "0.00069 ETH",
    description: "I explore the intersection of digital decay, cybernetic spirituality, and the neon ghosts of an unraveling reality. This piece is a synthetic dreamscape—part ritual, part hallucination—where fragmented figures, glitching flora, and...",
    image: "https://via.placeholder.com/800x600/1a237e/ffffff",
    status: "MINTING NOW",
    mintedCount: "11",
    maxPerWallet: "10",
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
    image: "https://via.placeholder.com/800x600/6a1b9a/ffffff",
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
    image: "https://via.placeholder.com/800x600/2e7d32/ffffff",
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
      {/* Featured NFT Section */}
      <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden', mb: 8 }}>
        <IconButton
          onClick={handleFeaturedBack}
          disabled={activeFeaturedStep === 0 || isFeaturedAnimating}
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
          onClick={handleFeaturedNext}
          disabled={activeFeaturedStep >= maxFeaturedSteps - 1 || isFeaturedAnimating}
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
            transform: `translateX(-${activeFeaturedStep * 100}%)`,
          }}
        >
          {featuredNFTs.map((nft, index) => (
            <Box
              key={index}
              sx={{
                flex: '0 0 100%',
                transition: 'all 0.5s ease-in-out',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: 4,
                  overflow: 'hidden',
                  background: nft.gradient,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Grid container spacing={0}>
                  <Grid item xs={12} md={6} sx={{ p: 4 }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        bgcolor: 'rgba(0, 0, 0, 0.2)',
                        color: nft.gradient.includes('#00ff9d') ? '#00ff9d' : 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        mb: 2,
                        display: 'inline-block'
                      }}
                    >
                      {nft.status}
                    </Typography>
                    
                    <Typography variant="h3" component="h1" sx={{ mt: 2, mb: 1, fontWeight: 'bold', color: '#000' }}>
                      {nft.title}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                      <Typography sx={{ color: '#000' }}>by</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography sx={{ fontWeight: 'bold', color: '#000' }}>{nft.creator}</Typography>
                        {nft.isVerified && <VerifiedIcon sx={{ fontSize: 16, color: '#2196f3' }} />}
                      </Box>
                      <Typography sx={{ color: '#000' }}>on</Typography>
                      <Typography sx={{ fontWeight: 'bold', color: '#000' }}>{nft.platform}</Typography>
                    </Box>

                    <Typography sx={{ mb: 4, color: '#000', opacity: 0.8 }}>
                      {nft.description}
                      <Button sx={{ color: '#000', textTransform: 'none', p: 0, ml: 1 }}>
                        Show more
                      </Button>
                    </Typography>

                    <Box sx={{ 
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 2,
                      p: 2,
                      mb: 3
                    }}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <IconButton 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMintQuantity(Math.max(1, mintQuantity - 1));
                          }}
                          sx={{ bgcolor: 'rgba(0, 0, 0, 0.1)', color: '#000' }}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography sx={{ color: '#000', fontWeight: 'bold', minWidth: '24px', textAlign: 'center' }}>{mintQuantity}</Typography>
                        <IconButton 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMintQuantity(Math.min(parseInt(nft.maxPerWallet), mintQuantity + 1));
                          }}
                          sx={{ bgcolor: 'rgba(0, 0, 0, 0.1)', color: '#000' }}
                        >
                          <AddIcon />
                        </IconButton>
                        
                        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ color: '#000', fontWeight: 'bold', mr: 2 }}>
                            {mintQuantity > 1 ? (
                              <>
                                {parseFloat(nft.price.split(' ')[0]).toFixed(5)} ETH × {mintQuantity} = {(parseFloat(nft.price.split(' ')[0]) * mintQuantity).toFixed(5)} ETH
                              </>
                            ) : (
                              <>{nft.price}</>
                            )}
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
                              // Add to cart with the selected quantity
                              for (let i = 0; i < mintQuantity; i++) {
                                addToCart({
                                  id: index + 100 + i, // Using a different ID range for featured NFTs
                                  title: nft.title,
                                  creator: nft.creator,
                                  price: nft.price.split(' ')[0], // Extract just the price number
                                  image: nft.image
                                });
                              }
                              setShowAddedToCart(true);
                            }}
                          >
                            {mintQuantity > 1 ? `Add ${mintQuantity} to Cart` : 'Add to Cart'}
                          </Button>
                        </Box>
                      </Stack>
                    </Box>

                    <Stack direction="row" spacing={3} sx={{ color: '#000' }}>
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

                  <Grid item xs={12} md={6} sx={{ p: 4 }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        minHeight: 400,
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
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

export default Home; 