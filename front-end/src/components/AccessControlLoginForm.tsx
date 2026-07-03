import { ArrowBackIos } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  accessControlLogin,
  authGetProfile,
} from '../services/auth/authService';
import PasswordField from './PasswordField';
import Logo from '../assets/logo-laranja3.svg';

const AccessControlLoginForm = () => {
  const [loading, setLoading] = useState(false);

  const [keyError, setKeyError] = useState('');

  const navigate = useNavigate();

  const { setAuthToken } = useAuth();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setKeyError('');

    const data = new FormData(e.currentTarget);
    const accessKey = data.get('accessKey') as string;

    if (!accessKey.trim()) {
      setKeyError('A Chave de Acesso é obrigatória!');
      return;
    }

    setLoading(true);

    try {
      const { token } = await accessControlLogin({ accessKey });

      const user = await authGetProfile({ token });

      if (!user) {
        return;
      }
      setAuthToken(token);

      navigate('/controle-de-acesso');
    } catch {
      setKeyError('Chave inválida! Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

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
            alt="logo-SIGA"
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
            Controle de Acesso
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

        <PasswordField
          label="Chave de Acesso"
          name="accessKey"
          placeholder="Digite a Chave de Acesso"
          fullWidth
          required
          disabled={loading}
          error={!!keyError}
          helperText={keyError}
          onChange={() => {
            setKeyError('');
          }}
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
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Entrar'}
        </Button>
      </Stack>
    </Box>
  );
};

export default AccessControlLoginForm;
