import type { Role } from './roles';

export interface AuthUser {
  id?: string;
  name?: string;
  email: string;
  role: Role;
  cpf?: string;
  phone?: string;
  avatarUrl: string;
}
