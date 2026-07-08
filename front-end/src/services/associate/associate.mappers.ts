import { maskCEP, maskCPF, maskPhone } from '../../utils/masks.util';
import type {
  AssociateProfileForm,
  AssociateResponse,
  CreateAssociatePayload,
  UpdateAssociatePayload,
} from './associate.types';

export const mapAssociateResponseToForm = (
  associate: AssociateResponse
): AssociateProfileForm => {
  const phone = associate.phone ?? associate.user.phone ?? '';
  const cpf = associate.cpf ?? associate.user.cpf ?? '';
  const cep = associate.address?.postalCode ?? '';

  return {
    id: associate.id,
    fullName: associate.user.name ?? '',
    cpf: maskCPF(cpf) ?? '',
    email: associate.user.email ?? '',
    avatarUrl: associate.user?.avatarUrl ?? '',
    phone: maskPhone(phone) ?? '',
    birthDate: associate.birthDate ?? '',
    category: associate.workCategory?.id ?? '',
    guardianName: associate.legalGuardianName ?? '',
    availableHours:
      (associate.availableHours as AssociateProfileForm['availableHours']) ??
      '',
    addressZipCode: maskCEP(cep) ?? '',
    addressState: associate.address?.state ?? '',
    addressCity: associate.address?.city ?? '',
    addressNeighborhood: associate.address?.neighborhood ?? '',
    addressStreet: associate.address?.street ?? '',
    addressNumber: associate.address?.number ?? '',
    addressComplement: associate.address?.complement ?? '',

    race: associate.selfDeclaration?.race ?? '',
    gender: associate.selfDeclaration?.gender ?? '',
    sexualOrientation: associate.selfDeclaration?.sexualOrientation ?? '',
    education:
      associate.selfDeclaration?.education === 'NÃO_SELECIONADO'
        ? ''
        : ((associate.selfDeclaration
            ?.education as AssociateProfileForm['education']) ?? ''),
    income:
      associate.selfDeclaration?.income != null
        ? associate.selfDeclaration.income.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })
        : '',
    disability: '',
  };
};

// Converte a string mascarada de renda (ex: "R$ 1.500,00") para número
const parseMaskedIncome = (v: string): number | null => {
  if (!v || v === 'PREFIRO_NAO_INFORMAR') return null;
  const digits = v.replace(/\D/g, '');
  if (!digits) return null;
  return Number(digits) / 100;
};

// Valores válidos do novo EscolaridadeEnum
const VALID_EDUCATION = new Set([
  'FUNDAMENTAL_INCOMPLETO',
  'FUNDAMENTAL_COMPLETO',
  'MEDIO_INCOMPLETO',
  'MEDIO_COMPLETO',
  'SUPERIOR_INCOMPLETO',
  'SUPERIOR_COMPLETO',
  'ESPECIALIZACAO_INCOMPLETA',
  'ESPECIALIZACAO_COMPLETA',
  'MESTRADO_INCOMPLETO',
  'MESTRADO_COMPLETO',
  'DOUTORADO_INCOMPLETO',
  'DOUTORADO_COMPLETO',
]);

export const mapFormToUpdatePayload = (
  form: AssociateProfileForm
): UpdateAssociatePayload => ({
  cpf: form.cpf || undefined,
  birthDate: form.birthDate || undefined,
  phone: form.phone || undefined,
  workCategoryId: form.category || undefined,
  legalGuardianName: form.guardianName || '',
  availableHours:
    (form.availableHours as UpdateAssociatePayload['availableHours']) ||
    undefined,
  fullName: form.fullName || undefined,
  email: form.email || undefined,
  postalCode: form.addressZipCode || undefined,
  street: form.addressStreet || undefined,
  number: form.addressNumber || undefined,
  complement: form.addressComplement || undefined,
  neighborhood: form.addressNeighborhood || undefined,
  city: form.addressCity || undefined,
  state: form.addressState || undefined,
  // Campos de autodeclaração não são editados pelo admin neste endpoint
  race: !form.race || form.race === 'PREFIRO_NAO_INFORMAR' ? null : form.race,
  gender:
    !form.gender || form.gender === 'PREFIRO_NAO_INFORMAR' ? null : form.gender,
  sexualOrientation:
    !form.sexualOrientation || form.sexualOrientation === 'PREFIRO_NAO_INFORMAR'
      ? null
      : form.sexualOrientation,
  // Filtra valores legados do banco que não existem mais no enum
  education:
    !form.education ||
    (!VALID_EDUCATION.has(form.education) &&
      form.education !== 'NÃO_SELECIONADO')
      ? ('' as UpdateAssociatePayload['education'])
      : (form.education as UpdateAssociatePayload['education']),
  income: parseMaskedIncome(String(form.income ?? '')),
});

export const mapFormToCreatePayload = (
  form: AssociateProfileForm,
  password: string
): CreateAssociatePayload => ({
  baseData: {
    email: form.email,
    password,
    fullName: form.fullName,
    cpf: form.cpf,
    phone: form.phone,
  },
  birthDate: form.birthDate,
  workCategoryId: form.category || undefined,
  availableHours:
    (form.availableHours as CreateAssociatePayload['availableHours']) ||
    'TODOS',
  postalCode: form.addressZipCode,
  street: form.addressStreet,
  number: form.addressNumber,
  complement: form.addressComplement || undefined,
  neighborhood: form.addressNeighborhood,
  city: form.addressCity,
  state: form.addressState,
  race: form.race || undefined,
  gender: form.gender || undefined,
  sexualOrientation: form.sexualOrientation || undefined,
  education:
    !form.education || form.education === 'NÃO_SELECIONADO'
      ? ('' as CreateAssociatePayload['education'])
      : (form.education as CreateAssociatePayload['education']),
  income: parseMaskedIncome(String(form.income ?? '')) ?? undefined,
  legalGuardianName: undefined,
});
