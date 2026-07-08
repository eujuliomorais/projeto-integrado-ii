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
  Snackbar,
  Alert,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DuplicateCPFDialog from './DuplicateCPFDialog';
import PasswordField from '../components/PasswordField';
import { accessControlCreate } from '../services/auth/authService';
import { type Role } from '../services/auth/roles';
import { maskCPF, maskPhone } from '../utils/masks.util';

const AccessControlCreateForm = () => {
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    cpf: '',
    email: '',
    password: '',
    type: '',
  });
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [duplicateOpen, setDuplicate] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; severity: 'success' | 'error'; msg: string }>({
    open: false,
    severity: 'success',
    msg: '',
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);

    const role = String(data.get('type') ?? ''); // ? 'type'
    const fullName = String(data.get('name') ?? '');
    const phone = String(data.get('phone') ?? '');
    const cpf = String(data.get('cpf') ?? '');
    const email = String(data.get('email') ?? '');
    const password = String(data.get('password') ?? '');

    const newErrors = {
      name: '',
      phone: '',
      cpf: '',
      email: '',
      password: '',
      type: '',
    };

    if (!fullName.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Telefone inválido';
    }

    if (!cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (cpf.replace(/\D/g, '').length !== 11) {
      newErrors.cpf = 'CPF inválido';
    }

    if (!email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 8) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
    }

    if (!role) {
      newErrors.type = 'Selecione um perfil';
    }

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(Boolean);

    if (hasErrors) {
      return;
    }

    setLoading(true);

    try {
      await accessControlCreate({
        cpf: cpf.replace(/\D/g, ''),
        email,
        fullName,
        password,
        phone: phone.replace(/\D/g, ''),
        role: role as Role,
      });

      setSnack({
        open: true,
        severity: 'success',
        msg: 'Usuário cadastrado com sucesso!',
      });

      setTimeout(() => navigate('/controle-de-acesso'), 1500);
    } catch (err: unknown) {
      const apiMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      const msgLower = (apiMsg || '').toLowerCase();
      
      if (
        msgLower.includes('cpf') ||
        msgLower.includes('email') ||
        msgLower.includes('already') ||
        msgLower.includes('unexpected error') // Fallback para o erro 500 gerado pela falta de tratamento no back
      ) {
        setDuplicate(true);
      } else {
        const finalMsg = apiMsg || 'Erro ao cadastrar usuário. Verifique as credenciais.';
        setSnack({
          open: true,
          severity: 'error',
          msg: finalMsg,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const roleLabels = {
    ADMIN: 'Administrador',
    CONSULTANT: 'Consultor',
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
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Telefone"
              name="phone"
              placeholder="Digite o telefone"
              required
              fullWidth
              value={phone}
              onChange={(e) => setPhone(maskPhone(e.target.value))}
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { maxLength: 15 },
              }}
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              label="CPF"
              name="cpf"
              placeholder="Informe o CPF"
              required
              fullWidth
              value={cpf}
              onChange={(e) => setCpf(maskCPF(e.target.value))}
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { maxLength: 14 },
              }}
              error={!!errors.cpf}
              helperText={errors.cpf}
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
              error={!!errors.email}
              helperText={errors.email}
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
              error={!!errors.password}
              helperText={errors.password}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth required error={!!errors.type}>
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
              {!!errors.type && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ ml: 1.75, mt: 0.5 }}
                >
                  {errors.type}
                </Typography>
              )}
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

      <DuplicateCPFDialog
        open={duplicateOpen}
        onClose={() => setDuplicate(false)}
      />
    </Box>
  );
};

export default AccessControlCreateForm;
