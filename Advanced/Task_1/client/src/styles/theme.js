import { createTheme } from '@mui/material/styles';

// Ghana flag colors
const ghanaColors = {
  red: '#dc143c',
  gold: '#ffd700',
  green: '#006b3c',
  black: '#000000',
  white: '#ffffff'
};

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: ghanaColors.red,
      light: '#ff5722',
      dark: '#b71c1c',
      contrastText: ghanaColors.white,
    },
    secondary: {
      main: ghanaColors.gold,
      light: '#ffff52',
      dark: '#c7b800',
      contrastText: ghanaColors.black,
    },
    success: {
      main: ghanaColors.green,
      light: '#4caf50',
      dark: '#2e7d32',
    },
    background: {
      default: '#fafafa',
      paper: ghanaColors.white,
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.6,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontSize: '0.875rem',
          fontWeight: 500,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          background: `linear-gradient(45deg, ${ghanaColors.red} 30%, #ff5722 90%)`,
          '&:hover': {
            background: `linear-gradient(45deg, ${ghanaColors.red} 60%, #ff5722 100%)`,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: `linear-gradient(90deg, ${ghanaColors.red} 0%, ${ghanaColors.gold} 50%, ${ghanaColors.green} 100%)`,
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: ghanaColors.red,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: ghanaColors.red,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
        colorPrimary: {
          backgroundColor: ghanaColors.red,
          color: ghanaColors.white,
        },
        colorSecondary: {
          backgroundColor: ghanaColors.gold,
          color: ghanaColors.black,
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  ...theme,
  palette: {
    ...theme.palette,
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
});
