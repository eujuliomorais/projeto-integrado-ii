import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Alert,
  Button,
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
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  getCitiesByState,
  getStates,
  type City,
  type State,
} from '../services/address/ibgeService';
import { getAddressByCep } from '../services/address/viaCepService';
import type { AssociateCategoryResponse } from '../services/associate/associate.types';
import {
  createAssociate,
  getCategories,
} from '../services/associate/associateService';
import { isValidBirthDate } from '../utils/dates.util';
import { maskCEP, maskCPF, maskPhone } from '../utils/masks.util';
import DuplicateCPFDialog from './DuplicateCPFDialog';

interface AssociateCreateForm {
  fullName: string;
  cpf: string;
  birthDate: string;
  guardianName: string;
  email: string;
  phone: string;
  addressZipCode: string;
  addressState: string;
  addressCity: string;
  addressNeighborhood: string;
  addressStreet: string;
  addressNumber: string;
  addressComplement: string;
  availability: string;
  category: string;
}

const EMPTY: AssociateCreateForm = {
  fullName: '',
  cpf: '',
  birthDate: '',
  guardianName: '',
  email: '',
  phone: '',
  addressZipCode: '',
  addressState: '',
  addressCity: '',
  addressNeighborhood: '',
  addressStreet: '',
  addressNumber: '',
  addressComplement: '',
  availability: '',
  category: '',
};

type Snack = { open: boolean; severity: 'success' | 'error'; msg: string };

const AssociateCreateForm = () => {
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof AssociateCreateForm, string>>
  >({});
  const [form, setForm] = useState<AssociateCreateForm>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [duplicateOpen, setDuplicate] = useState(false);
  const [categories, setCategories] = useState<AssociateCategoryResponse[]>([]);
  const [snack, setSnack] = useState<Snack>({
    open: false,
    severity: 'success',
    msg: '',
  });
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const { token } = useAuth();

  const navigate = useNavigate();

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

  const handleStateChange = async (uf: string) => {
    try {
      const citiesData = await getCitiesByState(uf);

      setCities(citiesData);

      setForm((prev) => ({
        ...prev,
        addressState: uf,
        addressCity: '',
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCepBlur = async (zipCode: string) => {
    const cep = zipCode.replace('-', '');

    if (cep.length !== 8) return;

    try {
      const data = await getAddressByCep(cep);

      const citiesData = await getCitiesByState(data.uf);

      setCities(citiesData);

      if (data.erro) return;

      setForm((prev) => ({
        ...prev,
        addressState: data.uf,
        addressCity: data.localidade,
        addressNeighborhood: data.bairro,
        addressStreet: data.logradouro,
        addressComplement: data.complemento || prev.addressComplement,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!token) return;
    getCategories(token)
      .then((data) => setCategories(data))
      .catch(() => {
        /* silently ignore, select fica vazio */
      });
  }, [token]);

  const set =
    (key: keyof AssociateCreateForm) =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      if (key === 'cpf') {
        value = maskCPF(value);
      }

      if (key === 'phone') {
        value = maskPhone(value);
      }

      if (key === 'addressZipCode') {
        value = maskCEP(value);

        if (value.length >= 9) {
          await handleCepBlur(value);
        }
      }

      if (key === 'addressNumber') {
        value = value.replace(/\D/g, '').slice(0, 10);
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

      setFieldErrors((prev) => ({
        ...prev,
        [key]: undefined,
      }));
    };

  const handleSubmit = async () => {
    const errors: Partial<Record<keyof AssociateCreateForm, string>> = {};

    if (!form.fullName.trim()) {
      errors.fullName = 'Nome é obrigatório';
    } else if (/\d/.test(form.fullName)) {
      errors.fullName = 'O nome não pode conter números';
    }

    if (!form.cpf.trim()) {
      errors.cpf = 'CPF é obrigatório';
    } else if (form.cpf.replace(/\D/g, '').length !== 11) {
      errors.cpf = 'CPF inválido';
    }

    if (!form.birthDate.trim()) {
      errors.birthDate = 'Data de nascimento é obrigatória';
    } else if (!isValidBirthDate(form.birthDate)) {
      errors.birthDate = 'Data inválida';
    }

    if (isUnder18 && !form.guardianName.trim()) {
      errors.guardianName = 'Responsável é obrigatório';
    } else if (isUnder18 && /\d/.test(form.guardianName)) {
      errors.guardianName = 'O nome do responsável não pode conter números';
    }

    if (!form.email.trim()) {
      errors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'E-mail inválido';
    }

    if (!form.phone.trim()) {
      errors.phone = 'Telefone é obrigatório';
    } else if (form.phone.replace(/\D/g, '').length < 10) {
      errors.phone = 'Telefone inválido';
    }

    if (!form.addressZipCode.trim()) {
      errors.addressZipCode = 'CEP é obrigatório';
    } else if (form.addressZipCode.replace(/\D/g, '').length !== 8) {
      errors.addressZipCode = 'CEP inválido';
    }

    if (!form.addressState) {
      errors.addressState = 'Estado é obrigatório';
    }

    if (!form.addressCity) {
      errors.addressCity = 'Cidade é obrigatória';
    }

    if (!form.category) {
      errors.category = 'Categoria é obrigatória';
    }

    if (!form.availability) {
      errors.availability = 'Disponibilidade é obrigatória';
    }

    if (!form.addressNeighborhood.trim()) {
      errors.addressNeighborhood = 'Bairro é obrigatório';
    }

    if (!form.addressStreet.trim()) {
      errors.addressStreet = 'Rua é obrigatório';
    }

    if (!form.addressNumber.trim()) {
      errors.addressNumber = 'Número é obrigatório';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    setSaving(true);

    try {
      if (!token) return;

      await createAssociate(token, {
        baseData: {
          email: form.email,
          password: '12345678',
          fullName: form.fullName,
          cpf: form.cpf.replace(/\D/g, ''),
          phone: form.phone.replace(/\D/g, ''),
        },

        birthDate: form.birthDate,

        workCategoryId: form.category || undefined,

        availableHours:
          (form.availability as
            | 'MATUTINO'
            | 'VESPERTINO'
            | 'NOTURNO'
            | 'TODOS') || 'TODOS',

        postalCode: form.addressZipCode.replace(/\D/g, ''),
        street: form.addressStreet,
        number: form.addressNumber || '0',
        complement: form.addressComplement || undefined,
        neighborhood: form.addressNeighborhood,
        city: form.addressCity,
        state: form.addressState,
        legalGuardianName: isUnder18 ? form.guardianName : '',

        acceptedDataSharingTerm: true,
      });

      setSnack({
        open: true,
        severity: 'success',
        msg: 'Associado cadastrado com sucesso!',
      });

      setTimeout(() => navigate('/associados'), 1500);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? '';

      if (
        msg.toLowerCase().includes('cpf') ||
        msg.toLowerCase().includes('already')
      ) {
        setDuplicate(true);
      } else {
        setSnack({
          open: true,
          severity: 'error',
          msg: 'Erro ao cadastrar associado.',
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const textField = (
    label: string,
    key: keyof AssociateCreateForm,
    placeholder?: string,
    type = 'text'
  ) => (
    <TextField
      label={label}
      placeholder={placeholder}
      value={form[key]}
      onChange={set(key)}
      type={type}
      size="small"
      fullWidth
      error={Boolean(fieldErrors[key])}
      helperText={fieldErrors[key]}
      slotProps={{
        inputLabel: { shrink: true },
      }}
    />
  );

  const selectField = (
    label: string,
    key: keyof AssociateCreateForm,
    options: { value: string; label: string }[]
  ) => (
    <FormControl size="small" fullWidth error={Boolean(fieldErrors[key])}>
      <InputLabel shrink>{label}</InputLabel>

      <Select
        value={form[key]}
        label={label}
        notched
        displayEmpty
        renderValue={(v) =>
          v === '' ? (
            <span style={{ color: '#9e9e9e' }}>Selecione</span>
          ) : (
            (options.find((o) => o.value === v)?.label ?? String(v))
          )
        }
        onChange={(e) => {
          setForm((p) => ({
            ...p,
            [key]: e.target.value,
          }));

          setFieldErrors((prev) => ({
            ...prev,
            [key]: undefined,
          }));
        }}
      >
        <MenuItem value="" disabled>
          <em>Selecione</em>
        </MenuItem>
        {options.map((o) => (
          <MenuItem key={o.value} value={o.value}>
            {o.label}
          </MenuItem>
        ))}
      </Select>

      <FormHelperText>{fieldErrors[key]}</FormHelperText>
    </FormControl>
  );

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

  return (
    <>
      <Stack spacing={2.5}>
        {/* Voltar */}
        <Button
          startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
          onClick={() => navigate('/associados')}
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
          {/* ── Dados Pessoais ── */}
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            Dados Pessoais
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {/* Row 1: Nome, CPF, Data Nascimento */}
            <Grid size={{ xs: 12, sm: 5 }}>
              {textField(
                'Nome Completo',
                'fullName',
                'Informe o nome completo'
              )}
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              {textField('CPF', 'cpf', 'Informe o CPF')}
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              {textField(
                'Data de Nascimento',
                'birthDate',
                'XX/XX/XXXX',
                'date'
              )}
            </Grid>

            {/* Row 2: Nome Responsável */}
            {isUnder18 && (
              <Grid size={{ xs: 12 }}>
                {textField(
                  'Nome Responsável',
                  'guardianName',
                  'Informe o nome completo do Responsável'
                )}
              </Grid>
            )}

            {/* Row 3: Email, Telefone */}
            <Grid size={{ xs: 12, sm: 8 }}>
              {textField('E-mail', 'email', 'Informe o E-mail', 'email')}
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              {textField('Telefone', 'phone', 'Informe o Telefone')}
            </Grid>
          </Grid>

          {/* ── Dados de Endereço ── */}
          <Divider sx={{ mb: 3 }} />

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            Dados de Endereço
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {/* Row 1: CEP, Estado, Cidade, Bairro */}
            <Grid size={{ xs: 12, sm: 2 }}>
              {textField('CEP', 'addressZipCode', 'Informe o CEP')}
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControl
                size="small"
                fullWidth
                error={Boolean(fieldErrors.addressState)}
              >
                <InputLabel shrink>Estado</InputLabel>

                <Select
                  value={form.addressState}
                  label="Estado"
                  notched
                  displayEmpty
                  onChange={(e) => handleStateChange(String(e.target.value))}
                >
                  {states.map((state) => (
                    <MenuItem key={state.sigla} value={state.sigla}>
                      {state.sigla} - {state.nome}
                    </MenuItem>
                  ))}
                </Select>

                <FormHelperText>{fieldErrors.addressState}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControl
                size="small"
                fullWidth
                error={Boolean(fieldErrors.addressCity)}
              >
                <InputLabel shrink>Cidade</InputLabel>

                <Select
                  value={form.addressCity}
                  label="Cidade"
                  notched
                  displayEmpty
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      addressCity: String(e.target.value),
                    }))
                  }
                >
                  {cities.map((city) => (
                    <MenuItem key={city.nome} value={city.nome}>
                      {city.nome}
                    </MenuItem>
                  ))}
                </Select>

                <FormHelperText>{fieldErrors.addressCity}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              {textField('Bairro', 'addressNeighborhood', 'Informe o Bairro')}
            </Grid>

            {/* Row 2: Rua, Num, Complemento */}
            <Grid size={{ xs: 12, sm: 4 }}>
              {textField('Rua', 'addressStreet', 'Informe a Rua')}
            </Grid>

            <Grid size={{ xs: 12, sm: 2 }}>
              {textField('Número', 'addressNumber', 'Nº')}
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              {textField('Complemento', 'addressComplement', 'Apto, bloco...')}
            </Grid>
          </Grid>

          {/* ── Dados Institucionais ── */}
          <Divider sx={{ mb: 3 }} />

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            Dados Institucionais
          </Typography>

          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              {selectField('Disponibilidade de Horário', 'availability', [
                { value: 'MATUTINO', label: 'Matutino' },
                { value: 'VESPERTINO', label: 'Vespertino' },
                { value: 'NOTURNO', label: 'Noturno' },
                { value: 'TODOS', label: 'Todos os turnos' },
              ])}
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              {selectField(
                'Categoria',
                'category',
                categories.map((c) => ({ value: c.id, label: c.name }))
              )}
            </Grid>
          </Grid>

          {/* ── Actions ── */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ justifyContent: 'flex-end' }}
          >
            <Button
              variant="contained"
              onClick={() => navigate('/associados')}
              sx={{
                bgcolor: 'grey.300',
                color: 'text.primary',
                fontWeight: 700,
                borderRadius: 10,
                textTransform: 'none',
                px: 4,
                py: 1.5,
                boxShadow: 'none',
                width: { xs: '100%', sm: 'auto' },
                '&:hover': { bgcolor: 'grey.400', boxShadow: 'none' },
              }}
            >
              Cancelar
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={saving}
              sx={{
                fontWeight: 700,
                borderRadius: 10,
                textTransform: 'none',
                px: 4,
                py: 1.5,
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              {saving ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                'Confirmar'
              )}
            </Button>
          </Stack>
        </Paper>
      </Stack>

      <DuplicateCPFDialog
        open={duplicateOpen}
        onClose={() => setDuplicate(false)}
      />

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
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

export default AssociateCreateForm;
