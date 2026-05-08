import { Box, Container, Grid, Typography } from '@mui/material';
import Footer from '../components/Landing/Footer';
import Header from '../components/Landing/Header';
import Hero from '../components/Landing/Hero';

const LOREM =
  'Lorem ipsum dolor sit amet consectetur. Vel gravida pellentesque interdum eget porttitor. Sem est feugiat leo mauris sapien. Commodo elit vitae facilisis elementum fames arcu nisi dignissim. Pharetra ac urna porta venenatis tristique quis. Quam massa et ut laoreet maecenas quis felis risus et. Iaculis placerat lectus dignissim dolor tincidunt volutpat pellentesque felis aliquet. Nec malesuada morbi facilisi ultrices ultrices sit vitae. Sodales quam nisi at tellus felis vestibulum nulla lectus mauris. Vehicula in a vitae sodales imperdiet et at sit. Amet diam quis diam risus. Ornare lectus lectus quis mattis convallis commodo netus at lectus.';

const LandingPage = () => (
  <>
    <Header />
    <Hero />

    {/* ── Sobre Nós ── */}
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, textAlign: 'center', mb: { xs: 4, md: 6 } }}
      >
        Sobre Nós
      </Typography>

      <Grid container spacing={4} sx={{ alignItems: 'flex-start' }}>
        {/* Imagem placeholder */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box
            sx={{
              bgcolor: 'primary.main',
              borderRadius: 2,
              width: '100%',
              aspectRatio: '4 / 3',
            }}
          />
        </Grid>

        {/* Texto */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>
            Título 2
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
            {LOREM}
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
            {LOREM}
          </Typography>
        </Grid>
      </Grid>
    </Container>

    {/* ── Localização ── */}
    <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 10 } }}>
      <Typography
        variant="h4"
        sx={{ mb: { xs: 4, md: 6 }, fontWeight: 700, textAlign: 'center' }}
      >
        Localização
      </Typography>

      {/* Mapa placeholder */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          borderRadius: 3,
          width: '100%',
          height: { xs: 260, md: 380 },
        }}
      />
    </Container>

    <Footer />
  </>
);

export default LandingPage;
