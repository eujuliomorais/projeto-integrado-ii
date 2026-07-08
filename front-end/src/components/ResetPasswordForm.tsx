import { ArrowBackIos } from '@mui/icons-material';
import LogoLaranja from '../assets/logo-laranja3.svg';
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authPasswordReset } from '../services/auth/authService';
import PasswordField from './PasswordField';

const ResetPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [confirmError, setConfirmError] = useState('');
  const [snack, setSnack] = useState<{ open: boolean; severity: 'success' | 'error'; msg: string }>({
    open: false,
    severity: 'success',
    msg: '',
  });

  const navigate = useNavigate();

  const { token, logout } = useAuth();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setConfirmError('');

    const data = new FormData(e.currentTarget);
    const password = data.get('password') as string;
    const confirm = data.get('passwordConfirm') as string;

    if (password !== confirm) {
      setConfirmError('As senhas não coincidem.');
      return;
    }

    if (password.length < 8) {
      setConfirmError('A senha deve ter no mínimo 8 caracteres.');
      return;
    }

    if (!token) {
      setConfirmError(
        'Não foi possível validar sua identidade. Volte as etapas desde o login.'
      );
      return;
    }

    setLoading(true);
    try {
      await authPasswordReset({
        newPassword: password,
        confirmPassword: confirm,
        bearerToken: token,
      });
      
      setSnack({ open: true, severity: 'success', msg: 'Senha alterada com sucesso!' });
      
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);
    } catch {
      setSnack({ open: true, severity: 'error', msg: 'Falha ao atualizar a senha. O link pode ter expirado.' });
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
        <Box
          component="img"
          src={LogoLaranja}
          alt="logo-SIGA"
          sx={{
            height: { xs: 80, sm: 100, md: 130 },
            width: 'auto',
            objectFit: 'contain',
            alignSelf: 'center',
          }}
        />
        <Typography
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
            fontWeight: 800,
            letterSpacing: 3,
            fontSize: { xs: 14, sm: 16 },
            lineHeight: 1.6,
          }}
        >
          INFORME SUA NOVA
          <br />
          SENHA
        </Typography>

        <Button
          component={Link}
          to="/login"
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
          Voltar ao Login
        </Button>

        <PasswordField
          label="Nova Senha"
          name="password"
          placeholder="Digite sua nova senha"
          helperText="Mínimo de 8 caracteres"
          fullWidth
          required
          autoComplete="new-password"
        />

        <PasswordField
          label="Confirmar Senha"
          name="passwordConfirm"
          placeholder="Confirme sua nova senha"
          error={!!confirmError}
          helperText={confirmError || ' '}
          fullWidth
          required
          autoComplete="new-password"
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
            minWidth: 200,
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          {loading ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            'Confirmar Alterações'
          )}
        </Button>
      </Stack>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snack.severity}
          variant="filled"
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResetPasswordForm;
