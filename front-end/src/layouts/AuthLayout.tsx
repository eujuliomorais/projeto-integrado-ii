import { Box, Paper } from '@mui/material';
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'primary.main',
      p: { xs: 2, sm: 3 },
    }}
  >
    <Paper
      elevation={8}
      sx={{
        p: { xs: 3, sm: 5 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        borderRadius: 3,
        width: '100%',
        maxWidth: 430,
      }}
    >

      {children}
    </Paper>
  </Box>
);

export default AuthLayout;
