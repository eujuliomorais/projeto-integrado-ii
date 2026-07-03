import { Box, Container, Grid, Typography } from '@mui/material';
import Footer from '../components/Landing/Footer';
import Header from '../components/Landing/Header';
import HeroImage from '../assets/dom-mauricio.jpg';
import SobreImage from '../assets/sobre-dom.jpeg';


const LandingPage = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Header transparent />

    {/* ── Hero Section (Header visual) ── */}
    <Box
      sx={{
        position: 'relative',
        height: { xs: '60vh', md: '80vh' },
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(${HeroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        textAlign: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 800,
            mb: 2,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            fontSize: { xs: '2.5rem', md: '4rem' },
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          GRUPO CULTURAL DE<br />DOM MAURÍCIO
        </Typography>
        <Typography
          variant="h5"
          component="p"
          sx={{
            fontWeight: 400,
            opacity: 0.9,
            fontSize: { xs: '1.2rem', md: '1.8rem' },
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          Tradição, Arte e Inclusão Social
        </Typography>
      </Container>
    </Box>

    {/* ── Sobre Nós ── */}
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, textAlign: 'center', mb: { xs: 4, md: 6 } }}
      >
        Sobre
      </Typography>

      <Grid container spacing={4} sx={{ alignItems: 'flex-start' }}>
        {/* Imagem placeholder */}
        <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            component="img"
            src={SobreImage}
            alt="Grupo Cultural de Dom Maurício"
            sx={{
              borderRadius: 2,
              width: '100%',
              aspectRatio: '1 / 1',
              objectFit: 'cover',
            }}
          />
        </Grid>

        {/* Texto */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography color="text.secondary" sx={{ lineHeight: 1.8, textAlign: 'justify' }}>
            O Grupo Cultural de Dom Maurício tem uma trajetória rica e diversificada no cenário artístico e cultural da região. Fundado há mais de duas décadas, o grupo surgiu da iniciativa de um conjunto de artistas e entusiastas culturais que compartilhavam o desejo de promover e preservar as expressões artísticas locais. Desde sua fundação, o Grupo Cultural de Dom Maurício tem se dedicado incansavelmente à produção e promoção de eventos culturais de alta qualidade. Suas atividades abrangem uma ampla gama de formas de arte, incluindo teatro, música, dança, literatura, artes plásticas e muito mais. Ao longo dos anos, o grupo realizou inúmeras apresentações, espetáculos e exposições em diversos espaços culturais da cidade e além, ganhando reconhecimento e admiração tanto do público quanto da crítica especializada. Além de suas atividades de entretenimento e promoção cultural, o Grupo Cultural de Dom Maurício também se dedica a projetos sociais, utilizando a arte como uma ferramenta poderosa para promover a inclusão social, a educação e o desenvolvimento comunitário. Com uma equipe talentosa e dedicada, o Grupo Cultural de Dom Maurício continua a desempenhar um papel fundamental na vida cultural da comunidade, enriquecendo o cenário artístico local e inspirando gerações de artistas e espectadores.
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

      {/* Mapa */}
      <Box
        sx={{
          borderRadius: 3,
          overflow: 'hidden', // Ensures the iframe respects the border radius
          width: '100%',
          height: { xs: 260, md: 380 },
          boxShadow: 3,
        }}
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1987.5694227766437!2d-39.149350734292696!3d-4.916426769395301!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7be9cac2d8cf66b%3A0xf9853f42f7b5946e!2sDom%20Mauricio!5e0!3m2!1sen!2sbr!4v1781225207219!5m2!1sen!2sbr"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </Box>

      {/* Endereço */}
      <Typography
        variant="body1"
        sx={{
          mt: 3,
          textAlign: 'center',
          color: 'text.secondary',
        }}
      >
        <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Endereço:
        </Box>{' '}
        Rua Antônio Martins de Almeida, 2685 - Dom Maurício, Quixadá - CE
      </Typography>
    </Container>

    <Footer />
  </Box>
);

export default LandingPage;
