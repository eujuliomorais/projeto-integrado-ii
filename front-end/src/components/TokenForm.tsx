import { ArrowBackIos } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const TOKEN_LENGTH = 6;

const TokenForm = () => {
  const [digits, setDigits] = useState<string[]>(Array(TOKEN_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const navigate = useNavigate();

  const focusAt = (index: number) => inputRefs.current[index]?.focus();

  const handleChange = (index: number, value: string) => {
    const char = value.replace(/\D/g, '').slice(-1);
    const updated = [...digits];
    updated[index] = char;
    setDigits(updated);
    setError('');
    if (char && index < TOKEN_LENGTH - 1) focusAt(index + 1);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0)
      focusAt(index - 1);
    if (e.key === 'ArrowLeft' && index > 0) focusAt(index - 1);
    if (e.key === 'ArrowRight' && index < TOKEN_LENGTH - 1) focusAt(index + 1);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, TOKEN_LENGTH);
    if (!pasted) return;
    const updated = Array(TOKEN_LENGTH).fill('');
    pasted.split('').forEach((char, i) => {
      updated[i] = char;
    });
    setDigits(updated);
    setError('');
    focusAt(Math.min(pasted.length, TOKEN_LENGTH - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = digits.join('');
    if (token.length < TOKEN_LENGTH) {
      setError('Preencha todos os campos do token.');
      return;
    }
    setLoading(true);
    try {
      // TODO: integrar com API de validação de token
      console.log('Token:', token);
      navigate('/dashboard');
    } catch {
      setError('Token inválido ou expirado. Tente novamente.');
      setDigits(Array(TOKEN_LENGTH).fill(''));
      focusAt(0);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    console.log('Reenviar token');
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ width: '100%' }}
    >
      <Stack spacing={3} sx={{ alignItems: 'center' }}>
        <Typography
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
            fontWeight: 800,
            letterSpacing: 3,
            fontSize: { xs: 14, sm: 16 },
            lineHeight: 1.6,
          }}
        >
          INSIRA O TOKEN
          <br />
          DE ACESSO
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'center' }}
        >
          Um código de {TOKEN_LENGTH} dígitos foi enviado
          <br />
          para o seu e-mail cadastrado!
        </Typography>

        <Button
          component={RouterLink}
          to="/login-associado"
          startIcon={<ArrowBackIos sx={{ fontSize: 14 }} />}
          sx={{
            alignSelf: 'flex-start',
            color: 'text.secondary',
            fontWeight: 600,
            textTransform: 'none',
            p: 0,
            '&:hover': { bgcolor: 'transparent', color: 'primary.main' },
          }}
        >
          Voltar ao Login
        </Button>

        {/* OTP inputs — flex para preencher toda a largura disponível */}
        <Box
          onPaste={handlePaste}
          sx={{
            display: 'flex',
            gap: { xs: '6px', sm: '8px' },
            width: '100%',
          }}
        >
          {digits.map((digit, index) => (
            <TextField
              key={index}
              inputRef={(el) => {
                inputRefs.current[index] = el;
              }}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              error={!!error}
              slotProps={{
                htmlInput: {
                  maxLength: 1,
                  inputMode: 'numeric' as const,
                  pattern: '[0-9]*',
                  'aria-label': `Dígito ${index + 1} do token`,
                  style: {
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: 'clamp(16px, 4vw, 22px)',
                    padding: 0,
                  },
                },
              }}
              sx={{
                flex: 1, // divide espaço igualmente
                minWidth: 0, // impede overflow
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  aspectRatio: '1 / 1', // sempre quadrado
                  height: 'auto',
                },
                '& .MuiOutlinedInput-input': {
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              }}
            />
          ))}
        </Box>

        {error && (
          <Typography
            variant="caption"
            color="error"
            sx={{ textAlign: 'center' }}
          >
            {error}
          </Typography>
        )}

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'center' }}
        >
          Não recebeu?
          <br />{' '}
          {resendCooldown > 0 ? (
            <Typography component="span" variant="body2" color="text.disabled">
              Reenviar em {resendCooldown}s
            </Typography>
          ) : (
            <Link
              component="button"
              type="button"
              onClick={handleResend}
              underline="hover"
              color="primary"
              sx={{ fontWeight: 600, verticalAlign: 'baseline' }}
            >
              Clique aqui para reenviar!
            </Link>
          )}
        </Typography>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{
            fontWeight: 'bold',
            py: 1.5,
            px: 4,
            borderRadius: 10,
            textTransform: 'none',
            minWidth: 130,
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Entrar'}
        </Button>
      </Stack>
    </Box>
  );
};

export default TokenForm;
