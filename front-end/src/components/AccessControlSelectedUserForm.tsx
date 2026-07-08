import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api_base_url } from '../services/api';
import { normalizeRoleView, type Role } from '../services/auth/roles';
import {
  accessControlDeleteUser,
  accessControlGetUserById,
  accessControlUpdateUser,
  accessControlUpdateUserRole,
  type AccessControlGetUserByIdResponse,
} from '../services/user/userService';
import { maskCPF, maskPhone } from '../utils/masks.util';
import { default as DeleteConfirmDialog } from './DeleteConfirmDialog';

type FormState = AccessControlGetUserByIdResponse & { id: string };

const AccessControlSelectedUserForm = () => {
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [originalForm, setOriginalForm] = useState<FormState | null>(null);

  const [form, setForm] = useState<FormState | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [error, setError] = useState('');
  const [snack, setSnack] = useState<{
    open: boolean;
    severity: 'success' | 'error';
    msg: string;
  }>({
    open: false,
    severity: 'success',
    msg: '',
  });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const load = async () => {
      setLoadingData(true);
      setError('');
      try {
        const data = await accessControlGetUserById({ id });

        const loadedData = {
          ...data,
          id,
          cpf: maskCPF(data.cpf),
          phone: maskPhone(data.phone),
        };

        if (!cancelled) {
          setForm(loadedData);
          setOriginalForm(loadedData);
        }
      } catch {
        if (!cancelled) setError('Não foi possível carregar o perfil.');
      } finally {
        if (!cancelled) setLoadingData(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSave = async () => {
    if (!form || !id) return;

    const errors: Partial<Record<keyof FormState, string>> = {};

    if (!form.name.trim()) {
      errors.name = 'Nome é obrigatório';
    }

    if (!form.cpf.trim()) {
      errors.cpf = 'CPF é obrigatório';
    } else if (form.cpf.replace(/\D/g, '').length !== 11) {
      errors.cpf = 'CPF inválido';
    }

    if (!form.phone.trim()) {
      errors.phone = 'Telefone é obrigatório';
    } else if (form.phone.replace(/\D/g, '').length !== 11) {
      errors.phone = 'Telefone inválido';
    }

    if (!form.email.trim()) {
      errors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Formato de e-mail inválido';
    }

    if (!form.role) {
      errors.role = 'Selecione um perfil';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setSaving(true);
    setError('');

    const { email, id: formId, name: fullName, phone, role: newRole } = form;

    try {
      await accessControlUpdateUser({
        id: formId,
        fullName,
        email,
        phone: phone.replace(/\D/g, ''),
        token: token ?? '',
      });

      await accessControlUpdateUserRole({
        id: formId,
        newRole,
      });

      setOriginalForm({ ...form });
      setEditing(false);
      setSnack({
        open: true,
        severity: 'success',
        msg: 'Usuário atualizado com sucesso!',
      });
    } catch (err: unknown) {
      const apiMsg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setSnack({
        open: true,
        severity: 'error',
        msg: apiMsg || 'Erro ao salvar alterações. Verifique as credenciais.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!id) return;

    try {
      setLoadingData(true);

      await accessControlDeleteUser({ id });

      navigate('/controle-de-acesso', {
        state: {
          snack: { severity: 'success', msg: 'Usuário excluído com sucesso!' },
        },
      });
    } catch {
      setSnack({
        open: true,
        severity: 'error',
        msg: 'Erro ao excluir o perfil do usuário. Tente novamente.',
      });
    } finally {
      setLoadingData(false);
      setDeleteOpen(false);
    }
  };

  const field = (label: string, key: keyof FormState, disabled = false) => {
    const value = String(form?.[key] ?? '');

    return (
      <TextField
        label={label}
        value={value}
        onChange={(e) => {
          let newValue = e.target.value;

          if (key === 'cpf') {
            newValue = maskCPF(newValue);
          }

          if (key === 'phone') {
            newValue = maskPhone(newValue);
          }

          setForm((prev) => (prev ? { ...prev, [key]: newValue } : prev));

          setFieldErrors((prev) => ({
            ...prev,
            [key]: undefined,
          }));
        }}
        error={Boolean(fieldErrors[key])}
        helperText={fieldErrors[key]}
        disabled={disabled || !editing}
        size="small"
        fullWidth
        required={
          key === 'name' || key === 'cpf' || key === 'phone' || key === 'email'
        }
        type={key === 'email' ? 'email' : 'text'}
        slotProps={{
          htmlInput: {
            maxLength:
              key === 'cpf'
                ? 14
                : key === 'phone'
                  ? 15
                  : key === 'email'
                    ? 255
                    : undefined,
          },
        }}
      />
    );
  };

  /* ── Loading ── */
  if (loadingData) {
    return (
      <Stack spacing={3}>
        <Skeleton width={80} height={32} />
        <Paper
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: 3,
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: 'center', mb: 3 }}
          >
            <Skeleton variant="circular" width={80} height={80} />
            <Stack spacing={1}>
              <Skeleton width={180} height={24} />
              <Skeleton width={100} height={18} />
            </Stack>
          </Stack>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={2}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                <Skeleton height={40} />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Stack>
    );
  }

  /* ── Erro ── */
  if (error || !form) {
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
          }}
        >
          Voltar
        </Button>
        <Typography color="error">
          {error || 'Usuário não encontrado.'}
        </Typography>
      </Stack>
    );
  }

  return (
    <>
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
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: { xs: 2, sm: 3 },
          }}
        >
          {/* Header: avatar + nome + botão editar */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            sx={{
              justifyContent: 'space-between',
              alignItems: { xs: 'center', sm: 'flex-start' },
              mb: 3,
            }}
            spacing={2}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              sx={{ alignItems: 'center' }}
              spacing={2}
            >
              <Avatar
                src={
                  form.avatarUrl
                    ? `${api_base_url}${form.avatarUrl}`
                    : undefined
                }
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'grey.300',
                  fontSize: 28,
                  fontWeight: 700,
                  color: 'text.secondary',
                }}
              >
                <PersonIcon sx={{ color: 'grey.100', fontSize: 30 }} />
              </Avatar>
              <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {form.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {normalizeRoleView(form.role)}
                </Typography>
              </Box>
            </Stack>

            {!editing && (
              <Button
                startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                variant="contained"
                color="primary"
                onClick={() => setEditing(true)}
                sx={{
                  borderRadius: 10,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                Editar perfil
              </Button>
            )}
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2.5 }}>
            Dados Pessoais
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              {field('Nome Completo', 'name')}
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              {field('CPF', 'cpf', true)}
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              {field('Telefone', 'phone')}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>{field('E-mail', 'email')}</Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {editing ? (
                <FormControl
                  size="small"
                  fullWidth
                  error={Boolean(fieldErrors.role)}
                >
                  <InputLabel>Tipo de Acesso</InputLabel>
                  <Select
                    value={form.role ?? ''}
                    label="Tipo de Acesso"
                    onChange={(e) => {
                      setForm((prev) =>
                        prev ? { ...prev, role: e.target.value as Role } : prev
                      );

                      setFieldErrors((prev) => ({
                        ...prev,
                        role: undefined,
                      }));
                    }}
                  >
                    <MenuItem value="ADMIN">Administrador</MenuItem>
                    <MenuItem value="CONSULTANT">Consultor</MenuItem>
                  </Select>

                  <FormHelperText>{fieldErrors.role}</FormHelperText>
                </FormControl>
              ) : (
                <TextField
                  label="Tipo de Acesso"
                  value={normalizeRoleView(form.role) ?? ''}
                  disabled
                  size="small"
                  fullWidth
                />
              )}
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            Ações de Gerenciamento
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            sx={{
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', sm: 'center' },
            }}
            spacing={2}
          >
            <Button
              startIcon={<DeleteOutlineIcon />}
              variant="contained"
              onClick={() => setDeleteOpen(true)}
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
              Excluir Usuário
            </Button>

            {editing && (
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                <Button
                  variant="outlined"
                  onClick={() => {
                    if (originalForm) {
                      setForm({ ...originalForm });
                    }

                    setFieldErrors({});
                    setEditing(false);
                  }}
                  sx={{
                    borderRadius: 10,
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: 'text.secondary',
                    color: 'text.secondary',
                    width: { xs: '100%', sm: 'auto' },
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  disabled={saving}
                  sx={{
                    borderRadius: 10,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    width: { xs: '100%', sm: 'auto' },
                  }}
                >
                  {saving ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    'Salvar Alterações'
                  )}
                </Button>
              </Stack>
            )}
          </Stack>
        </Paper>
      </Stack>

      <DeleteConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

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
    </>
  );
};

export default AccessControlSelectedUserForm;
