import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Button,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChangeAccessKeyDialog from './ChangeAccessKeyDialog';

interface AccessControlProfileData {
  association: string;
  email: string;
}

// TODO: substituir por contexto de autenticação
const MOCK_PROFILE: AccessControlProfileData = {
  association: 'Associação com Dom Maurício',
  email: 'nicolas@email.com',
};

const AccessControlProfileForm = () => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<AccessControlProfileData>({
    ...MOCK_PROFILE,
  });
  const [loading, setLoading] = useState(false);
  const [keyDialogOpen, setKeyDialogOpen] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: API call
      console.log('Save profile:', form);
      setEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setForm({ ...MOCK_PROFILE });
  };

  return (
    <>
      <Stack spacing={3}>
        {/* Breadcrumb
        <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1}>
          <PeopleOutlineIcon sx={{ color: 'primary.main', fontSize: 18 }} />
          <Typography
            variant="body2"
            color="primary.main"
            sx={{ fontWeight: 600 }}
          >
            Controle de Acesso
          </Typography>
        </Stack> */}

        <Button
          startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
          onClick={() => navigate(-1)}
          sx={{
            alignSelf: 'flex-start',
            color: 'text.secondary',
            fontWeight: 600,
            textTransform: 'none',
            p: 0,
            '&:hover': { bgcolor: 'transparent', color: 'primary.main' },
          }}
        >
          Voltar
        </Button>

        {/* Title row */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
          }}
          spacing={2}
        >
          {!editing && (
            <Button
              startIcon={<EditIcon sx={{ fontSize: 16 }} />}
              variant="contained"
              color="primary"
              onClick={() => setEditing(true)}
              sx={{
                borderRadius: 10,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              Editar perfil
            </Button>
          )}
        </Stack>

        <Paper
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: { xs: 2, sm: 3 },
          }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Associação"
                value={form.association}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, association: e.target.value }))
                }
                disabled={!editing}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="E-mail"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                disabled={!editing}
                size="small"
                fullWidth
                type="email"
              />
            </Grid>
          </Grid>

          {!editing && (
            <>
              {/* <Divider sx={{ my: 3 }} /> */}
              <Button
                startIcon={<LockOutlinedIcon sx={{ fontSize: 18 }} />}
                variant="contained"
                onClick={() => setKeyDialogOpen(true)}
                sx={{
                  my: 3,
                  bgcolor: 'primary',
                  color: '#fff',
                  fontWeight: 600,
                  borderRadius: 10,
                  textTransform: 'none',
                  px: 3,
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                Alterar chave de acesso
              </Button>
            </>
          )}

          {editing && (
            <>
              {/* <Divider sx={{ my: 3 }} /> */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ justifyContent: 'center', mt: 3 }}
              >
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  sx={{
                    borderRadius: 10,
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: 'text.secondary',
                    color: 'text.secondary',
                    width: { xs: '100%', sm: 'auto' },
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  disabled={loading}
                  sx={{
                    borderRadius: 10,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    width: { xs: '100%', sm: 'auto' },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    'Salvar Alterações'
                  )}
                </Button>
              </Stack>
            </>
          )}
        </Paper>
      </Stack>

      <ChangeAccessKeyDialog
        open={keyDialogOpen}
        onClose={() => setKeyDialogOpen(false)}
      />
    </>
  );
};

export default AccessControlProfileForm;
