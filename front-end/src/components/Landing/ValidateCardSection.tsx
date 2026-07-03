import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Fade,
} from '@mui/material';
import { useState } from 'react';
import { api_base_url } from '../../services/api';
import { validateCard } from '../../services/cardService';
import { convertToForm } from '../../utils/dates.util';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined'

interface CardResult {
  valid: string;
  avatarUrl: string;
  fullName: string;
  socialName: string;
  category: string;
  number: string;
  validity: string;
}

const ValidateCardSection = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CardResult | null>(null);
  const [snack, setSnack] = useState<{
    open: boolean;
    severity: 'success' | 'error';
    msg: string;
  }>({ open: false, severity: 'success', msg: '' });

  const toast = (severity: 'success' | 'error', msg: string) => {
    setSnack({ open: true, severity, msg });
  };

  const handleValidate = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const data = await validateCard(code.trim());
      if (data?.valid) {
        const cardResult: CardResult = {
          fullName: data.fullName || '—',
          socialName: data.socialName || '—',
          category: data.category.name || '—',
          number: code.trim(),
          validity: data.validity || '—',
          avatarUrl: data.avatarUrl || '',
          valid: data.valid ? 'Válido' : 'Inválido',
        };

        setResult(cardResult);
        toast('success', 'Carteirinha encontrada com sucesso!');
      } else {
        let errorMsg = data?.message || 'Carteirinha não encontrada.';
        if (errorMsg.includes('Card not found')) {
          errorMsg = 'Carteirinha não encontrada.';
        }
        toast('error', errorMsg);
      }
    } catch (err: unknown) {
      let msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Não foi possível validar. Tente novamente.';
      
      if (msg === 'Card not found') {
        msg = 'Carteirinha não encontrada.';
      }
      
      toast('error', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setCode('');
  };

  /* ── Renderização ── */
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, position: 'relative' }}>
      <Box sx={{ position: 'absolute', top: { xs: -100, sm: -80 }, width: '100%', maxWidth: 480, zIndex: 10 }}>
        <Fade in={snack.open}>
          <Alert
            onClose={() => setSnack((prev) => ({ ...prev, open: false }))}
            severity={snack.severity}
            variant="filled"
            sx={{ width: '100%', borderRadius: 2, fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          >
            {snack.msg}
          </Alert>
        </Fade>
      </Box>

      {result ? (
        /* ── Resultado inline ── */
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            width: '100%',
            px: 2,
          }}
        >
          {/* Card de resultado */}
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
              p: 4,
              width: '100%',
              maxWidth: 480,
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              bgcolor: '#ffffff',
            }}
          >
            <Avatar
              src={
                result.avatarUrl
                  ? `${api_base_url}${result.avatarUrl}`
                  : undefined
              }
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'primary.main',
                fontWeight: 700,
                fontSize: 28,
                flexShrink: 0,
                border: '2px solid',
                borderColor: 'primary.light',
              }}
            >
              {!result.avatarUrl && <PersonOutlineIcon sx={{ fontSize: 48, color: '#fff' }} />}
            </Avatar>

            <Stack spacing={1} sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', lineHeight: 1.2 }}>
                {result.socialName !== '—' ? result.socialName : result.fullName}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Categoria: {result.category}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Numeração: {result.number}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                sx={{ pt: 1, flexWrap: 'wrap', gap: 1 }}
              >
                <Chip
                  label={result.valid}
                  sx={{
                    bgcolor: 'success.main',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 13,
                    px: 1,
                  }}
                />
                <Chip
                  label={`Validade: ${convertToForm(result.validity)}`}
                  color="primary"
                  sx={{ fontWeight: 700, fontSize: 13 }}
                />
              </Stack>
            </Stack>
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleReset}
            sx={{
              borderRadius: 10,
              textTransform: 'none',
              fontWeight: 700,
              px: 4,
              py: 1.5,
            }}
          >
            Nova Verificação
          </Button>
        </Box>
      ) : (
        /* ── Formulário ── */
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, textAlign: 'center' }}>
            Validação da Carteirinha
          </Typography>

          <TextField
            label="Numeração da Carteirinha"
            placeholder="Digite a numeração da carteirinha"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
            size="small"
            sx={{ width: { xs: '100%', sm: 320 } }}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleValidate}
            disabled={loading || !code.trim()}
            sx={{
              borderRadius: 10,
              textTransform: 'none',
              fontWeight: 700,
              px: 5,
              py: 1.5,
            }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Verificar'
            )}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ValidateCardSection;
