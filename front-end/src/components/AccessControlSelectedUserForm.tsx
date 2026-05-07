import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DeleteConfirmDialog from './DeleteConfirmDialog';

type UserType = 'Administrador' | 'Circulador';

interface ProfileData {
  id: string;
  name: string;
  cpf: string;
  type: UserType;
  email: string;
  phone: string;
  birthDate: string;
  state: string;
  address: string;
  registrationDate: string;
}

// TODO: substituir por chamada de API
const MOCK_USERS: ProfileData[] = [
  {
    id: '1',
    name: 'João da Silva',
    cpf: '000.000.000-00',
    type: 'Administrador',
    email: 'joao@email.com',
    phone: '(85) 9 0000-0000',
    birthDate: '01/01/1990',
    state: 'CE',
    address: 'Rua Exemplo, 123',
    registrationDate: '01/01/2024',
  },
  {
    id: '2',
    name: 'Maria Lopes Braga',
    cpf: '111.111.111-11',
    type: 'Administrador',
    email: 'maria@email.com',
    phone: '(85) 9 1111-1111',
    birthDate: '15/03/1985',
    state: 'CE',
    address: 'Av. Principal, 456',
    registrationDate: '05/03/2024',
  },
  {
    id: '3',
    name: 'Ana Safira Lima',
    cpf: '222.222.222-22',
    type: 'Circulador',
    email: 'ana@email.com',
    phone: '(85) 9 2222-2222',
    birthDate: '22/07/1995',
    state: 'CE',
    address: 'Rua das Flores, 789',
    registrationDate: '10/05/2024',
  },
  {
    id: '4',
    name: 'Gabriel Mendes',
    cpf: '333.333.333-33',
    type: 'Circulador',
    email: 'gabriel@email.com',
    phone: '(85) 9 3333-3333',
    birthDate: '30/11/1998',
    state: 'CE',
    address: 'Travessa Central, 12',
    registrationDate: '20/06/2024',
  },
];

const AccessControlSelectedUserForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const user = MOCK_USERS.find((u) => u.id === id) ?? MOCK_USERS[0];
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<ProfileData>({ ...user });
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: API call
      console.log('Save:', form);
      setEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setForm({ ...user });
  };

  const handleDeleteConfirm = async () => {
    // TODO: API call de exclusão
    console.log('Delete user:', id);
    navigate('/controle-de-acesso');
  };

  const field = (
    label: string,
    key: keyof ProfileData,
    forceDisabled = false
  ) => (
    <TextField
      label={label}
      value={form[key]}
      onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
      disabled={forceDisabled || !editing}
      size="small"
      fullWidth
    />
  );

  return (
    <>
      <Stack spacing={3}>
        <Button
          startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
          onClick={() => navigate('/controle-de-acesso')}
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

        <Paper
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: { xs: 2, sm: 3 },
          }}
        >
          {/* Header */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            sx={{
              justifyContent: 'space-between',
              alignItems: { xs: 'center', sm: 'flex-start' },
              mb: 3,
            }}
            spacing={2}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              sx={{ alignItems: 'center' }}
              spacing={2}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'grey.300',
                  fontSize: 28,
                  fontWeight: 700,
                  color: 'text.secondary',
                }}
              >
                {form.name.charAt(0)}
              </Avatar>
              <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {form.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {form.type}
                </Typography>
              </Box>
            </Stack>

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

          <Divider sx={{ mb: 3 }} />

          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2.5 }}>
            Dados Pessoais
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              {field('Nome Completo', 'name')}
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>{field('CPF', 'cpf')}</Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              {field('Nascimento', 'birthDate')}
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>{field('Endereço', 'address')}</Grid>
            <Grid size={{ xs: 12, sm: 4 }}>{field('Estado', 'state')}</Grid>
            {editing && (
              <>
                <Grid size={{ xs: 12, sm: 6 }}>{field('E-mail', 'email')}</Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {field('Telefone', 'phone')}
                </Grid>
              </>
            )}
            <Grid size={{ xs: 12, sm: 6 }}>
              {field('Data de Cadastro', 'registrationDate', true)}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {field('Tipo de Acesso', 'type')}
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            Ações de Gerenciamento
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            sx={{
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', sm: 'center' },
            }}
            spacing={2}
          >
            <Button
              startIcon={<DeleteOutlineIcon />}
              variant="contained"
              onClick={() => setDeleteOpen(true)}
              sx={{
                bgcolor: 'text.secondary',
                color: '#fff',
                fontWeight: 600,
                borderRadius: 10,
                textTransform: 'none',
                px: 3,
                width: { xs: '100%', sm: 'auto' },
                '&:hover': { bgcolor: 'text.primary' },
              }}
            >
              Excluir Usuário
            </Button>

            {editing && (
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
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
            )}
          </Stack>
        </Paper>
      </Stack>

      <DeleteConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default AccessControlSelectedUserForm;
