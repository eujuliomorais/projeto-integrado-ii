import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import SendIcon from '@mui/icons-material/Send';
import {
  Alert,
  Avatar,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

import {
  mapAssociateResponseToForm,
  mapFormToUpdatePayload,
} from '../services/associate/associate.mappers';

import type {
  AssociateCategoryResponse,
  AssociateProfileForm,
  IAssociateProfileForm,
} from '../services/associate/associate.types';

import {
  deleteAssociate,
  getAssociateById,
  getCategories,
  updateAssociate,
} from '../services/associate/associateService';

import {
  getCitiesByState,
  getStates,
  type City,
  type State,
} from '../services/address/ibgeService';
import { getAddressByCep } from '../services/address/viaCepService';
import { maskCEP, maskCPF, maskPhone } from '../utils/masks.util';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import InactivateAssociateDialog from './InactivateAssociateDialog';

const DARK_BTN = {
  bgcolor: '#5F5E5E',
  color: '#fff',
  borderRadius: 10,
  textTransform: 'none',
  fontWeight: 600,
  px: 2.5,
  '&:hover': {
    bgcolor: '#3E3D3D',
  },
} as const;

type Snack = {
  open: boolean;
  severity: 'success' | 'error';
  msg: string;
};

const EMPTY: IAssociateProfileForm = {
  id: '',
  fullName: '',
  cpf: '',
  email: '',
  phone: '',
  birthDate: '',
  category: '',
  addressZipCode: '',
  addressState: '',
  addressCity: '',
  addressNeighborhood: '',
  addressStreet: '',
  addressNumber: '',
  addressComplement: '',
  race: '',
  gender: '',
  sexualOrientation: '',
  education: '',
  income: '',
  disability: '',
  availableHours: '',
  guardianName: '',
  avatarUrl: '',
};

const AssociateProfile = () => {
  const { token } = useAuth();

  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<IAssociateProfileForm>(EMPTY);

  const [categories, setCategories] = useState<AssociateCategoryResponse[]>([]);

  const [inactivateOpen, setInactivateOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [snack, setSnack] = useState<Snack>({
    open: false,
    severity: 'success',
    msg: '',
  });

  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [errors, setErrors] = useState<
    Partial<Record<keyof AssociateProfileForm, string>>
  >({});

  const [originalForm, setOriginalForm] = useState<AssociateProfileForm>(EMPTY);

  const toast = (severity: 'success' | 'error', msg: string) =>
    setSnack({
      open: true,
      severity,
      msg,
    });

  useEffect(() => {
    const load = async () => {
      try {
        if (!token || !id) return;

        const res = await getAssociateById(token, id);

        const data = mapAssociateResponseToForm(res);

        setForm(data);
        setOriginalForm(data);
      } catch {
        toast('error', 'Erro ao carregar associado.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, token]);

  useEffect(() => {
    const loadStates = async () => {
      try {
        const data = await getStates();

        setStates(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadStates();
  }, []);

  useEffect(() => {
    const loadCities = async () => {
      if (!form.addressState) {
        setCities([]);
        return;
      }

      try {
        const data = await getCitiesByState(form.addressState);

        setCities(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadCities();
  }, [form.addressState]);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof AssociateProfileForm, string>> = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = 'Nome é obrigatório';
    }

    if (!form.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!form.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (form.cpf.replace(/\D/g, '').length !== 11) {
      newErrors.cpf = 'CPF inválido';
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (form.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Telefone inválido';
    }

    if (!form.addressZipCode.trim()) {
      newErrors.addressZipCode = 'CEP obrigatório';
    }

    if (!form.addressState) {
      newErrors.addressState = 'Estado obrigatório';
    }

    if (!form.addressCity) {
      newErrors.addressCity = 'Cidade obrigatória';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleCepBlur = async (zipCode: string) => {
    const cep = zipCode.replace('-', '');

    if (cep.length !== 8) return;

    try {
      const data = await getAddressByCep(cep);

      if (data.erro) return;

      setForm((prev) => ({
        ...prev,
        addressState: data.uf,
        addressCity: data.localidade,
        addressNeighborhood: data.bairro,
        addressStreet: data.logradouro,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!token) return;
    getCategories(token)
      .then((data) => setCategories(data))
      .catch(() => {});
  }, [token]);

  const handleSave = async () => {
    if (!validateForm()) {
      toast('error', 'Preencha os campos obrigatórios.');
      return;
    }

    try {
      if (!token || !id) return;

      setSaving(true);

      await updateAssociate(
        token,
        id,
        mapFormToUpdatePayload({
          ...form,
          cpf: form.cpf.replace(/\D/g, ''),
          phone: form.phone.replace(/\D/g, ''),
          addressZipCode: form.addressZipCode.replace(/\D/g, ''),
        })
      );

      setOriginalForm(form);
      setEditing(false);

      toast('success', 'Alterações salvas com sucesso!');
    } catch (err) {
      console.error(err);
      toast('error', 'Erro ao salvar alterações.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (!token || !id) return;

      await deleteAssociate(token, id);

      toast('success', 'Associado excluído com sucesso!');
      setTimeout(() => {
        navigate('/admin/associados');
      }, 1500);
    } catch {
      toast('error', 'Erro ao excluir associado.');
    }
  };

  const tf = (
    label: string,
    key: keyof IAssociateProfileForm,
    type = 'text'
  ) => (
    <TextField
      error={!!errors[key]}
      helperText={errors[key]}
      label={label}
      value={String(form[key] ?? '')}
      onChange={async (e) => {
        let value = e.target.value;

        if (key === 'addressZipCode') {
          value = maskCEP(value);
        }

        if (key === 'cpf') {
          value = maskCPF(value);
        }

        if (key === 'phone') {
          value = maskPhone(value);
        }

        if (key === 'addressNumber') {
          value = value.replace(/\D/g, '');
        }

        if (
          [
            'fullName',
            'socialName',
            'guardianName',
            'addressStreet',
            'addressNeighborhood',
            'addressCity',
          ].includes(key)
        ) {
          value = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
        }

        setForm((p) => ({
          ...p,
          [key]: value,
        }));
      }}
      onBlur={() => {
        if (key === 'addressZipCode') {
          handleCepBlur(form.addressZipCode);
        }
      }}
      disabled={!editing}
      type={type}
      size="small"
      fullWidth
      slotProps={{
        inputLabel: {
          shrink: true,
        },
      }}
    />
  );

  const sf = (
    label: string,
    key: keyof IAssociateProfileForm,
    options: {
      value: string;
      label: string;
    }[]
  ) => (
    <FormControl size="small" fullWidth>
      <InputLabel shrink>{label}</InputLabel>

      <Select
        error={!!errors[key]}
        value={String(form[key] ?? '')}
        label={label}
        notched
        disabled={!editing}
        onChange={(e) =>
          setForm((p) => ({
            ...p,
            [key]: e.target.value,
            ...(key === 'addressState' ? { addressCity: '' } : {}),
          }))
        }
      >
        {options.map((o) => (
          <MenuItem key={o.value} value={o.value}>
            {o.label}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{errors[key]}</FormHelperText>
    </FormControl>
  );

  if (loading) {
    return (
      <Stack
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          py: 10,
        }}
      >
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <>
      <Stack spacing={3}>
        <Button
          startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
          onClick={() => navigate('/admin/associados')}
          sx={{
            alignSelf: 'flex-start',
            color: 'text.secondary',
            fontWeight: 600,
            textTransform: 'none',
            p: 0,
            '&:hover': {
              bgcolor: 'transparent',
              color: 'primary.main',
            },
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
            p: {
              xs: 2,
              sm: 3,
            },
          }}
        >
          <Stack
            sx={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 3,
            }}
          >
            <Stack
              sx={{
                width: 120,
              }}
            />

            <Stack
              sx={{
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Avatar
                sx={{
                  width: {
                    xs: 100,
                    sm: 140,
                  },
                  height: {
                    xs: 100,
                    sm: 140,
                  },
                  bgcolor: 'primary.main',
                }}
              >
                <PersonOutlineIcon
                  sx={{
                    fontSize: {
                      xs: 64,
                      sm: 90,
                    },
                    color: '#ffffff',
                  }}
                />
              </Avatar>

              <Chip
                label="Ativo"
                size="small"
                color="success"
                sx={{
                  fontWeight: 700,
                  fontSize: 12,
                  borderRadius: 1,
                }}
              />
            </Stack>

            <Stack
              sx={{
                width: 120,
                alignItems: 'flex-end',
              }}
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
                    px: 2.5,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Editar Perfil
                </Button>
              )}
            </Stack>
          </Stack>

          {!editing && (
            <>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  mb: 1.5,
                  color: 'text.secondary',
                }}
              >
                Gerenciar Associado
              </Typography>

              <Stack
                sx={{
                  flexDirection: {
                    xs: 'column',
                    sm: 'row',
                  },
                  gap: 1.5,
                  mb: 3,
                  flexWrap: 'wrap',
                }}
              >
                <Button
                  startIcon={<DeleteOutlineIcon sx={{ fontSize: 16 }} />}
                  variant="contained"
                  onClick={() => setDeleteOpen(true)}
                  sx={DARK_BTN}
                >
                  Excluir Associado
                </Button>

                <Button
                  startIcon={<LinkOffIcon sx={{ fontSize: 16 }} />}
                  variant="contained"
                  onClick={() => setInactivateOpen(true)}
                  sx={DARK_BTN}
                >
                  Inativar Vínculo
                </Button>

                <Button
                  startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
                  variant="contained"
                  color="primary"
                  sx={{
                    borderRadius: 10,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 2.5,
                  }}
                >
                  Baixar Ficha Cadastral
                </Button>
              </Stack>

              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  mb: 1.5,
                  color: 'text.secondary',
                }}
              >
                Gerenciar Carteirinha
              </Typography>

              <Stack
                sx={{
                  flexDirection: {
                    xs: 'column',
                    sm: 'row',
                  },
                  gap: 1.5,
                  mb: 3,
                  flexWrap: 'wrap',
                }}
              >
                <Button
                  startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
                  variant="contained"
                  sx={DARK_BTN}
                >
                  Renovar Carteirinha
                </Button>

                <Button
                  startIcon={<SendIcon sx={{ fontSize: 16 }} />}
                  variant="contained"
                  sx={DARK_BTN}
                >
                  Enviar Carteirinha
                </Button>

                <Button
                  startIcon={<CreditCardOutlinedIcon sx={{ fontSize: 16 }} />}
                  variant="contained"
                  color="primary"
                  sx={{
                    borderRadius: 10,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 2.5,
                  }}
                >
                  Baixar Carteirinha
                </Button>
              </Stack>
            </>
          )}

          <Divider sx={{ mb: 3 }} />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            Dados Pessoais
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 5 }}>
              {tf('Nome Completo', 'fullName')}
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>{tf('CPF', 'cpf')}</Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              {tf('Data de Nascimento', 'birthDate', 'date')}
            </Grid>

            <Grid size={{ xs: 12, sm: 8 }}>
              {tf('E-mail', 'email', 'email')}
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>{tf('Telefone', 'phone')}</Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            Dados de Endereço
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 2 }}>{tf('CEP', 'addressZipCode')}</Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              {sf(
                'Estado',
                'addressState',
                states.map((state) => ({
                  value: state.sigla,
                  label: state.nome,
                }))
              )}
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              {sf(
                'Cidade',
                'addressCity',
                cities.map((city) => ({
                  value: city.nome,
                  label: city.nome,
                }))
              )}
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              {tf('Bairro', 'addressNeighborhood')}
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              {tf('Logradouro', 'addressStreet')}
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              {tf('Complemento', 'addressNumber')}
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            Dados Institucionais
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              {sf(
                'Categoria',
                'category',
                categories.map((c) => ({ value: c.id, label: c.name }))
              )}
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {editing && (
            <Stack
              sx={{
                flexDirection: {
                  xs: 'column',
                  sm: 'row',
                },
                gap: 2,
                justifyContent: 'flex-end',
                mt: 4,
              }}
            >
              <Button
                variant="contained"
                onClick={() => {
                  setForm(originalForm);
                  setErrors({});
                  setEditing(false);
                }}
                sx={{
                  bgcolor: 'grey.300',
                  color: 'text.primary',
                  fontWeight: 700,
                  borderRadius: 10,
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  boxShadow: 'none',
                  width: {
                    xs: '100%',
                    sm: 'auto',
                  },
                  '&:hover': {
                    bgcolor: 'grey.400',
                    boxShadow: 'none',
                  },
                }}
              >
                Cancelar
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={saving}
                sx={{
                  fontWeight: 700,
                  borderRadius: 10,
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  width: {
                    xs: '100%',
                    sm: 'auto',
                  },
                }}
              >
                {saving ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  'Salvar Alterações'
                )}
              </Button>
            </Stack>
          )}
        </Paper>
      </Stack>

      <InactivateAssociateDialog
        open={inactivateOpen}
        onClose={() => setInactivateOpen(false)}
        onConfirm={async () => {}}
        associateName={form.fullName}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Confirmar Exclusão de Associado"
        description="Tem certeza que deseja excluir este associado? Todos os dados serão removidos permanentemente do sistema."
        confirmLabel="Sim, Excluir Associado"
      />

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
    </>
  );
};

export default AssociateProfile;
