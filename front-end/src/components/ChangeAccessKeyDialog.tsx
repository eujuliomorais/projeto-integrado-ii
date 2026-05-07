import KeyIcon from '@mui/icons-material/Key';
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
import { useState } from 'react';
import PasswordField from './PasswordField';

interface ChangeAccessKeyDialogProps {
  open: boolean;
  onClose: () => void;
}

const ChangeAccessKeyDialog = ({
  open,
  onClose,
}: ChangeAccessKeyDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const form = e.currentTarget;
    const data = new FormData(form);
    const current = data.get('currentKey') as string;
    const next = data.get('newKey') as string;

    if (!current || !next) {
      setError('Preencha os dois campos.');
      return;
    }

    setLoading(true);
    try {
      // TODO: API call de troca de chave
      console.log('Trocar chave:', { current, next });
      onClose();
    } catch {
      setError('Chave atual incorreta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setError('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
    >
      <DialogTitle>
        <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1.5}>
          <KeyIcon color="primary" sx={{ fontSize: 26 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Redefinição da Chave de Acesso
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <form id="change-key-form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <PasswordField
              label="Digite a chave de acesso atual"
              name="currentKey"
              size="small"
              fullWidth
              required
              autoComplete="current-password"
            />
            <PasswordField
              label="Digite a nova chave de acesso"
              name="newKey"
              size="small"
              fullWidth
              required
              autoComplete="new-password"
              error={!!error}
              helperText={error || ' '}
            />
          </Stack>
        </form>
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
          type="submit"
          form="change-key-form"
          variant="contained"
          color="primary"
          disabled={loading}
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

export default ChangeAccessKeyDialog;
