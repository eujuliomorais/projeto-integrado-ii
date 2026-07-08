import EditIcon from '@mui/icons-material/Edit';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api_base_url } from '../services/api';
import type { AssociateEducation } from '../services/associate/associate.types';
import {
  getMyAssociate,
  updateMySelfDeclaration,
} from '../services/associate/associateService';
import { updateAvatar } from '../services/user/imageService';
import { maskCEP } from '../utils/masks.util';

interface SelfDeclForm {
  education: string;
  income: string;
  race: string;
  gender: string;
  sexualOrientation: string;
  otherSexualOrientation?: string;
  dataSharing: boolean;
  socialName: string;
}

interface ProfileForm {
  fullName: string;
  cpf: string;
  birthDate: string;
  email: string;
  phone: string;
  addressZipCode: string;
  addressState: string;
  addressCity: string;
  addressNeighborhood: string;
  addressStreet: string;
  addressNumber: string;
  addressComplement: string;
  category: string;
  availableHours: string;
  status: string;
  avatarUrl: string;
}

const BR_STATES = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];

const EMPTY_SELF_DECL: SelfDeclForm = {
  education: '',
  income: '',
  race: '',
  gender: '',
  sexualOrientation: '',
  otherSexualOrientation: '',
  dataSharing: false,
  socialName: '',
};

const EMPTY_PROFILE: ProfileForm = {
  fullName: '',
  cpf: '',
  birthDate: '',
  email: '',
  phone: '',
  addressZipCode: '',
  addressState: '',
  addressCity: '',
  addressNeighborhood: '',
  addressStreet: '',
  addressNumber: '',
  addressComplement: '',
  category: '',
  availableHours: '',
  status: '',
  avatarUrl: '',
};

type Snack = { open: boolean; severity: 'success' | 'error'; msg: string };

const maskCurrency = (v: string) => {
  const digits = v.replace(/\D/g, '');
  const num = Number(digits) / 100;
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatCPF = (cpf: string) => {
  if (!cpf) return '';
  const digits = cpf.replace(/\D/g, '');
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatPhone = (phone: string) => {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
};

const AssociateSelfSupplementForm = () => {
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [editingDecl, setEditingDecl] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selfDecl, setSelfDecl] = useState<SelfDeclForm>(EMPTY_SELF_DECL);
  const [selfDeclDraft, setSelfDeclDraft] =
    useState<SelfDeclForm>(EMPTY_SELF_DECL);
  const [profile, setProfile] = useState<ProfileForm>(EMPTY_PROFILE);
  const [snack, setSnack] = useState<Snack>({
    open: false,
    severity: 'success',
    msg: '',
  });

  const [userId, setUserId] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const toast = (severity: 'success' | 'error', msg: string) =>
    setSnack({ open: true, severity, msg });

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        const data = await getMyAssociate(token);
        const decl: SelfDeclForm = {
          education:
            data.selfDeclaration?.education === 'NÃO_SELECIONADO'
              ? ''
              : (data.selfDeclaration?.education ?? ''),
          income:
            data.selfDeclaration?.income != null
              ? data.selfDeclaration.income.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })
              : '',
          race: data.selfDeclaration?.race ?? '',
          gender: data.selfDeclaration?.gender ?? '',
          sexualOrientation: 
            !data.selfDeclaration?.sexualOrientation || ['HETEROSSEXUAL', 'HOMOSSEXUAL', 'BISSEXUAL', 'NAO_SEI', 'PREFIRO_NAO_INFORMAR'].includes(data.selfDeclaration.sexualOrientation)
              ? (data.selfDeclaration?.sexualOrientation ?? '')
              : 'OUTRO',
          otherSexualOrientation: 
            !data.selfDeclaration?.sexualOrientation || ['HETEROSSEXUAL', 'HOMOSSEXUAL', 'BISSEXUAL', 'NAO_SEI', 'PREFIRO_NAO_INFORMAR'].includes(data.selfDeclaration.sexualOrientation)
              ? ''
              : data.selfDeclaration.sexualOrientation,
          dataSharing: data.selfDeclaration?.acceptedDataSharingTerm ?? false,
          socialName: data.selfDeclaration?.socialName ?? '',
        };

        setSelfDecl(decl);
        setSelfDeclDraft(decl);
        setUserId(data.user.id);
        setProfile({
          fullName: data.user.name ?? '',
          cpf: data.cpf ?? '',
          birthDate: data.birthDate ?? '',
          email: data.user.email ?? '',
          phone: data.phone ?? '',
          addressZipCode: data.address?.postalCode ?? '',
          addressState: data.address?.state ?? '',
          addressCity: data.address?.city ?? '',
          addressNeighborhood: data.address?.neighborhood ?? '',
          addressStreet: data.address?.street ?? '',
          addressNumber: data.address?.number ?? '',
          addressComplement: data.address?.complement ?? '',
          category: data.workCategory?.name ?? '',
          availableHours: data.availableHours ?? '',
          status: data.user?.active ? 'Ativo' : 'Inativo',
          avatarUrl: data.user.avatarUrl ?? '',
        });
      } catch {
        toast('error', 'Erro ao carregar dados.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const handleCancelDecl = () => {
    setSelfDeclDraft({ ...selfDecl });
    setEditingDecl(false);
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleSaveDecl = async () => {
    setSaving(true);
    const mapVal = (v: string) => (!v ? '' : v);

    const parsedIncome = (() => {
      const raw = selfDeclDraft.income;
      if (!raw || raw === 'PREFIRO_NAO_INFORMAR') return null;
      const digits = raw.replace(/\D/g, '');
      return digits ? Number(digits) / 100 : null;
    })();

    if (!token) return;

    try {
      await updateMySelfDeclaration(token, {
        race: mapVal(selfDeclDraft.race),
        gender: mapVal(selfDeclDraft.gender),
        sexualOrientation: mapVal(selfDeclDraft.sexualOrientation === 'OUTRO' ? (selfDeclDraft.otherSexualOrientation || 'OUTRO') : selfDeclDraft.sexualOrientation),
        education: (selfDeclDraft.education === '' ||
        selfDeclDraft.education === 'NÃO_SELECIONADO'
          ? ''
          : selfDeclDraft.education) as AssociateEducation,
        income: parsedIncome,
        acceptedDataSharingTerm: selfDeclDraft.dataSharing,
        socialName: selfDeclDraft.socialName,
      });

      let newAvatarUrl = profile.avatarUrl;
      if (avatarFile && userId) {
        const uploadedUrl = await updateAvatar({
          token,
          id: userId,
          file: avatarFile,
        });
        if (uploadedUrl) {
          newAvatarUrl = uploadedUrl;
        }
      }

      setSelfDecl({ ...selfDeclDraft });
      setProfile((prev) => ({ ...prev, avatarUrl: newAvatarUrl }));
      setEditingDecl(false);
      setAvatarFile(null);
      setAvatarPreview(null);

      toast('success', 'Dados salvos com sucesso!');
    } catch {
      toast('error', 'Erro ao salvar dados.');
    } finally {
      setSaving(false);
    }
  };

  const declSelect = (
    label: string,
    key: keyof SelfDeclForm,
    options: { value: string; label: string }[],
    clearable = true
  ) => (
    <FormControl size="small" fullWidth>
      <InputLabel
        shrink
        sx={{ color: editingDecl ? 'primary.main' : undefined }}
      >
        {label}
      </InputLabel>
      <Select
        value={selfDeclDraft[key]}
        label={label}
        notched
        disabled={!editingDecl}
        onChange={(e) =>
          setSelfDeclDraft((p) => ({ ...p, [key]: e.target.value }))
        }
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: editingDecl ? 'primary.main' : undefined,
          },
        }}
        displayEmpty
        renderValue={(v) =>
          v === '' ? (
            <span style={{ color: '#9e9e9e' }}>Selecione</span>
          ) : (
            (options.find((o) => o.value === v)?.label ?? String(v))
          )
        }
      >
        <MenuItem value="" disabled={!clearable}>
          <em>Selecione</em>
        </MenuItem>
        {options.map((o) => (
          <MenuItem key={o.value} value={o.value}>
            {o.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const rendaField = (
    <TextField
      label="Renda Pessoal"
      value={selfDeclDraft.income}
      onChange={(e) => {
        if (!editingDecl) return;
        const masked = maskCurrency(e.target.value);
        e.target.value = masked;
        setSelfDeclDraft((p) => ({
          ...p,
          income: masked,
        }));
      }}
      disabled={!editingDecl}
      size="small"
      fullWidth
      slotProps={{
        inputLabel: {
          shrink: true,
          sx: { color: editingDecl ? 'primary.main' : undefined },
        },
        input: {
          sx: {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: editingDecl ? 'primary.main' : undefined,
            },
          },
        },
        htmlInput: {
          maxLength: 16, // ? 16 counting the special caracters that does not goes to backend, yk?
          inputMode: 'numeric',
        },
      }}
    />
  );

  const ptf = (label: string, value: string, type = 'text') => (
    <TextField
      label={label}
      value={value}
      disabled
      type={type}
      size="small"
      fullWidth
      slotProps={{ inputLabel: { shrink: true } }}
    />
  );

  const nomeSocialField = (
    <TextField
      label="Nome Social"
      value={selfDeclDraft.socialName}
      onChange={(e) =>
        setSelfDeclDraft((prev) => ({
          ...prev,
          socialName: e.target.value,
        }))
      }
      disabled={!editingDecl}
      size="small"
      fullWidth
      slotProps={{
        inputLabel: {
          shrink: true,
          sx: { color: editingDecl ? 'primary.main' : undefined },
        },
        input: {
          sx: {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: editingDecl ? 'primary.main' : undefined,
            },
          },
        },
      }}
    />
  );

  if (loading) {
    return (
      <Stack sx={{ alignItems: 'center', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <>
      <Stack spacing={4}>
        <Stack sx={{ alignItems: 'center' }}>
          <Box sx={{ position: 'relative', width: 'fit-content' }}>
            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
            />

            <Avatar
              src={
                avatarPreview ||
                (profile.avatarUrl
                  ? `${api_base_url}${profile.avatarUrl}`
                  : undefined)
              }
              sx={{
                width: { xs: 120, sm: 160 },
                height: { xs: 120, sm: 160 },
                bgcolor: 'primary.main',
              }}
            >
              <PersonOutlineIcon
                sx={{ fontSize: { xs: 80, sm: 110 }, color: '#ffffff' }}
              />
            </Avatar>

            {editingDecl && (
              <IconButton
                size="small"
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  position: 'absolute',
                  bottom: 4,
                  right: 4,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  width: 32,
                  height: 32,
                  '&:hover': { bgcolor: 'grey.100' },
                }}
              >
                <EditIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              </IconButton>
            )}
          </Box>

          <Typography variant="h6" sx={{ mt: 1, fontWeight: 700 }}>
            {profile.fullName || '—'}
          </Typography>

          {profile.status && (
            <Box sx={{ mt: 0.5 }}>
              <Chip
                label={profile.status}
                sx={{
                  bgcolor: profile.status === 'Ativo' ? '#8FA882' : '#9E9E9E',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 13,
                  height: 26,
                  width: 80,
                }}
              />
            </Box>
          )}
        </Stack>

        {/* Dados Pessoais */}
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Dados Pessoais
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 5 }}>
              {ptf('Nome Completo', profile.fullName)}
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              {ptf('CPF', formatCPF(profile.cpf))}
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              {ptf('Data de Nascimento', profile.birthDate, 'date')}
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>{ptf('E-mail', profile.email)}</Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              {ptf('Telefone', formatPhone(profile.phone))}
            </Grid>
          </Grid>
        </Stack>

        {/* Endereço */}
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Endereço
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 2 }}>
              {ptf('CEP', maskCEP(profile.addressZipCode))}
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControl size="small" fullWidth>
                <InputLabel shrink>Estado</InputLabel>
                <Select
                  value={profile.addressState}
                  label="Estado"
                  notched
                  disabled
                >
                  {BR_STATES.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              {ptf('Cidade', profile.addressCity)}
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              {ptf('Bairro', profile.addressNeighborhood)}
            </Grid>
            <Grid size={{ xs: 12, sm: 5 }}>
              {ptf('Rua', profile.addressStreet)}
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
              {ptf('Número', profile.addressNumber)}
            </Grid>
            <Grid size={{ xs: 12, sm: 5 }}>
              {ptf('Complemento', profile.addressComplement)}
            </Grid>
          </Grid>
        </Stack>

        {/* Dados Institucionais */}
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Dados Institucionais
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              {ptf(
                'Disponibilidade de Horário',
                profile.availableHours === 'MATUTINO'
                  ? 'Matutino'
                  : profile.availableHours === 'VESPERTINO'
                    ? 'Vespertino'
                    : profile.availableHours === 'NOTURNO'
                      ? 'Noturno'
                      : profile.availableHours === 'TODOS'
                        ? 'Todos os turnos'
                        : profile.availableHours
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              {ptf('Categoria', profile.category)}
            </Grid>
          </Grid>
        </Stack>

        {/* Dados Autodeclaratórios */}
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'center' }} spacing={2}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Dados Autodeclaratórios
            </Typography>
            {!editingDecl && (
              <Button
                startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                variant="contained"
                color="primary"
                onClick={() => {
                  setSelfDeclDraft({ ...selfDecl });
                  setEditingDecl(true);
                }}
                sx={{
                  borderRadius: 10,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2.5,
                }}
              >
                Editar
              </Button>
            )}
          </Stack>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 5 }}>{nomeSocialField}</Grid>
            <Grid size={{ xs: 12, sm: 'auto' }} sx={{ minWidth: 180 }}>
              {declSelect('Escolaridade', 'education', [
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
                { value: 'SUPERIOR_INCOMPLETO', label: 'Superior Incompleto' },
                { value: 'SUPERIOR_COMPLETO', label: 'Superior Completo' },
                {
                  value: 'ESPECIALIZACAO_INCOMPLETA',
                  label: 'Espec. Incompleta',
                },
                { value: 'ESPECIALIZACAO_COMPLETA', label: 'Espec. Completa' },
                { value: 'MESTRADO_INCOMPLETO', label: 'Mestrado Incompleto' },
                { value: 'MESTRADO_COMPLETO', label: 'Mestrado Completo' },
                {
                  value: 'DOUTORADO_INCOMPLETO',
                  label: 'Doutorado Incompleto',
                },
                { value: 'DOUTORADO_COMPLETO', label: 'Doutorado Completo' },
              ])}
            </Grid>
            <Grid size={{ xs: 12, sm: 'auto' }} sx={{ minWidth: 150 }}>
              {rendaField}
            </Grid>
            <Grid size={{ xs: 12, sm: 'auto' }} sx={{ minWidth: 150 }}>
              {declSelect('Etnia', 'race', [
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
            <Grid size={{ xs: 12, sm: 'auto' }} sx={{ minWidth: 180 }}>
              {declSelect('Identidade de Gênero', 'gender', [
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
            <Grid size={{ xs: 12, sm: 'auto' }} sx={{ minWidth: 180 }}>
              {declSelect('Orientação Sexual', 'sexualOrientation', [
                { value: 'HETEROSSEXUAL', label: 'Heterossexual' },
                { value: 'HOMOSSEXUAL', label: 'Homossexual' },
                { value: 'BISSEXUAL', label: 'Bissexual' },
                { value: 'NAO_SEI', label: 'Não sei' },
                { value: 'OUTRO', label: 'Outro' },
                {
                  value: 'PREFIRO_NAO_INFORMAR',
                  label: 'Prefiro não informar',
                },
              ])}
              {selfDeclDraft.sexualOrientation === 'OUTRO' && (
                <TextField
                  label="Qual?"
                  size="small"
                  fullWidth
                  disabled={!editingDecl}
                  value={selfDeclDraft.otherSexualOrientation || ''}
                  onChange={(e) => setSelfDeclDraft(p => ({ ...p, otherSexualOrientation: e.target.value }))}
                  sx={{ mt: 2 }}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                      sx: { color: editingDecl ? 'primary.main' : undefined },
                    },
                    input: {
                      sx: {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: editingDecl ? 'primary.main' : undefined,
                        },
                      },
                    },
                  }}
                />
              )}
            </Grid>
          </Grid>

          <FormControlLabel
            sx={{ mt: 2 }}
            control={
              <Checkbox
                checked={selfDeclDraft.dataSharing}
                onChange={(e) =>
                  setSelfDeclDraft({
                    ...selfDeclDraft,
                    dataSharing: e.target.checked,
                  })
                }
                disabled={!editingDecl}
                color="primary"
              />
            }
            label={
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Eu autorizo o compartilhamento de todos os meus dados com
                parceiros da associação.
              </Typography>
            }
          />

          {editingDecl && (
            <Stack
              direction="row"
              spacing={2}
              sx={{ pt: 1, justifyContent: 'flex-start' }}
            >
              <Button
                variant="contained"
                onClick={handleCancelDecl}
                sx={{
                  bgcolor: 'grey.300',
                  color: 'text.primary',
                  fontWeight: 700,
                  borderRadius: 10,
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  boxShadow: 'none',
                  '&:hover': { bgcolor: 'grey.400', boxShadow: 'none' },
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveDecl}
                disabled={saving}
                sx={{
                  fontWeight: 700,
                  borderRadius: 10,
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                }}
              >
                {saving ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  'Salvar'
                )}
              </Button>
            </Stack>
          )}
        </Stack>
      </Stack>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snack.severity}
          variant="filled"
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AssociateSelfSupplementForm;
