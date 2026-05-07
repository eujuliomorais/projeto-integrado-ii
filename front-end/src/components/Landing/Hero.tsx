import { Box } from '@mui/material';

const Hero = () => (
  <Box
    sx={{
      bgcolor: 'primary.main',
      py: { xs: 8, md: 12 },
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Box
      component="img"
      src="/white-system-logo.svg"
      alt="Grupo Cultural de Dom Maurício"
      sx={{ height: { xs: 120, md: 180 }, width: 'auto' }}
    />
  </Box>
);

export default Hero;
