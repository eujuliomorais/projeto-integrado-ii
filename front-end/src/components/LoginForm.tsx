import {
  Box,
  Button,
  CircularProgress,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { login } from '../services/auth/authService';
import PasswordField from './PasswordField';

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();
  const { setAuthToken } = useAuth();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setEmailError('');

    const data = new FormData(e.currentTarget);
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    setLoading(true);

    try {
      const { token } = await login({ email, password });
      setAuthToken(token);
      navigate('/dashboard');
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

        <PasswordField
          label="Senha"
          name="password"
          placeholder="Digite sua senha"
          helperText=" "
          fullWidth
          required
          autoComplete="current-password"
        />

        <Link
          component={RouterLink}
          to="/forgot-password"
          underline="hover"
          color="primary"
          sx={{ alignSelf: 'flex-start', fontSize: 14, fontWeight: 500 }}
        >
          Esqueceu sua senha?
        </Link>

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

export default LoginForm;
