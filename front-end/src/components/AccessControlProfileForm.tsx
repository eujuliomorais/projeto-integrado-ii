import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Alert, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Paper, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authGetProfile } from '../services/auth/authService';
import { accessControlUpdateUser } from '../services/user/userService';
import type { User } from '../services/user/user.types';
import ChangeAccessKeyDialog from './ChangeAccessKeyDialog';

const AccessControlProfileForm = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<User | null>(null);
  const [, setLoading] = useState(false);
  const [keyDialogOpen, setKeyDialogOpen] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ email: '' });
  const [saving, setSaving] = useState(false);
  const [confirmEmailOpen, setConfirmEmailOpen] = useState(false);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [snackSeverity, setSnackSeverity] = useState<'success' | 'error'>('success');

  const handleSnackClose = () => {
    setSnackOpen(false);
  };

  useEffect(() => {
    async function fetchProfile() {
      if (!token) return;

      setLoading(true);

      try {
        const data = await authGetProfile({ token });

        const {
          email,
          role,
          cpf = '',
          id = '',
          name = '',
          phone = '',
          avatarUrl,
        } = data;

        const userProfile: User = {
          cpf,
          email,
          role,
          id,
          name,
          phone,
          avatarUrl,
        };

        setProfile(userProfile);
        setEditData({ email: userProfile.email });
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [token]);

  const handleSave = async () => {
    if (!token || !profile?.id) return;
    
    if (editData.email.trim().toLowerCase() !== profile.email.trim().toLowerCase()) {
      setConfirmEmailOpen(true);
      return;
    }
    await performSave();
  };

  const performSave = async () => {
    setConfirmEmailOpen(false);
    setSaving(true);
    try {
      await accessControlUpdateUser({
        token,
        id: profile!.id,
        fullName: profile!.name,
        email: editData.email,
        phone: profile!.phone,
      });

      if (editData.email.trim().toLowerCase() !== profile!.email.trim().toLowerCase()) {
        logout();
        return;
      }

      setProfile({ ...profile!, email: editData.email });
      setIsEditing(false);
      setSnackMessage('Perfil atualizado com sucesso!');
      setSnackSeverity('success');
      setSnackOpen(true);
    } catch {
      setSnackMessage('Erro ao atualizar perfil.');
      setSnackSeverity('error');
      setSnackOpen(true);
    } finally {
      setSaving(false);
    }
  };

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

        <Stack
          direction="row"
          sx={{ alignItems: 'center', justifyContent: 'flex-end' }}
        >
          {!isEditing && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => setIsEditing(true)}
              sx={{
                borderRadius: 10,
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
              }}
            >
              Editar Dados
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
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            Dados da Instituição
          </Typography>

          <Stack spacing={2.5} sx={{ maxWidth: 450, mb: 3 }}>
            <TextField
              label="E-mail"
              value={isEditing ? editData.email : profile?.email || ''}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              disabled={!isEditing}
              size="small"
              fullWidth
              type="email"
            />
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            Segurança
          </Typography>

          <Button
            startIcon={<LockOutlinedIcon sx={{ fontSize: 18 }} />}
            variant="contained"
            onClick={() => setKeyDialogOpen(true)}
            sx={{
              bgcolor: 'primary.main',
              color: '#fff',
              fontWeight: 600,
              borderRadius: 10,
              textTransform: 'none',
              px: 3,
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            Alterar chave de acesso
          </Button>

          {isEditing && (
            <>
              <Divider sx={{ my: 3 }} />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  disabled={saving}
                  onClick={() => {
                    setIsEditing(false);
                    setEditData({ email: profile?.email || '' });
                  }}
                  sx={{ borderRadius: 10, textTransform: 'none', fontWeight: 600, px: 3, borderColor: 'text.secondary', color: 'text.secondary' }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  disabled={saving}
                  onClick={handleSave}
                  sx={{ borderRadius: 10, textTransform: 'none', fontWeight: 600, px: 3 }}
                >
                  {saving ? <CircularProgress size={20} color="inherit" /> : 'Salvar Alterações'}
                </Button>
              </Stack>
            </>
          )}
        </Paper>
      </Stack>

      <ChangeAccessKeyDialog
        open={keyDialogOpen}
        onClose={() => setKeyDialogOpen(false)}
        onSuccess={(msg) => {
          setSnackMessage(msg);
          setSnackSeverity('success');
          setSnackOpen(true);
        }}
        onError={(msg) => {
          setSnackMessage(msg);
          setSnackSeverity('error');
          setSnackOpen(true);
        }}
      />

      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackClose}
          severity={snackSeverity}
          variant="filled"
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          {snackMessage}
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

export default AccessControlProfileForm;
