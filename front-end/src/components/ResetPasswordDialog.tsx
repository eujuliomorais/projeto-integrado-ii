import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { adminOrConsultantSelfPasswordUpdate } from '../services/user/userService';
import PasswordField from './PasswordField';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const ResetPasswordDialog = ({ open, onClose, onSuccess, onError }: Props) => {
  const { token, logout } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    if (loading) return;
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    onClose();
  };

  const handleConfirm = async () => {
    setError('');

    if (!token) {
      logout();
      return;
    }

    if (newPassword.length < 8) {
      setError('A nova senha deve ter pelo menos 8 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('A confirmação de senha não coincide com a nova senha.');
      return;
    }

    setLoading(true);
    try {
      await adminOrConsultantSelfPasswordUpdate({
        token,
        confirmPassword,
        currentPassword,
        newPassword,
      });

      onSuccess('Senha redefinida com sucesso!');
      handleClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message ?? error.message);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Erro desconhecido');
      }

      onError('Erro ao redefinir a senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>Redefinição de senha</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ pt: 0.5 }}>
          <PasswordField
            label="Informe a senha anterior"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <PasswordField
            label="Informe a nova senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <PasswordField
            label="Confirme a nova senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && (
            <Typography variant="caption" color="error">
              {error}
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
          sx={{
            borderRadius: 10,
            textTransform: 'none',
            fontWeight: 600,
            borderColor: 'text.secondary',
            color: 'text.secondary',
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={
            loading || !currentPassword || !newPassword || !confirmPassword
          }
          variant="contained"
          color="primary"
          sx={{
            borderRadius: 10,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
          }}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            'Confirmar'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResetPasswordDialog;
