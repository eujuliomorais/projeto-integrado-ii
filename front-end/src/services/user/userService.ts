import api from '../api';
import type { Role } from '../auth/roles';
import type { PageableResponse, User } from './user.types';

interface GetUsersParams {
  page: number;
  size?: number;
}

export async function getUsers({
  page,
  size = 10,
}: GetUsersParams): Promise<PageableResponse<User>> {
  const response = await api.get<PageableResponse<User>>('/management/users', {
    params: {
      page,
      size,
    },
  });

  return response.data;
}

interface AccessControlGetUserByIdRequest {
  id: string;
}

export interface AccessControlGetUserByIdResponse {
  email: string;
  password: string;
  name: string;
  cpf: string;
  phone: string;
  role: Role;
}

export async function accessControlGetUserById({
  id,
}: AccessControlGetUserByIdRequest) {
  const res = await api.get(`/management/users/${id}`);

  return res.data;
}

interface AccessControlUpdateUserRequest {
  id: string;
  email: string;
  fullName: string;
  cpf: string;
  phone: string;
}

export async function accessControlUpdateUser({
  id,
  email,
  fullName,
  cpf,
  phone,
}: AccessControlUpdateUserRequest) {
  const res = await api.put(`/management/users/${id}`, {
    email,
    fullName,
    cpf,
    phone,
  });

  return res.data;
}

interface accessControlUpdateUserRoleRequest {
  id: string;
  newRole: Role;
}

export async function accessControlUpdateUserRole({
  id,
  newRole,
}: accessControlUpdateUserRoleRequest) {
  const res = await api.patch(`/management/users/${id}/role`, {
    newRole,
  });

  return res.data;
}

export async function accessControlDeleteUser({
  id,
}: AccessControlGetUserByIdRequest) {
  const res = await api.delete(`/management/users/${id}`);

  return res.data;
}
