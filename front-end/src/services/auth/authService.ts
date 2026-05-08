import api from '../api';
import type { AuthUser } from './auth.types';
import { decodeJwt } from './jwt.config';
import type { Role } from './roles';

interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export async function login({
  email,
  password,
}: LoginRequest): Promise<LoginResponse> {
  const res = await api.post('/auth/login', {
    email,
    password,
  });

  return res.data;
}

interface AccessControlLoginRequest {
  accessKey: string;
}

export interface AccessControlLoginResponse {
  token: string;
  user: AuthUser;
}

export async function accessControlLogin({
  accessKey,
}: AccessControlLoginRequest): Promise<AccessControlLoginResponse> {
  const res = await api.post('/auth/access-manager/login', {
    accessKey,
  });

  return res.data;
}

// export async function getMe(): Promise<AuthUser> {
//   // const res = await api.get('/auth/me');
//   // return res.data;

//   return {
//     id: '1',
//     name: 'Super Administrador',
//     email: 'admin@email.com',
//     role: 'SUPER_ADMIN',
//   };
// }

export function getAuthUserNoAPI(token: string): AuthUser {
  const tokenDecoded = decodeJwt(token);

  const { sub: email, role: role } = tokenDecoded;

  return { email, role };
}

interface AccessControlCreateRequest {
  email: string;
  password: string;
  fullName: string;
  cpf: string;
  phone: string;
  role: Role;
}

export async function accessControlCreate({
  email,
  password,
  fullName,
  cpf,
  phone,
  role,
}: AccessControlCreateRequest) {
  const res = await api.post('/admins', {
    email,
    password,
    fullName,
    cpf,
    phone,
    role,
  });

  return res.data;
}
