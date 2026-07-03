import axios from "axios";
import DownloadIcon from '@mui/icons-material/Download';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { getMyAssociate } from '../../services/associate/associateService';
import type { AuthUser } from '../../services/auth/auth.types';
import { authGetProfile } from '../../services/auth/authService';
import { selfDownloadCard } from '../../services/cardService';

type Snack = {
  open: boolean;
  severity: 'success' | 'error';
  msg: string;
};

const AssociateDashboard = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [status, setStatus] = useState('Inativo');
  const [hasProfile, setHasProfile] = useState(false);
  const [profile, setProfile] = useState<AuthUser>();

  const [snack, setSnack] = useState<Snack>({
    open: false,
    severity: 'success',
    msg: '',
  });

  useEffect(() => {
    const loadAssociate = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await authGetProfile({ token });
        setFirstName(profile.name ? profile.name.split(' ')[0] : 'Associado');

        setProfile(profile);

        try {
          const associate = await getMyAssociate(token);

          const sd = associate.selfDeclaration;
          // Verifica se o associado já preencheu algum dado autodeclaratório real (ignora termo de consentimento)
          const hasCompletedComplementaryData =
            !!sd &&
            (!!sd.socialName ||
              !!sd.race ||
              !!sd.gender ||
              !!sd.sexualOrientation ||
              (!!sd.education && sd.education !== 'NÃO_SELECIONADO') ||
              (sd.income !== undefined &&
                sd.income !== null &&
                sd.income !== 0));

          setHasProfile(hasCompletedComplementaryData);
          setStatus(associate.user?.active ? 'Ativo' : 'Inativo');
        } catch {
          // Se retornar 404, o associado ainda não tem o objeto base
          setHasProfile(false);
          setStatus('Inativo');
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAssociate();
  }, [token]);

  if (loading) {
    return (
      <Stack sx={{ alignItems: 'center', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Stack>
    );
  }

  const toast = (severity: 'success' | 'error', msg: string) =>
    setSnack({
      open: true,
      severity,
      msg,
    });

  const handleDownloadCard = async () => {
    if (!token || !profile || !profile.id) return;
    try {
      const pdfBlob = await selfDownloadCard(token);

      const url = window.URL.createObjectURL(pdfBlob);

      const link = document.createElement('a');
      link.href = url;

      link.download = `carteirinha.pdf`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      toast('success', 'Carteirinha baixada com sucesso.');
    } catch (error) {
      let strError = 'Não foi possível gerar a carteirinha devido a um erro no servidor.';
      if (axios.isAxiosError(error)) {
        if (error.response?.data instanceof Blob) {
          try {
            const text = await error.response.data.text();
            const json = JSON.parse(text);
            strError = json.message || error.message;
          } catch {
            strError = error.message;
          }
        } else {
          strError = error.response?.data?.message ?? error.message;
        }
      } else if (error instanceof Error) {
        strError = error.message;
      }
      toast('error', strError);
    }
  };

  return (
    <Stack spacing={4}>
      <Typography variant="h4" sx={{ fontWeight: 700 }} color="text.primary">
        Bem Vindo(a), {firstName}
      </Typography>

      <Stack spacing={0.5}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, mb: 1.5 }}
          color="text.primary"
        >
          Ações
        </Typography>

        {!hasProfile && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddAlt1Icon />}
            onClick={() => navigate('/associado/meu-cadastro')}
            sx={{
              borderRadius: 10,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              width: 'fit-content',
              fontSize: 16,
            }}
          >
            Complementar Cadastro
          </Button>
        )}

        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadCard}
          sx={{
            borderRadius: 10,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            width: 'fit-content',
            fontSize: 16,
            mt: 1.5,
          }}
        >
          Baixar Carteirinha
        </Button>
      </Stack>

      <Stack spacing={1.5}>
        <Typography variant="h6" sx={{ fontWeight: 700 }} color="text.primary">
          Status do Vinculo
        </Typography>

        <Chip
          label={status}
          sx={{
            bgcolor: status === 'Ativo' ? '#8FA882' : '#9E9E9E',
            color: '#fff',
            fontWeight: 600,
            fontSize: 15,
            borderRadius: 3,
            px: 1,
            height: 40,
            width: 100,
          }}
        />
      </Stack>
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() =>
          setSnack((p) => ({
            ...p,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Alert
          severity={snack.severity}
          variant="filled"
          sx={{
            borderRadius: 2,
            fontWeight: 600,
          }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default AssociateDashboard;
