import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      orange: {
        main: string;
        light30: string;
        light50: string;
        light70: string;
      };
      gray: {
        main: string;
        light30: string;
        light50: string;
        light70: string;
      };
      darkGray: { main: string };
      yellow: { main: string };
      green: { main: string };
    };
  }
  interface PaletteOptions {
    custom?: {
      orange?: {
        main?: string;
        light30?: string;
        light50?: string;
        light70?: string;
      };
      gray?: {
        main?: string;
        light30?: string;
        light50?: string;
        light70?: string;
      };
      darkGray?: { main?: string };
      yellow?: { main?: string };
      green?: { main?: string };
    };
  }
}

const theme = createTheme({
  palette: {
    primary: { main: '#E36D3B', contrastText: '#FFFFFF' },
    secondary: { main: '#AF8D00', contrastText: '#FFFFFF' },
    background: { default: '#FFF8F0', paper: '#FFFFFF' },
    error: { main: '#D32F2F' },
    success: { main: '#53825A' },
    warning: { main: '#AF8D00' },
    info: { main: '#5F5E5E' },
    text: {
      primary: '#2E2E2E',
      secondary: '#5F5E5E',
      disabled: 'rgba(95, 94, 94, 0.7)',
    },
    custom: {
      orange: {
        main: '#E36D3B',
        light30: 'rgba(227, 109, 59, 0.3)',
        light50: 'rgba(227, 109, 59, 0.5)',
        light70: 'rgba(227, 109, 59, 0.7)',
      },
      gray: {
        main: '#5F5E5E',
        light30: 'rgba(95, 94, 94, 0.3)',
        light50: 'rgba(95, 94, 94, 0.5)',
        light70: 'rgba(95, 94, 94, 0.7)',
      },
      darkGray: { main: '#2E2E2E' },
      yellow: { main: '#AF8D00' },
      green: { main: '#53825A' },
    },
  },
  typography: {
    fontFamily: '"Open Sans", Arial, sans-serif',
  },
});

export default theme;
