import { createTheme, alpha } from '@mui/material/styles';

// Define custom color palette
const colors = {
  primary: {
    main: '#6C63FF', // Vibrant indigo
    light: '#9D97FF',
    dark: '#4B44CC',
  },
  secondary: {
    main: '#FF6584', // Vibrant pink
    light: '#FF8FA3',
    dark: '#D14264',
  },
  tertiary: {
    main: '#2DD4BF', // Teal
    light: '#5EEADF',
    dark: '#14B8A6',
  },
  background: {
    default: '#0A0A1B', // Deep blue-black
    paper: '#14142B', // Deep purple-black
    card: '#1C1C38', // Slightly lighter purple-black
    gradient: 'linear-gradient(135deg, rgba(108, 99, 255, 0.2) 0%, rgba(45, 212, 191, 0.1) 100%)',
  },
  text: {
    primary: '#ffffff',
    secondary: '#B7B7D8',
    disabled: '#62627A',
  },
  success: {
    main: '#00B07A',
    light: '#4CD2A9',
    dark: '#00774D',
  },
  error: {
    main: '#FF4D62',
    light: '#FF7D8C',
    dark: '#CC324F',
  },
  warning: {
    main: '#FFAE33',
    light: '#FFC66A',
    dark: '#DB8A14',
  },
  info: {
    main: '#3DB9FF',
    light: '#7DD0FF',
    dark: '#0A8ED9',
  },
};

// Create custom theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    text: colors.text,
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      letterSpacing: '0.02em',
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      letterSpacing: '0.02em',
    },
    overline: {
      fontSize: '0.625rem',
      fontWeight: 500,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: colors.background.gradient,
          backgroundAttachment: 'fixed',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 20px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 16px ${alpha(colors.primary.main, 0.2)}`,
          },
        },
        contained: {
          boxShadow: `0 4px 8px ${alpha(colors.primary.main, 0.2)}`,
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${colors.primary.main}, ${colors.primary.dark})`,
        },
        containedSecondary: {
          background: `linear-gradient(135deg, ${colors.secondary.main}, ${colors.secondary.dark})`,
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: colors.background.card,
          backdropFilter: 'blur(8px)',
          boxShadow: `0 8px 24px ${alpha('#000', 0.2)}`,
          overflow: 'hidden',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: `0 16px 40px ${alpha('#000', 0.3)}`,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: `0 4px 20px ${alpha('#000', 0.2)}`,
          backdropFilter: 'blur(8px)',
          background: alpha(colors.background.paper, 0.8),
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiAlert-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          [createTheme().breakpoints.up('sm')]: {
            paddingLeft: '2rem',
            paddingRight: '2rem',
          },
          [createTheme().breakpoints.up('md')]: {
            paddingLeft: '3rem',
            paddingRight: '3rem',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          transition: 'color 0.2s ease',
          '&:hover': {
            textDecoration: 'none',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.MuiTypography-h1, &.MuiTypography-h2, &.MuiTypography-h3, &.MuiTypography-h4, &.MuiTypography-h5, &.MuiTypography-h6':
            {
              marginBottom: '0.5em',
              '&:last-child': {
                marginBottom: 0,
              },
            },
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: '0.5rem 0',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '0.25rem 0',
          padding: '0.5rem 1rem',
          transition: 'background-color 0.2s ease',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: 'hidden',
          '&:before': {
            display: 'none',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
  spacing: (factor: number) => `${0.5 * factor}rem`,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  shadows: [
    'none',
    `0 2px 4px ${alpha('#000', 0.05)}`,
    `0 4px 8px ${alpha('#000', 0.08)}`,
    `0 6px 12px ${alpha('#000', 0.1)}`,
    `0 8px 16px ${alpha('#000', 0.12)}`,
    `0 12px 24px ${alpha('#000', 0.15)}`,
    `0 16px 32px ${alpha('#000', 0.18)}`,
    `0 20px 40px ${alpha('#000', 0.2)}`,
    `0 24px 48px ${alpha('#000', 0.22)}`,
    `0 32px 64px ${alpha('#000', 0.25)}`,
    `0 40px 80px ${alpha('#000', 0.3)}`,
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
  ],
});

export default theme;
