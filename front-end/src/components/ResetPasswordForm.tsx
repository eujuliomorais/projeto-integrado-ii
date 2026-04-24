import { ArrowBackIos } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import PasswordField from './PasswordField';

const ResetPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [confirmError, setConfirmError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    setLoading(true);
    try {
      // TODO: integrar com API de redefinição
      console.log('Nova senha definida');
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
    </Box>
  );
};

export default ResetPasswordForm;
