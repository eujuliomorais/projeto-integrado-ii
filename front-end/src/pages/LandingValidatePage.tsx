import { Box } from '@mui/material';
import Footer from '../components/Landing/Footer';
import Header from '../components/Landing/Header';
import ValidateCardSection from '../components/Landing/ValidateCardSection';

const LandingValidatePage = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Header />

    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: { xs: 6, md: 10 },
      }}
    >
      <ValidateCardSection />
    </Box>

    <Footer />
  </Box>
);

export default LandingValidatePage;
