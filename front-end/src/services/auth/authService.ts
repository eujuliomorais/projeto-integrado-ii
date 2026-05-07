import api from '../api';
import type { AuthUser } from './auth.types';

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

export async function getMe(): Promise<AuthUser> {
  // const res = await api.get('/auth/me');
  // return res.data;

  return {
    id: '1',
    name: 'Super Administrador',
    email: 'admin@email.com',
    role: 'SUPER_ADMIN',
  };
}