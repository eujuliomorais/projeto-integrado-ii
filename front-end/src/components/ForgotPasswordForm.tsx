import { ArrowBackIos } from '@mui/icons-material';
import MailOutlineIcon from '@mui/icons-material/MailOutlined';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = data.get('email') as string;

    setLoading(true);
    try {
      // TODO: integrar com API de envio de e-mail
      console.log('Enviar redefinição para:', email);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!sent) return;
    const timer = setTimeout(() => navigate('/reset-password'), 5000);
    return () => clearTimeout(timer);
  }, [sent, navigate]);

  return (
    <>
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
            INFORME SEU E-MAIL
            <br />
            CADASTRADO NO SISTEMA
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

          <TextField
            name="email"
            label="E-mail"
            placeholder="Digite seu e-mail"
            type="email"
            required
            helperText="Verifique se seu e-mail está digitado corretamente"
            fullWidth
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
              minWidth: 200,
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              'Solicitar Redefinição'
            )}
          </Button>
        </Stack>
      </Box>

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
          <Box
            component="img"
            src="/system-logo.png"
            alt="Logo Grupo Cultural"
            sx={{ maxWidth: 242, width: '100%', height: 'auto', maxHeight: 95 }}
          />
          <MailOutlineIcon color="primary" sx={{ fontSize: 48 }} />
          <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
            Redefinição de Senha
          </Typography>
          <Typography sx={{ textAlign: 'center' }} color="text.secondary">
            Um link para criar uma nova senha foi enviado para o seu e-mail.
            Você será redirecionado em instantes.
          </Typography>
        </Paper>
      </Backdrop>
    </>
  );
};

export default ForgotPasswordForm;
