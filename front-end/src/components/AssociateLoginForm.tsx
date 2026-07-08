import { ArrowBackIos } from '@mui/icons-material';
import MailOutlineIcon from '@mui/icons-material/MailOutlined';
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
  Backdrop,
  Paper,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authSendToken } from '../services/auth/authService';
import Logo from '../assets/logo-laranja3.svg';

const AssociateLoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setEmailError('');

    const data = new FormData(e.currentTarget);
    const email = data.get('email') as string;

    setLoading(true);

    try {
      await authSendToken({ email });

      setAuthUser({ email, role: 'ASSOCIATE' });

      setSent(true);
    } catch {
      setEmailError('Credenciais inválidas. Verifique e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!sent) return;
    const timer = setTimeout(() => navigate('/token-associado'), 5000);
    return () => clearTimeout(timer);
  }, [sent, navigate]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ width: '100%' }}
    >
      <Stack spacing={4} sx={{ alignItems: 'center' }}>
        <Stack spacing={2} sx={{ alignItems: 'center', mb: 1 }}>
          <Box
            component="img"
            src={Logo}
            alt="Grupo Cultural de Dom Maurício"
            sx={{
              height: { xs: 80, sm: 100, md: 130 },
              width: 'auto',
              objectFit: 'contain',
            }}
          />
          <Typography
            sx={{
              color: 'primary.main',
              fontWeight: 800,
              fontSize: { xs: 14, sm: 16 },
              letterSpacing: 1,
              textTransform: 'uppercase',
              borderBottom: '2px solid',
              borderColor: 'primary.main',
              pb: 0.5,
            }}
          >
            Entrar como Associado
          </Typography>
        </Stack>

        <Button
          component={RouterLink}
          to="/"
          startIcon={<ArrowBackIos sx={{ fontSize: 14 }} />}
          sx={{
            alignSelf: 'flex-start',
            color: 'text.secondary',
            fontWeight: 600,
            textTransform: 'none',
            p: 0,
            '&:hover': { bgcolor: 'transparent', color: 'primary.main' },
          }}
        >
          Voltar para tela inicial
        </Button>

        <TextField
          label="E-mail"
          name="email"
          type="email"
          placeholder="Digite seu e-mail"
          error={!!emailError}
          helperText={
            emailError || 'Verifique se seu e-mail está digitado corretamente'
          }
          fullWidth
          required
          autoComplete="email"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{
            fontWeight: 'bold',
            py: 1.5,
            px: 4,
            borderRadius: 10,
            textTransform: 'none',
            minWidth: 120,
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          {loading ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            'Solicitar Token'
          )}
        </Button>
      </Stack>

      <Backdrop open={sent} sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}>
        <Paper
          elevation={8}
          sx={{
            p: { xs: 3, sm: 5 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            borderRadius: 3,
            width: { xs: '90%', sm: 430 },
            maxWidth: 430,
          }}
        >
          <MailOutlineIcon color="primary" sx={{ fontSize: 48 }} />
          <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
            Token Enviado!
          </Typography>
          <Typography sx={{ textAlign: 'center' }} color="text.secondary">
            Um token de acesso foi enviado para o seu e-mail.
            Você será redirecionado em instantes para informá-lo.
          </Typography>
        </Paper>
      </Backdrop>
    </Box>
  );
};

export default AssociateLoginForm;
