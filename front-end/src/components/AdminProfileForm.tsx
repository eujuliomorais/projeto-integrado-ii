import EditIcon from '@mui/icons-material/Edit';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api_base_url } from '../services/api';
import { authGetProfile } from '../services/auth/authService';
import { normalizeRoleView } from '../services/auth/roles';
import { getAvatar, uploadAvatar } from '../services/user/imageService';
import type { User } from '../services/user/user.types';
import { updateOwnContact } from '../services/user/userService';
import { maskCPF, maskPhone } from '../utils/masks.util';
import ResetPasswordDialog from './ResetPasswordDialog';

interface AdminProfileForm {
  fullName: string;
  cpf: string;
  email: string;
  phone: string;
  role: string;
}

const blank: AdminProfileForm = {
  fullName: '',
  cpf: '',
  email: '',
  phone: '',
  role: '',
};

type Snack = { open: boolean; severity: 'success' | 'error'; msg: string };

const AdminProfileForm = () => {
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof AdminProfileForm, string>>
  >({});

  const { token, logout } = useAuth();
  const [originalForm, setOriginalForm] = useState<AdminProfileForm>({
    ...blank,
  });
  const [form, setForm] = useState<AdminProfileForm>({ ...blank });

  const [profile, setProfile] = useState<User | null>(null);

  const [avatarUrl, setAvatarUrl] = useState<string>('');

  // NOVOS ESTADOS PARA O RASCUNHO DA FOTO
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [confirmEmailOpen, setConfirmEmailOpen] = useState(false);
  const [snack, setSnack] = useState<Snack>({
    open: false,
    severity: 'success',
    msg: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const user = await authGetProfile({ token });

        const {
          email,
          role,
          cpf = '',
          id = '',
          name = '',
          phone = '',
          avatarUrl: userUrl,
        } = user;

        const userProfile: User = {
          cpf,
          email,
          role,
          id,
          name,
          phone,
          avatarUrl: userUrl,
        };

        setProfile(userProfile);

        const formData = {
          fullName: user.name ?? '',
          cpf: maskCPF(user.cpf ?? ''),
          email: user.email ?? '',
          phone: maskPhone(user.phone ?? ''),
          role: normalizeRoleView(user.role),
        };
        setOriginalForm(formData);
        setForm(formData);

        if (id) {
          let imageUrl;
          try {
            imageUrl = await getAvatar({ token, id });
          } catch {
            imageUrl = '';
          } finally {
            setAvatarUrl(imageUrl ? `${api_base_url}${imageUrl}` : '');
          }
        }
      } catch {
        setSnack({
          open: true,
          severity: 'error',
          msg: 'Erro ao carregar perfil.',
        });
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [token]);

  // AGORA APENAS CRIA O RASCUNHO DA IMAGEM
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const set =
    (key: keyof AdminProfileForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      if (key === 'cpf') {
        value = maskCPF(value);
      }

      if (key === 'phone') {
        value = maskPhone(value);
      }

      setForm((p) => ({ ...p, [key]: value }));

      setFieldErrors((prev) => ({
        ...prev,
        [key]: undefined,
      }));
    };

  const handleSave = async () => {
    if (!token) return;
    setFieldErrors({});

    const errors: Partial<Record<keyof AdminProfileForm, string>> = {};

    if (!form.fullName.trim()) {
      errors.fullName = 'Nome é obrigatório';
    }

    if (!form.email.trim()) {
      errors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Formato de e-mail inválido';
    }

    if (!form.cpf.trim()) {
      errors.cpf = 'CPF é obrigatório';
    } else if (form.cpf.replace(/\D/g, '').length !== 11) {
      errors.cpf = 'CPF inválido';
    }

    if (!form.phone.trim()) {
      errors.phone = 'Telefone é obrigatório';
    } else if (form.phone.replace(/\D/g, '').length < 10) {
      errors.phone = 'Telefone inválido';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    if (!profile) return;

    if (
      form.email.trim().toLocaleLowerCase() !==
      originalForm.email.trim().toLocaleLowerCase()
    ) {
      setConfirmEmailOpen(true);
      return;
    }

    await performSave();
  };

  const performSave = async () => {
    setConfirmEmailOpen(false);
    setSaving(true);
    try {
      // 1. Atualiza os dados de contato
      await updateOwnContact({
        token: token!,
        email: form.email,
        phone: form.phone.replace(/\D/g, ''),
      });

      // 2. Faz o upload da foto se o usuário selecionou uma nova
      if (avatarFile) {
        const avatarPath = await uploadAvatar({
          token: token!,
          file: avatarFile,
        });
        setAvatarUrl(`${api_base_url}${avatarPath}`);
      }

      if (
        form.email.trim().toLocaleLowerCase() !==
        originalForm.email.trim().toLocaleLowerCase()
      ) {
        logout();
        return;
      }

      // 3. Reseta os estados de edição
      setEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);

      setSnack({
        open: true,
        severity: 'success',
        msg: 'Perfil atualizado com sucesso!',
      });

      setOriginalForm(form);
    } catch {
      setForm(originalForm);
      setEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);

      setSnack({
        open: true,
        severity: 'error',
        msg: 'Erro ao salvar perfil.',
      });
    } finally {
      setSaving(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const f = (
    label: string,
    key: keyof AdminProfileForm,
    isAlwaysDisabled = false
  ) => (
    <TextField
      label={label}
      value={form[key]}
      onChange={set(key)}
      disabled={isAlwaysDisabled || !editing}
      size="small"
      fullWidth
      required
      error={Boolean(fieldErrors[key])}
      helperText={fieldErrors[key]}
    />
  );

  return (
    <>
      <Stack spacing={2.5}>
        <Stack
          direction="row"
          sx={{ alignItems: 'center', justifyContent: 'flex-end' }}
        >
          {!editing && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => {
                setFieldErrors({});
                setEditing(true);
              }}
              sx={{
                borderRadius: 10,
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
              }}
            >
              Editar perfil
            </Button>
          )}
        </Stack>

        <Paper
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: { xs: 2, sm: 3 },
          }}
        >
          {/* Avatar Area */}
          <Stack sx={{ alignItems: 'center', mb: 3 }}>
            {/* Input escondido para o arquivo */}
            <input
              type="file"
              hidden
              accept="image/*"
              ref={fileInputRef}
              onChange={handleAvatarChange}
            />

            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                editing ? (
                  <IconButton
                    size="small"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={saving}
                    sx={{
                      bgcolor: 'primary.main',
                      color: '#fff',
                      width: 28,
                      height: 28,
                      '&:hover': { bgcolor: 'primary.dark' },
                    }}
                  >
                    <EditIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                ) : null
              }
            >
              <Avatar
                src={avatarPreview || avatarUrl}
                sx={{ width: 100, height: 100, bgcolor: 'primary.main' }}
              >
                {/* O ícone só aparece se não tiver src ou preview */}
                {!(avatarPreview || avatarUrl) && (
                  <PersonOutlineIcon
                    sx={{ fontSize: 64, color: '#ffffff' }}
                  />
                )}
              </Avatar>
            </Badge>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* Dados Pessoais */}
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            Dados Pessoais
          </Typography>
          {loading ? (
            <Stack sx={{ alignItems: 'center', py: 4 }}>
              <CircularProgress />
            </Stack>
          ) : (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12 }}>
                {f('Nome Completo', 'fullName', true)}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>{f('Telefone', 'phone')}</Grid>
              <Grid size={{ xs: 12, sm: 6 }}>{f('CPF', 'cpf', true)}</Grid>
              <Grid size={{ xs: 12, sm: 6 }}>{f('E-mail', 'email')}</Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Tipo de Acesso"
                  value={form.role}
                  disabled
                  size="small"
                  fullWidth
                />
              </Grid>
            </Grid>
          )}

          {/* Segurança */}
          <Divider sx={{ mb: 3 }} />
          <Stack
            direction="row"
            sx={{ alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Segurança
            </Typography>
            <Button
              variant="text"
              size="small"
              onClick={() => setResetOpen(true)}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: 'primary.main',
              }}
            >
              Alterar senha &rsaquo;
            </Button>
          </Stack>

          {/* Editing actions */}
          {editing && (
            <>
              <Divider sx={{ my: 3 }} />
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ justifyContent: 'flex-end' }}
              >
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditing(false);
                    setForm(originalForm);
                    setFieldErrors({});
                    // LIMPA A FOTO AO CANCELAR:
                    setAvatarFile(null);
                    setAvatarPreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
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
            </>
          )}
        </Paper>
      </Stack>

      <ResetPasswordDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onSuccess={(msg) => setSnack({ open: true, severity: 'success', msg })}
        onError={(msg) => setSnack({ open: true, severity: 'error', msg })}
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

      <Dialog
        open={confirmEmailOpen}
        onClose={() => setConfirmEmailOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
      >
        <DialogTitle component="div">
          <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1.5}>
            <WarningAmberIcon color="warning" sx={{ fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Alteração de E-mail
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Você alterou o seu e-mail. Para sua segurança, se confirmar esta
            alteração, você será desconectado automaticamente e precisará fazer
            login novamente com o novo e-mail. Deseja continuar?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setConfirmEmailOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: 10,
              textTransform: 'none',
              fontWeight: 600,
              color: 'text.secondary',
              borderColor: 'text.secondary',
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={performSave}
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 10,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
            }}
            disabled={saving}
          >
            {saving ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Confirmar e Sair'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminProfileForm;
