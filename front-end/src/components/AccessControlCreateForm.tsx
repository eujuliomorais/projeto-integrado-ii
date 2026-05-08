import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordField from '../components/PasswordField';
import { accessControlCreate } from '../services/auth/authService';
import { type Role } from '../services/auth/roles';

const AccessControlCreateForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const data = new FormData(e.currentTarget);

      const role = data.get('type') as Role;
      const fullName = data.get('name') as string;
      const phone = data.get('phone') as string;
      const cpf = data.get('cpf') as string;
      const email = data.get('email') as string;
      const password = data.get('password') as string;

      const res = await accessControlCreate({
        cpf,
        email,
        fullName,
        password,
        phone,
        role,
      });

      console.log(res);
      console.log(res.message);

      console.log(Object.fromEntries(data));
      navigate('/controle-de-acesso');
    } finally {
      setLoading(false);
    }
  };

  const roleLabels = {
    ADMIN: 'Administrador',
    CONSULTANT: 'Circulador',
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ width: '100%' }}
    >
      <Stack spacing={4}>
        {/* Voltar */}
        <Button
          startIcon={<ArrowBackIosIcon sx={{ fontSize: 14 }} />}
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

        {/* Título seção */}
        <Typography variant="h6" sx={{ fontWeight: 700 }} color="text.primary">
          Dados Pessoais
        </Typography>

        {/* Linha 1: Nome, Telefone, CPF */}
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 5 }}>
            <TextField
              label="Nome Completo"
              name="name"
              placeholder="Informe o nome"
              required
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Telefone"
              name="phone"
              placeholder="Digite o telefone"
              required
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              label="CPF"
              name="cpf"
              placeholder="Informe o CPF"
              required
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>

          {/* Linha 2: Email, Senha Temporária, Tipo de Perfil */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Email"
              name="email"
              type="email"
              placeholder="Informe o E-mail"
              required
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <PasswordField
              label="Senha Temporária"
              name="password"
              placeholder="Digite a senha"
              required
              fullWidth
              autoComplete="new-password"
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth required>
              <InputLabel shrink>Tipo de Perfil</InputLabel>

              <Select
                name="type"
                defaultValue=""
                label="Tipo de Perfil"
                displayEmpty
                notched
                renderValue={(v) =>
                  v === '' ? (
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      Selecione
                    </Box>
                  ) : (
                    roleLabels[v as keyof typeof roleLabels]
                  )
                }
              >
                {Object.entries(roleLabels).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Botões */}
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
              bgcolor: 'grey.300',
              color: 'text.primary',
              fontWeight: 700,
              borderRadius: 10,
              textTransform: 'none',
              px: 4,
              py: 1.5,
              boxShadow: 'none',
              width: { xs: '100%', sm: 'auto' },
              '&:hover': { bgcolor: 'grey.400', boxShadow: 'none' },
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
              fontWeight: 700,
              borderRadius: 10,
              textTransform: 'none',
              px: 4,
              py: 1.5,
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              'Confirmar'
            )}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AccessControlCreateForm;
