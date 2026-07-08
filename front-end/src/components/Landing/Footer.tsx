import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import {
  Box,
  Container,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import Logo from '../../assets/logo-deles.svg';

const Footer = () => (
  <Box component="footer" sx={{ bgcolor: '#5F5E5E', pt: 4, pb: 2 }}>
    <Container maxWidth="lg">
      {/* Top row: logo esquerda, contato direita */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          pb: 3,
        }}
        spacing={3}
      >
        <Box
          component="img"
          src={Logo}
          alt="Grupo Cultural de Dom Maurício"
          sx={{ height: 64, width: 'auto' }}
        />

        {/* Contato + redes */}
        <Stack
          spacing={0.5}
          sx={{ alignItems: { xs: 'flex-start', sm: 'flex-end' } }}
        >
          <Typography variant="body2" sx={{ color: '#fff' }}>
            grupoculturaldedommauricio@gmail.com
          </Typography>
          <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
            <IconButton
              aria-label="Facebook"
              href="https://www.facebook.com/mauricio.gc.142#"
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{ color: '#fff', p: 0.5 }}
            >
              <FacebookIcon sx={{ fontSize: 22 }} />
            </IconButton>
            <IconButton
              aria-label="Instagram"
              href="https://www.instagram.com/grupodommauricio/"
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{ color: '#fff', p: 0.5 }}
            >
              <InstagramIcon sx={{ fontSize: 22 }} />
            </IconButton>
            <IconButton
              aria-label="YouTube"
              href="https://www.youtube.com/channel/UCq3G-DV0MW3spxrQus_lNMw"
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{ color: '#fff', p: 0.5 }}
            >
              <YouTubeIcon sx={{ fontSize: 22 }} />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />

      {/* Copyright */}
      <Typography
        variant="caption"
        sx={{
          color: 'rgba(255,255,255,0.7)',
          display: 'block',
          textAlign: 'center',
          pt: 2,
        }}
      >
        © {Date().substring(11, 16)} Grupo Cultural de Dom Maurício. Todos os
        direitos reservados
      </Typography>
    </Container>
  </Box>
);

export default Footer;
