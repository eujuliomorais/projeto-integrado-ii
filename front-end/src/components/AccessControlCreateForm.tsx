import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordField from '../components/PasswordField';

const AccessControlCreateForm = () => {
  const navigate = useNavigate();
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

    setLoading(true);
    try {
      // TODO: API call
      console.log(Object.fromEntries(data));
      navigate('/controle-de-acesso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Button
        startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
        onClick={() => navigate('/controle-de-acesso')}
        sx={{
          alignSelf: 'flex-start',
          color: 'text.secondary',
          fontWeight: 600,
          textTransform: 'none',
          p: 0,
          '&:hover': { bgcolor: 'transparent', color: 'primary.main' },
        }}
      >
        Voltar
      </Button>

      <Paper
        elevation={0}
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          p: { xs: 2, sm: 3 },
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2.5 }}>
          Dados Pessoais
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Nome Completo"
              name="name"
              required
              fullWidth
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Data de Nasc."
              name="birthDate"
              type="date"
              required
              fullWidth
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }}>
            <TextField
              label="UF"
              name="state"
              required
              fullWidth
              size="small"
              slotProps={{
                htmlInput: {
                  maxLength: 2,
                  style: { textTransform: 'uppercase' },
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Telefone / Celular"
              name="phone"
              required
              fullWidth
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Informe o CPF"
              name="cpf"
              required
              fullWidth
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="E-mail"
              name="email"
              type="email"
              required
              fullWidth
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <PasswordField
              label="Senha"
              name="password"
              placeholder="Digite a senha"
              helperText=" "
              fullWidth
              size="small"
              required
              autoComplete="new-password"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <PasswordField
              label="Confirmar Senha"
              name="passwordConfirm"
              placeholder="Confirme a senha"
              error={!!confirmError}
              helperText={confirmError || ' '}
              fullWidth
              size="small"
              required
              autoComplete="new-password"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Select
              name="type"
              defaultValue=""
              displayEmpty
              fullWidth
              size="small"
              required
              renderValue={(v) =>
                v === '' ? (
                  <Box component="span" sx={{ color: 'text.disabled' }}>
                    Tipo de Acesso
                  </Box>
                ) : (
                  String(v)
                )
              }
            >
              <MenuItem value="Administrador">Administrador</MenuItem>
              <MenuItem value="Circulador">Circulador</MenuItem>
            </Select>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ justifyContent: 'flex-end' }}
        >
          <Button
            type="button"
            variant="contained"
            onClick={() => navigate('/controle-de-acesso')}
            sx={{
              bgcolor: 'text.secondary',
              color: '#fff',
              fontWeight: 600,
              borderRadius: 10,
              textTransform: 'none',
              px: 3,
              width: { xs: '100%', sm: 'auto' },
              '&:hover': { bgcolor: 'text.primary' },
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{
              fontWeight: 600,
              borderRadius: 10,
              textTransform: 'none',
              px: 3,
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Continuar'
            )}
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default AccessControlCreateForm;
