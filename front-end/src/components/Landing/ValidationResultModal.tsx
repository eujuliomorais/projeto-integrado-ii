import MailOutlineIcon from '@mui/icons-material/MailOutlined';
import { Avatar, Box, Dialog, DialogContent, Typography } from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  message?: string;
}

const ValidationResultModal = ({ open, onClose, message }: Props) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="xs"
    fullWidth
    slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
  >
    <DialogContent>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          py: 2,
        }}
      >
        <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64 }}>
          <MailOutlineIcon sx={{ color: '#fff', fontSize: 34 }} />
        </Avatar>

        <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'center' }}>
          Carteirinha não encontrada
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'center' }}
        >
          {message ||
            'Não foi possível encontrar um associado com os dados informados. Por favor, verifique o código e tente novamente.'}
        </Typography>
      </Box>
    </DialogContent>
  </Dialog>
);

export default ValidationResultModal;
