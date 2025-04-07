import React, { useEffect } from 'react';
import { Box, Typography, Button, Container, Grid, Stack } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// Import gsap with type definitions
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Load SVG
    fetch(process.env.PUBLIC_URL + '/city.svg')
      .then((response) => response.text())
      .then((svg) => {
        const bgCity = document.getElementById('bg_city');
        if (bgCity) {
          bgCity.innerHTML = svg;
          const svgElement = document.querySelector('#bg_city svg');
          if (svgElement) {
            svgElement.setAttribute("preserveAspectRatio", "xMidYMid slice");
            setAnimationScroll();
          }
        }
      });

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    return () => {
      // Clean up ScrollTrigger on component unmount
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const setAnimationScroll = () => {
    let runAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#bg_city",
        start: "top top",
        end: "+=1000",
        scrub: true,
        pin: true
      }
    });

    runAnimation.add([
      gsap.to("#bg_city svg", { duration: 2, scale: 1.5 }),
      gsap.to("#full_city", { duration: 2, opacity: 0 })
    ])
    .add([
      gsap.to("#building_top", { duration: 2, y: -200, opacity: 0 }),
      gsap.to("#wall_side", { duration: 2, x: -200, opacity: 0 }),
      gsap.to("#wall_front", { duration: 2, x: 200, y: 200, opacity: 0 })
    ])
    .add([
      gsap.to("#interior_wall_side", { duration: 2, x: -200, opacity: 0 }),
      gsap.to("#interior_wall_top", { duration: 2, y: -200, opacity: 0 }),
      gsap.to("#interior_wall_side_2", { duration: 2, opacity: 0 }),
      gsap.to("#interior_wall_front", { duration: 2, opacity: 0 })
    ]);
  };

  return (
    <Box className="landing-page">
      <Box component="header" className="header" sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '1rem 2rem',
        position: 'relative',
        zIndex: 10
      }}>
        <Box className="logo">
          <RouterLink to="/">
            <img src={process.env.PUBLIC_URL + '/img/logoweb.png'} alt="TruePass Logo" />
          </RouterLink>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined"
            onClick={() => navigate('/login')}
            sx={{ 
              color: '#FFF', 
              borderColor: '#FFF',
              '&:hover': {
                borderColor: 'chocolate',
                color: 'chocolate'
              }
            }}
          >
            Login
          </Button>
        </Stack>
      </Box>

      <Box className="banner">
        <Box id="bg_city" className="bg-city"></Box>
        <Box className="content">
          <Box className="item"></Box>
          <Box className="item title">
            <Typography variant="h2">TRANSPARENCY,</Typography>
            <Typography variant="h2">
              <Box component="span" sx={{ color: 'chocolate' }}>TRUEPASS</Box> DOES THAT
            </Typography>
          </Box>
        </Box>
      </Box>

      <Container component="main" className="main">
        <Box className="friend">
          <Box className="me">
            <Typography variant="h2">Revolutionizing Ticketing with Blockchain</Typography>
            <Box component="ul" sx={{ gap: '4em' }}>
              <li>Decentralized</li>
              <li>NFT Based Tickets</li>
              <li>Secure and Transparent</li>
              <li>Easy to Use</li>
            </Box>
          </Box>
        </Box>

        <Grid container className="grid grid-3">
          <Grid item className="autoBLur">Scalper-Proof</Grid>
          <Grid item className="autoBLur">Secure</Grid>
          <Grid item className="autoBLur">Fraud-Free</Grid>
          <Grid item className="autoBLur">Seamless</Grid>
          <Grid item className="autoBLur">
            <Button 
              component={RouterLink} 
              to="/signup" 
              sx={{ 
                textDecoration: 'none', 
                color: 'chocolate',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                '&:hover': {
                  backgroundColor: 'transparent',
                }
              }}
            >
              JOIN THE FUTURE&#8599;
            </Button>
          </Grid>
        </Grid>

        <Box component="footer">
          <Typography>A project by Team Roots</Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage; 