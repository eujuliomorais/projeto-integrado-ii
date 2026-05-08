import { Box, Typography } from '@mui/material';

const ComingSoonPage = () => {
  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom>
        Em desenvolvimento 🚧
      </Typography>

      <Typography color="text.secondary">
        Essa funcionalidade ainda não foi implementada.
      </Typography>
    </Box>
  );
};

export default ComingSoonPage;
