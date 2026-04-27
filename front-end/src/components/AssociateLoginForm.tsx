import { ArrowBackIos } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';
// import { login } from '../services/auth/authService';

const AssociateLoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();
  //   const { setAuthToken } = useAuth();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setEmailError('');

    // const data = new FormData(e.currentTarget);
    // const email = data.get('email') as string;

    setLoading(true);

    try {
      //   const { token } = await login({ email, password });
      //   setAuthToken(token);
      navigate('/token-associado');
    } catch {
      setEmailError('Credenciais inválidas. Verifique e tente novamente.');
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
      <Stack spacing={3} sx={{ alignItems: 'center' }}>
        <Typography
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
            fontWeight: 800,
            letterSpacing: { xs: 2, sm: 3 },
            fontSize: { xs: 14, sm: 16 },
            lineHeight: 1.6,
          }}
        >
          SISTEMA DE EMISSÃO
          <br />
          DE CARTEIRINHA
        </Typography>

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
    </Box>
  );
};

export default AssociateLoginForm;
