import WarningAmberIcon from '@mui/icons-material/WarningAmber';
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

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title?: string;
  description?: string;
  confirmLabel?: string;
}



const DeleteConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirmar Exclusão de Perfil',
  description = 'Tem certeza que deseja excluir esse perfil? Todos os dados e permissões deste associado serão removidos do sistema.',
  confirmLabel = 'Sim, Excluir Perfil',
}: DeleteConfirmDialogProps) => {
  const [loading, setLoading] = useState(false);
  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
    >
      <DialogTitle>
        <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1.5}>
          <WarningAmberIcon color="warning" sx={{ fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            borderRadius: 10,
            textTransform: 'none',
            fontWeight: 600,
            color: 'text.secondary',
            borderColor: 'text.secondary',
          }}
          variant="outlined"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={loading}
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
            confirmLabel
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
