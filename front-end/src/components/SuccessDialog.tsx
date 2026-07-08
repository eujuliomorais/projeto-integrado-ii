import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

interface SuccessDialogProps {
  open: boolean;
  onClose: () => void;
  message: string;
}

const SuccessDialog = ({ open, onClose, message }: SuccessDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Sucesso</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuccessDialog;
