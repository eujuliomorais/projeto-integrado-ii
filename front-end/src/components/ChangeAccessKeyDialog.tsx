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
import { authResetAccessKey } from '../services/auth/authService';
import PasswordField from './PasswordField';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

const ChangeAccessKeyDialog = ({ open, onClose, onSuccess, onError }: Props) => {
  const { token, logout } = useAuth();

  const [newKey, setNewKey] = useState('');
  const [confirmKey, setConfirmKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    if (loading) return;
    setNewKey('');
    setConfirmKey('');
    setError('');
    onClose();
  };

  const handleConfirm = async () => {
    setError('');

    if (!token) {
      logout();
      return;
    }

    if (newKey.length < 8) {
      setError('A nova chave deve ter pelo menos 8 caracteres.');
      return;
    }

    if (newKey !== confirmKey) {
      setError('A confirmação não coincide com a nova chave.');
      return;
    }

    setLoading(true);
    try {
      await authResetAccessKey({
        bearerToken: token,
        newAccessKey: newKey,
        confirmAccessKey: confirmKey,
      });

      if (onSuccess) onSuccess('Chave de acesso redefinida com sucesso!');
      handleClose();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro desconhecido');
      }

      if (onError) onError('Erro ao redefinir a chave. Tente novamente.');
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
      <DialogTitle sx={{ fontWeight: 700 }}>Redefinição da Chave de Acesso</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ pt: 0.5 }}>
          <PasswordField
            label="Informe a nova chave"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
          />

          <PasswordField
            label="Confirme a nova chave"
            value={confirmKey}
            onChange={(e) => setConfirmKey(e.target.value)}
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
          disabled={loading || !newKey || !confirmKey}
          variant="contained"
          color="primary"
          sx={{
            borderRadius: 10,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Confirmar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeAccessKeyDialog;
