export type AssociateStatus = 'ATIVO' | 'PENDENTE' | 'INATIVADO' | 'INATIVO';

export type AssociateCategory = 'ARTISTA' | 'PRODUTOR' | 'TECNICO' | 'OUTRO';

export interface AssociateCategoryResponse {
  id: string;
  name: string;
}

// income agora é BigDecimal no backend (número)
export type AssociateIncome = number | null;

export type DisponibilidadeHorarioEnum =
  | 'MATUTINO'
  | 'VESPERTINO'
  | 'NOTURNO'
  | 'TODOS';

export type AssociateEducation =
  | 'NÃO_SELECIONADO'
  | 'FUNDAMENTAL_INCOMPLETO'
  | 'FUNDAMENTAL_COMPLETO'
  | 'MEDIO_INCOMPLETO'
  | 'MEDIO_COMPLETO'
  | 'SUPERIOR_INCOMPLETO'
  | 'SUPERIOR_COMPLETO'
  | 'ESPECIALIZACAO_INCOMPLETA'
  | 'ESPECIALIZACAO_COMPLETA'
  | 'MESTRADO_INCOMPLETO'
  | 'MESTRADO_COMPLETO'
  | 'DOUTORADO_INCOMPLETO'
  | 'DOUTORADO_COMPLETO';

export interface IAssociateProfileForm {
  id: string;
  fullName: string;
  cpf: string;
  email: string;
  phone: string;
  birthDate: string;
  guardianName: string;
  category: string; // UUID from categories table
  addressZipCode: string;
  addressState: string;
  addressCity: string;
  addressNeighborhood: string;
  addressStreet: string;
  addressNumber: string;
  addressComplement?: string;
  race?: string;
  gender?: string;
  sexualOrientation?: string;
  education?: AssociateEducation | '';
  income?: string; // mantido como string no form para facilitar input mascarado
  disability?: string;
  availableHours: DisponibilidadeHorarioEnum | '';
}

export interface IAdminAssociateProfileForm {
  id: string;
  fullName: string;
  cpf: string;
  email: string;
  phone: string;
  birthDate: string;
  category: string; // UUID from categories table
  guardianName: string;
  addressZipCode: string;
  addressState: string;
  addressCity: string;
  addressNeighborhood: string;
  addressStreet: string;
  addressNumber: string;
  addressComplement?: string;
  availableHours: DisponibilidadeHorarioEnum | '';
}

// Alias sem prefixo para compatibilidade com o padrão do develop
export type AssociateProfileForm = IAssociateProfileForm;

export interface IAssociateSelfDeclarationForm {
  education: AssociateEducation;
  race: string;
  gender: string;
  sexualOrientation: string;
  income: string; // string para input mascarado, convertido para número no envio
  disability: string;
}

export interface AssociateResponse {
  id: string;
  cpf: string;
  birthDate?: string;
  workCategory?: AssociateCategoryResponse;
  phone?: string;
  legalGuardianName?: string;
  user: {
    id: string;
    name: string;
    email?: string;
    password?: string;
    cpf?: string;
    phone?: string;
    role?: string;
    accessKeyHash?: string;
    createdAt?: string;
    updatedAt?: string;
    enabled?: boolean;
    active: boolean;
    username?: string;
    authorities?: { authority: string }[];
    accountNonExpired?: boolean;
    accountNonLocked?: boolean;
    credentialsNonExpired?: boolean;
  };
  address?: {
    id?: string;
    postalCode?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
  };
  selfDeclaration?: {
    id?: string;
    socialName?: string;
    race?: string;
    gender?: string;
    sexualOrientation?: string;
    education?: AssociateEducation;
    income?: number | null; // BigDecimal do backend
    acceptedDataSharingTerm?: boolean;
  };
  availableHours?: DisponibilidadeHorarioEnum;
  status?: AssociateStatus;
}

export interface AssociatePageableResponse {
  content: AssociateResponse[];
  totalElements: number;
  totalPages: number;

  size: number;
  number: number;

  first: boolean;
  last: boolean;

  numberOfElements: number;
  empty: boolean;
}

export interface CreateAssociatePayload {
  baseData: {
    email: string;
    password: string;
    fullName: string;
    cpf: string;
    phone: string;
  };
  socialName?: string;
  artisticName?: string;
  birthDate: string;
  workCategoryId?: string;
  availableHours: DisponibilidadeHorarioEnum;
  postalCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  race?: string;
  gender?: string;
  sexualOrientation?: string;
  education?: AssociateEducation;
  income?: number;
  legalGuardianName?: string;
  acceptedDataSharingTerm?: boolean;
}

export interface UpdateAssociatePayload {
  cpf?: string;
  birthDate?: string;
  phone?: string;
  workCategoryId?: string;
  availableHours?: DisponibilidadeHorarioEnum;
  legalGuardianName?: string;
  fullName?: string;
  email?: string;
  postalCode?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  race?: string | null;
  gender?: string | null;
  sexualOrientation?: string | null;
  education?: AssociateEducation | null;
  income?: number | null;
  acceptedDataSharingTerm?: boolean;
}

export type Associate = AssociateResponse;

export type AssociatePageable = AssociatePageableResponse;

export const normalizeCategoryView = (category?: AssociateCategory) => {
  switch (category) {
    case 'ARTISTA':
      return 'Artista';

    case 'TECNICO':
      return 'Técnico';

    case 'PRODUTOR':
      return 'Produtor';

    case 'OUTRO':
      return 'Outro';

    default:
      return '-';
  }
};

export const normalizeIncomeView = (income?: number | null): string => {
  if (income == null) return '-';
  return income.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export const normalizeEducationView = (
  education?: AssociateEducation | string
): string => {
  const map: Record<string, string> = {
    FUNDAMENTAL_INCOMPLETO: 'Fund. Incompleto',
    FUNDAMENTAL_COMPLETO: 'Fund. Completo',
    MEDIO_INCOMPLETO: 'Médio Incompleto',
    MEDIO_COMPLETO: 'Médio Completo',
    SUPERIOR_INCOMPLETO: 'Superior Incompleto',
    SUPERIOR_COMPLETO: 'Superior Completo',
    ESPECIALIZACAO_INCOMPLETA: 'Espec. Incompleta',
    ESPECIALIZACAO_COMPLETA: 'Espec. Completa',
    MESTRADO_INCOMPLETO: 'Mestrado Incompleto',
    MESTRADO_COMPLETO: 'Mestrado Completo',
    DOUTORADO_INCOMPLETO: 'Doutorado Incompleto',
    DOUTORADO_COMPLETO: 'Doutorado Completo',
  };
  return (education && map[education]) ?? '-';
};

export const normalizeAvailabilityView = (
  availability?: DisponibilidadeHorarioEnum | string
): string => {
  const map: Record<string, string> = {
    MATUTINO: 'Matutino',
    VESPERTINO: 'Vespertino',
    NOTURNO: 'Noturno',
    TODOS: 'Todos os turnos',
  };
  return (availability && map[availability]) ?? '-';
};
