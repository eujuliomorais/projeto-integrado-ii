import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
}

const DuplicateCPFDialog = ({ open, onClose }: Props) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="xs"
    fullWidth
    slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
  >
    <DialogTitle>
      <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1.5}>
        <WarningAmberIcon color="warning" sx={{ fontSize: 28 }} />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Cadastro Duplicado
        </Typography>
      </Stack>
    </DialogTitle>
    <DialogContent>
      <Typography variant="body2" color="text.secondary">
        Não foi possível realizar o cadastro pois este Email ou CPF já está
        cadastrado no banco de dados.
      </Typography>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button
        onClick={onClose}
        variant="contained"
        color="primary"
        sx={{ borderRadius: 10, textTransform: 'none', fontWeight: 600, px: 3 }}
      >
        Entendido
      </Button>
    </DialogActions>
  </Dialog>
);

export default DuplicateCPFDialog;
