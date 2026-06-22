import api from '../api';
import type { AuthUser } from './auth.types';
import type { Role } from './roles';

interface GetProfileRequest {
  token: string;
}

export async function authGetProfile({
  token,
}: GetProfileRequest): Promise<AuthUser> {
  const res = await api.get('/auth/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
}

interface PasswordValidateRequest {
  token: string;
}

interface PasswordValidateResponse {
  message: string;
  valid: true;
  resetToken: string;
}

export async function authPasswordValidate({
  token,
}: PasswordValidateRequest): Promise<PasswordValidateResponse> {
  const res = await api.post('/auth/password/validate', { token });

  return res.data;
}

interface PasswordResetRequest {
  newPassword: string;
  confirmPassword: string;
  bearerToken: string;
}

interface PasswordResetResponse {
  message: string;
}

export async function authPasswordReset({
  newPassword,
  confirmPassword,
  bearerToken,
}: PasswordResetRequest): Promise<PasswordResetResponse> {
  const res = await api.post(
    '/auth/password/reset',
    {
      newPassword,
      confirmPassword,
    },
    {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    }
  );

  return res.data;
}

interface PasswordForgotRequest {
  email: string;
}

interface PasswordForgotResponse {
  message: string;
}

export async function authPasswordForgot({
  email,
}: PasswordForgotRequest): Promise<PasswordForgotResponse> {
  const res = await api.post('/auth/password/forgot', {
    email,
  });

  return res.data;
}

interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export async function authLogin({
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
}

export async function accessControlLogin({
  accessKey,
}: AccessControlLoginRequest): Promise<AccessControlLoginResponse> {
  const res = await api.post('/auth/access-manager/login', {
    accessKey,
  });

  return res.data;
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

export interface SendTokenRequest {
  email: string;
}

export async function authSendToken({ email }: SendTokenRequest) {
  const res = await api.post('/auth/magic-link/request', { email });

  return res.data;
}

export interface InsertTokenRequest {
  email: string;
  token: string;
}

export interface InsertTokenResponse {
  message: string;
  token: string;
}

export async function authInsertToken({
  token,
  email,
}: InsertTokenRequest): Promise<InsertTokenResponse> {
  const res = await api.post('/auth/magic-link/login', { email, token });

  return res.data;
}
