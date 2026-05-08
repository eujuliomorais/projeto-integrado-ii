import type { Role } from '../auth/roles';

export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  role: Role;
}

export interface PageableResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
