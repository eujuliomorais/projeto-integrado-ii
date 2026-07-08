import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import SendIcon from '@mui/icons-material/Send';

import {
  Alert,
  Avatar,
  Backdrop,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { decodeJwt } from '../services/auth/jwt.config';

import {
  mapAssociateResponseToForm,
  mapFormToUpdatePayload,
} from '../services/associate/associate.mappers';

import type {
  AssociateCategoryResponse,
  IAdminAssociateProfileForm,
} from '../services/associate/associate.types';

import axios from 'axios';
import {
  getCitiesByState,
  getStates,
  type City,
  type State,
} from '../services/address/ibgeService';
import { renovateAssociateCard } from '../services/admin/adminService';
import { api_base_url } from '../services/api';
import {
  deleteAssociate,
  getAssociateById,
  getAssociateRegistrationForm,
  getCategories,
  updateAssociate,
} from '../services/associate/associateService';
import { downloadCardById, sendCardEmailById } from '../services/cardService';
import { isValidBirthDate } from '../utils/dates.util';
import { maskCEP, maskCPF, maskIncome, maskPhone } from '../utils/masks.util';
import DeleteConfirmDialog from './DeleteConfirmDialog';

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

const EMPTY: IAdminAssociateProfileForm = {
  id: '',
  fullName: '',
  cpf: '',
  email: '',
  phone: '',
  birthDate: '',
  category: '',
  guardianName: '',
  availableHours: '',
  addressZipCode: '',
  addressState: '',
  addressCity: '',
  addressNeighborhood: '',
  addressStreet: '',
  addressNumber: '',
  addressComplement: '',
  avatarUrl: '',
};

const AssociateProfile = () => {
  const { token } = useAuth();

  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<IAdminAssociateProfileForm>(EMPTY);

  const [categories, setCategories] = useState<AssociateCategoryResponse[]>([]);

  const [sendingCard, setSendingCard] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  // Overlay de confirmação de dados para renovação de carteirinha
  const [renovateOpen, setRenovateOpen] = useState(false);
  const [renovateSaving, setRenovateSaving] = useState(false);

  const [originalForm, setOriginalForm] =
    useState<IAdminAssociateProfileForm>(EMPTY);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [declaratoryData, setDeclaratoryData] = useState({
    education: '',
    income: '',
    race: '',
    gender: '',
    sexualOrientation: '',
    socialName: '',
  });

  const isUnder18 = (() => {
    if (!form.birthDate) return false;

    const today = new Date();

    const birth = new Date(form.birthDate);

    let age = today.getFullYear() - birth.getFullYear();

    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age < 18;
  })();
  const [isActive, setIsActive] = useState<boolean>();

  const [errors, setErrors] = useState<
    Partial<Record<keyof IAdminAssociateProfileForm, string>>
  >({});

  const [snack, setSnack] = useState<Snack>({
    open: false,
    severity: 'success',
    msg: '',
  });

  const toast = (severity: 'success' | 'error', msg: string) =>
    setSnack({
      open: true,
      severity,
      msg,
    });

  const user = token ? decodeJwt(token) : null;
  const canEdit = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  useEffect(() => {
    const load = async () => {
      try {
        if (!token || !id) return;

        const res = await getAssociateById(token, id);

        setIsActive(res.user?.active ?? false);

        const data = mapAssociateResponseToForm(res);

        setForm(data);
        setOriginalForm(data);

        setDeclaratoryData({
          education:
            res.selfDeclaration?.education === 'NÃO_SELECIONADO'
              ? ''
              : (res.selfDeclaration?.education ?? ''),
          income: res.selfDeclaration?.income?.toString() ?? '',
          race: res.selfDeclaration?.race ?? '',
          gender: res.selfDeclaration?.gender ?? '',
          sexualOrientation: res.selfDeclaration?.sexualOrientation ?? '',
          socialName: res.selfDeclaration?.socialName ?? '',
        });
      } catch {
        toast('error', 'Erro ao carregar associado.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, token]);

  useEffect(() => {
    if (!token) return;
    getCategories(token)
      .then((data) => setCategories(data))
      .catch(() => {});
  }, [token]);

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
    const newErrors: Partial<Record<keyof IAdminAssociateProfileForm, string>> =
      {};

    if (!form.fullName.trim()) {
      newErrors.fullName = 'Nome é obrigatório';
    }

    if (isUnder18) {
      if (!form.guardianName?.trim()) {
        newErrors.guardianName = 'Responsável legal é obrigatório';
      }
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

    if (!form.addressStreet) {
      newErrors.addressStreet = 'Rua obrigatória';
    }

    if (!form.addressCity) {
      newErrors.addressCity = 'Cidade obrigatória';
    }

    if (!form.addressNeighborhood) {
      newErrors.addressNeighborhood = 'Bairro obrigatório';
    }

    if (!form.addressNumber) {
      newErrors.addressNumber = 'Número obrigatório';
    }

    if (!form.category) {
      newErrors.category = 'Categoria obrigatória';
    }

    if (!form.availableHours) {
      newErrors.availableHours = 'Disponibilidade obrigatória';
    }

    if (!form.birthDate) {
      newErrors.birthDate = 'Data de nascimento obrigatória';
    } else if (!isValidBirthDate(form.birthDate)) {
      newErrors.birthDate = 'Data inválida';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleDownloadRegistrationForm = async () => {
    if (!token || !originalForm.id) {
      toast(
        'error',
        'Não foi possível validar suas informações, tente fazer login novamente.'
      );
      return;
    }

    try {
      const pdfBlob = await getAssociateRegistrationForm(
        token,
        originalForm.id
      );

      const url = window.URL.createObjectURL(pdfBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `ficha-cadastral-${originalForm.id}.pdf`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      toast('success', 'Ficha baixada com sucesso.');
    } catch {
      toast(
        'error',
        'Não foi possível gerar a ficha devido a um erro no servidor.'
      );
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (!token || !id) return;

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

      setEditing(false);

      setOriginalForm(form);

      toast('success', 'Alterações salvas com sucesso!');
    } catch {
      setForm(originalForm);
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
    key: keyof IAdminAssociateProfileForm,
    type = 'text',
    forceEnabled?: boolean
  ) => {
    const applyMask = (value: string, fieldKey: string) => {
      const v = String(value ?? '').replace(/\D/g, '');
      if (fieldKey === 'cpf') {
        return maskCPF(v);
      }
      if (fieldKey === 'addressZipCode') {
        return maskCEP(v);
      }
      if (fieldKey === 'phone') {
        return maskPhone(v);
      }
      if (fieldKey === 'addressNumber') {
        return v.slice(0, 10);
      }
      if (
        [
          'fullName',
          'socialName',
          'guardianName',
          'addressStreet',
          'addressNeighborhood',
          'addressCity',
        ].includes(fieldKey)
      ) {
        return value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
      }
      return value;
    };

    const getMaxLength = (fieldKey: string) => {
      if (fieldKey === 'cpf') return 14;
      if (fieldKey === 'addressZipCode') return 9;
      if (fieldKey === 'phone') return 15;
      if (fieldKey === 'addressNumber') return 10;
      return undefined;
    };

    const isEnabled = forceEnabled ?? editing;

    return (
      <TextField
        label={label}
        value={applyMask(form[key] ?? '', key)}
        error={!!errors[key]}
        helperText={errors[key]}
        onChange={(e) => {
          const masked = applyMask(e.target.value, key);

          setForm((p) => ({
            ...p,
            [key]: masked,
          }));

          setErrors((prev) => ({
            ...prev,
            [key]: undefined,
          }));
        }}
        disabled={!isEnabled}
        type={type}
        size="small"
        fullWidth
        slotProps={{
          inputLabel: {
            shrink: true,
          },
          htmlInput: {
            maxLength: getMaxLength(key),
            inputMode: [
              'cpf',
              'addressZipCode',
              'phone',
              'addressNumber',
            ].includes(key)
              ? 'numeric'
              : 'text',
          },
        }}
        onKeyDown={(e) => {
          if (
            ['cpf', 'addressZipCode', 'phone', 'addressNumber'].includes(
              key as string
            )
          ) {
            if (
              e.key.length === 1 &&
              !/[0-9]/.test(e.key) &&
              !e.ctrlKey &&
              !e.metaKey
            ) {
              e.preventDefault();
            }
          }
        }}
      />
    );
  };

  const sf = (
    label: string,
    key: keyof IAdminAssociateProfileForm,
    options: {
      value: string;
      label: string;
    }[],
    forceEnabled?: boolean
  ) => {
    const isEnabled = forceEnabled ?? editing;

    return (
      <FormControl size="small" fullWidth error={!!errors[key]}>
        <InputLabel shrink>{label}</InputLabel>

        <Select
          value={String(form[key] ?? '')}
          label={label}
          notched
          disabled={!isEnabled}
          onChange={(e) => {
            setForm((p) => ({
              ...p,
              [key]: e.target.value,
              ...(key === 'addressState' ? { addressCity: '' } : {}),
            }));

            setErrors((prev) => ({
              ...prev,
              [key]: undefined,
              ...(key === 'addressState' ? { addressCity: undefined } : {}),
            }));
          }}
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
  };

  const sdf = (
    label: string,
    key: keyof typeof declaratoryData,
    options: {
      value: string;
      label: string;
    }[]
  ) => (
    <FormControl size="small" fullWidth>
      <InputLabel shrink>{label}</InputLabel>

      <Select
        value={String(declaratoryData[key] ?? '')}
        label={label}
        notched
        disabled
      >
        {options.map((o) => (
          <MenuItem key={o.value} value={o.value}>
            {o.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  // ---- Blocos de campos reutilizados entre a view normal e o dialog de renovação ----

  const renderPersonalDataFields = (forceEnabled?: boolean) => (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid size={{ xs: 12, sm: 5 }}>
        {tf('Nome Completo', 'fullName', 'text', forceEnabled)}
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        {tf('CPF', 'cpf', 'text', forceEnabled)}
      </Grid>

      <Grid size={{ xs: 12, sm: 3 }}>
        {tf('Data de Nascimento', 'birthDate', 'date', forceEnabled)}
      </Grid>

      {isUnder18 && (
        <Grid size={{ xs: 12, sm: 8 }}>
          {tf('Nome do Responsável', 'guardianName', 'text', forceEnabled)}
        </Grid>
      )}

      <Grid size={{ xs: 12, sm: 8 }}>
        {tf('E-mail', 'email', 'email', forceEnabled)}
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        {tf('Telefone', 'phone', 'text', forceEnabled)}
      </Grid>
    </Grid>
  );

  const renderAddressFields = (forceEnabled?: boolean) => (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid size={{ xs: 12, sm: 2 }}>
        {tf('CEP', 'addressZipCode', 'text', forceEnabled)}
      </Grid>

      <Grid size={{ xs: 12, sm: 3 }}>
        {sf(
          'Estado',
          'addressState',
          states.map((state) => ({
            value: state.sigla,
            label: state.nome,
          })),
          forceEnabled
        )}
      </Grid>

      <Grid size={{ xs: 12, sm: 3 }}>
        {sf(
          'Cidade',
          'addressCity',
          cities.map((city) => ({
            value: city.nome,
            label: city.nome,
          })),
          forceEnabled
        )}
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        {tf('Bairro', 'addressNeighborhood', 'text', forceEnabled)}
      </Grid>

      <Grid size={{ xs: 12, sm: 5 }}>
        {tf('Rua', 'addressStreet', 'text', forceEnabled)}
      </Grid>

      <Grid size={{ xs: 12, sm: 2 }}>
        {tf('Número', 'addressNumber', 'text', forceEnabled)}
      </Grid>

      <Grid size={{ xs: 12, sm: 5 }}>
        {tf('Complemento', 'addressComplement', 'text', forceEnabled)}
      </Grid>
    </Grid>
  );

  const renderInstitutionalFields = (forceEnabled?: boolean) => (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid size={{ xs: 12, sm: 4 }}>
        {sf(
          'Disponibilidade de Horário',
          'availableHours',
          [
            { value: 'MATUTINO', label: 'Matutino' },
            { value: 'VESPERTINO', label: 'Vespertino' },
            { value: 'NOTURNO', label: 'Noturno' },
            { value: 'TODOS', label: 'Todos os turnos' },
          ],
          forceEnabled
        )}
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        {sf(
          'Categoria',
          'category',
          [...categories.map((c) => ({ value: c.id, label: c.name }))],
          forceEnabled
        )}
      </Grid>
    </Grid>
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

  const handleDownloadCard = async () => {
    if (!token || !originalForm.id) {
      toast(
        'error',
        'Não foi possível validar suas informações, tente fazer login novamente.'
      );
      return;
    }

    try {
      const pdfBlob = await downloadCardById(originalForm.id, token);

      const url = window.URL.createObjectURL(pdfBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `carteirinha-${originalForm.id}.pdf`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      toast('success', 'Carteirinha baixada com sucesso.');
    } catch (error) {
      let strError = 'Erro desconhecido ao baixar carteirinha';
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
        strError =
          'Não foi possível baixar devido a um erro do servidor, tente novamente.';
      }
      toast('error', strError);
    }
  };

  const handleSendCard = async () => {
    if (!token || !originalForm.id) {
      toast(
        'error',
        'Não foi possível validar suas informações, tente fazer login novamente.'
      );
      return;
    }

    try {
      setSendingCard(true);

      await sendCardEmailById(originalForm.id, token);

      toast('success', 'Carteirinha enviada com sucesso.');
    } catch (error) {
      let strError = '';

      if (axios.isAxiosError(error)) {
        strError = error.response?.data?.message ?? error.message;
      } else if (error instanceof Error) {
        strError =
          'Não foi possível enviar devido a um erro do servidor, tente novamente.';
      } else {
        strError = 'Erro desconhecido';
      }

      toast('error', strError);
    } finally {
      setSendingCard(false);
    }
  };

  const handleOpenRenovateConfirm = () => {
    setErrors({});
    setRenovateOpen(true);
  };

  const handleCancelRenovateConfirm = () => {
    setForm(originalForm);
    setErrors({});
    setRenovateOpen(false);
  };

  const handleConfirmRenovate = async () => {
    if (!validateForm()) {
      return;
    }

    if (!token || !id) {
      toast(
        'error',
        'Não foi possível validar suas informações, tente fazer login novamente.'
      );
      return;
    }

    try {
      setRenovateSaving(true);

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

      await renovateAssociateCard(id, token);

      toast('success', 'Dados atualizados e carteirinha renovada com sucesso!');

      setRenovateOpen(false);
    } catch (error) {
      let strError = '';

      if (axios.isAxiosError(error)) {
        strError = error.response?.data?.message ?? error.message;
      } else if (error instanceof Error) {
        strError =
          'Não foi possível concluir a renovação devido a um erro no servidor, tente novamente.';
      } else {
        strError = 'Erro desconhecido';
      }

      toast('error', strError);
    } finally {
      setRenovateSaving(false);
    }
  };

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
                src={
                  form.avatarUrl
                    ? `${api_base_url}${form.avatarUrl}`
                    : undefined
                }
                sx={{
                  width: { xs: 100, sm: 140 },
                  height: { xs: 100, sm: 140 },
                  bgcolor: 'primary.main',
                }}
              >
                <PersonOutlineIcon
                  sx={{ fontSize: { xs: 64, sm: 90 }, color: '#ffffff' }}
                />
              </Avatar>

              <Chip
                label={isActive ? 'Ativo' : 'Inativo'}
                sx={{
                  bgcolor: isActive ? '#8FA882' : '#9E9E9E',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 13,
                  height: 26,
                  width: 80,
                }}
              />
            </Stack>

            <Stack
              sx={{
                width: 120,
                alignItems: 'flex-end',
              }}
            >
              {!editing && canEdit && (
                <Button
                  startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setErrors({});
                    setEditing(true);
                  }}
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

          {!editing && canEdit && (
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
                  startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
                  variant="contained"
                  color="primary"
                  onClick={handleDownloadRegistrationForm}
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
                  onClick={handleOpenRenovateConfirm}
                >
                  Renovar Carteirinha
                </Button>

                <Button
                  startIcon={
                    sendingCard ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <SendIcon sx={{ fontSize: 16 }} />
                    )
                  }
                  variant="contained"
                  sx={DARK_BTN}
                  onClick={handleSendCard}
                  disabled={sendingCard}
                >
                  {sendingCard ? 'Enviando...' : 'Enviar Carteirinha'}
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
                  onClick={handleDownloadCard}
                >
                  Baixar Carteirinha
                </Button>
              </Stack>
            </>
          )}

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Dados Pessoais
          </Typography>

          {renderPersonalDataFields()}

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Dados de Endereço
          </Typography>

          {renderAddressFields()}

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Dados Institucionais
          </Typography>

          {renderInstitutionalFields()}

          {!editing && (
            <>
              <Divider sx={{ mb: 3 }} />

              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Dados Autodeclaratórios
              </Typography>

              <Grid container spacing={2} sx={{ mb: 1 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Nome social"
                    value={declaratoryData.socialName}
                    disabled
                    size="small"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  {sdf('Escolaridade', 'education', [
                    { value: '', label: 'Selecione' },
                    {
                      value: 'FUNDAMENTAL_INCOMPLETO',
                      label: 'Fundamental Incompleto',
                    },
                    {
                      value: 'FUNDAMENTAL_COMPLETO',
                      label: 'Fundamental Completo',
                    },
                    { value: 'MEDIO_INCOMPLETO', label: 'Médio Incompleto' },
                    { value: 'MEDIO_COMPLETO', label: 'Médio Completo' },
                    {
                      value: 'SUPERIOR_INCOMPLETO',
                      label: 'Superior Incompleto',
                    },
                    { value: 'SUPERIOR_COMPLETO', label: 'Superior Completo' },
                    {
                      value: 'ESPECIALIZACAO_INCOMPLETA',
                      label: 'Espec. Incompleta',
                    },
                    {
                      value: 'ESPECIALIZACAO_COMPLETA',
                      label: 'Espec. Completa',
                    },
                    {
                      value: 'MESTRADO_INCOMPLETO',
                      label: 'Mestrado Incompleto',
                    },
                    { value: 'MESTRADO_COMPLETO', label: 'Mestrado Completo' },
                    {
                      value: 'DOUTORADO_INCOMPLETO',
                      label: 'Doutorado Incompleto',
                    },
                    {
                      value: 'DOUTORADO_COMPLETO',
                      label: 'Doutorado Completo',
                    },
                    {
                      value: 'NÃO_SELECIONADO',
                      label: 'Prefiro não informar',
                    },
                  ])}
                </Grid>

                <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField
                    label="Renda Pessoal"
                    value={maskIncome(declaratoryData.income)}
                    disabled
                    size="small"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 2 }}>
                  {sdf('Etnia', 'race', [
                    { value: '', label: 'Selecione' },
                    { value: 'BRANCO', label: 'Branco (a)' },
                    { value: 'PARDO', label: 'Pardo (a)' },
                    { value: 'PRETO', label: 'Preto (a)' },
                    { value: 'AMARELO', label: 'Amarelo (a)' },
                    { value: 'INDIGENA', label: 'Indígena' },
                    { value: 'QUILOMBOLA', label: 'Quilombola' },
                    {
                      value: 'PREFIRO_NAO_INFORMAR',
                      label: 'Prefiro não informar',
                    },
                  ])}
                </Grid>

                <Grid size={{ xs: 12, sm: 2 }}>
                  {sdf('Identidade de Gênero', 'gender', [
                    { value: '', label: 'Selecione' },
                    { value: 'HOMEM_CIS', label: 'Homem Cis' },
                    { value: 'HOMEM_TRANS', label: 'Homem Trans' },
                    { value: 'MULHER_CIS', label: 'Mulher Cis' },
                    { value: 'MULHER_TRANS', label: 'Mulher Trans' },
                    { value: 'NAO_BINARIO', label: 'Não Binário' },
                    { value: 'GENERO_FLUIDO', label: 'Gênero Fluído' },
                    { value: 'OUTRO', label: 'Outro' },
                    {
                      value: 'PREFIRO_NAO_INFORMAR',
                      label: 'Prefiro não informar',
                    },
                  ])}
                </Grid>

                <Grid size={{ xs: 12, sm: 2 }}>
                  {sdf('Orientação Sexual', 'sexualOrientation', [
                    { value: '', label: 'Selecione' },
                    { value: 'HETEROSSEXUAL', label: 'Heterossexual' },
                    { value: 'HOMOSSEXUAL', label: 'Homossexual' },
                    { value: 'BISSEXUAL', label: 'Bissexual' },
                    { value: 'NAO_SEI', label: 'Não sei' },
                    { value: 'OUTRO', label: 'Outro' },
                    {
                      value: 'PREFIRO_NAO_INFORMAR',
                      label: 'Prefiro não informar',
                    },
                    ...(![
                      '',
                      'HETEROSSEXUAL',
                      'HOMOSSEXUAL',
                      'BISSEXUAL',
                      'NAO_SEI',
                      'OUTRO',
                      'PREFIRO_NAO_INFORMAR',
                    ].includes(declaratoryData.sexualOrientation)
                      ? [
                          {
                            value: declaratoryData.sexualOrientation,
                            label: declaratoryData.sexualOrientation,
                          },
                        ]
                      : []),
                  ])}
                </Grid>
              </Grid>
            </>
          )}

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

      <DeleteConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Confirmar Exclusão de Associado"
        description="Tem certeza que deseja excluir este associado? Todos os dados serão removidos permanentemente do sistema."
        confirmLabel="Sim, Excluir Associado"
      />

      {/* Overlay de confirmação de dados antes da renovação da carteirinha */}
      <Dialog
        open={renovateOpen}
        onClose={renovateSaving ? undefined : handleCancelRenovateConfirm}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Confirme os dados do associado para prosseguir com a renovação
        </DialogTitle>

        <DialogContent dividers>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
            Dados Pessoais
          </Typography>

          {renderPersonalDataFields(true)}

          <Divider sx={{ mb: 3 }} />

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
            Dados de Endereço
          </Typography>

          {renderAddressFields(true)}

          <Divider sx={{ mb: 3 }} />

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
            Dados Institucionais
          </Typography>

          {renderInstitutionalFields(true)}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            variant="contained"
            onClick={handleCancelRenovateConfirm}
            disabled={renovateSaving}
            sx={{
              bgcolor: 'grey.300',
              color: 'text.primary',
              fontWeight: 700,
              borderRadius: 10,
              textTransform: 'none',
              px: 4,
              py: 1.2,
              boxShadow: 'none',
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
            onClick={handleConfirmRenovate}
            disabled={renovateSaving}
            sx={{
              fontWeight: 700,
              borderRadius: 10,
              textTransform: 'none',
              px: 4,
              py: 1.2,
            }}
          >
            {renovateSaving ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Confirmar Dados'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop
        open={sendingCard}
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Stack sx={{ alignItems: 'center' }} spacing={2}>
          <CircularProgress color="inherit" />
          <Typography>Enviando carteirinha...</Typography>
        </Stack>
      </Backdrop>

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
