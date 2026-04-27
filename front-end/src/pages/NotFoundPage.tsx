import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
        404
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Página não encontrada
      </Typography>

      <Button variant="contained" onClick={() => navigate('/dashboard')}>
        Voltar
      </Button>
    </Box>
  );
};

export default NotFoundPage;
