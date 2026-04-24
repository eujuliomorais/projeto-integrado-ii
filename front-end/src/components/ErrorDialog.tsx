import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

interface ErrorDialogProps {
  open: boolean;
  onClose: () => void;
  message: string;
}

const ErrorDialog = ({ open, onClose, message }: ErrorDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Erro</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorDialog;
