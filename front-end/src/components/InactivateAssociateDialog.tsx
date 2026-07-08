import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  associateName?: string;
}

const InactivateAssociateDialog = ({
  open,
  onClose,
  onConfirm,
  associateName,
}: Props) => {
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    if (loading) return;
    setReason('');
    setConfirmed(false);
    onClose();
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(reason);
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
    >
      <DialogTitle>
        <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1.5}>
          <WarningAmberIcon color="warning" sx={{ fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Inativar Vínculo de Associado
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2.5}>
          <Typography variant="body2" color="text.secondary">
            Ao confirmar, você irá inativar o vínculo de{' '}
            <strong>{associateName ?? 'este associado'}</strong> com a
            associação. O associado perderá acesso aos benefícios e não poderá
            renovar a carteirinha.
          </Typography>

          <TextField
            label="Justificativa"
            placeholder="Informe o motivo da inativação"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            multiline
            rows={4}
            fullWidth
            size="small"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography variant="body2" color="text.secondary">
                Confirmo que desejo inativar o vínculo deste associado
              </Typography>
            }
          />
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
          disabled={loading || !confirmed}
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

export default InactivateAssociateDialog;
