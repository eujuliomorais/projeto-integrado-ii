import api from '../api';

export interface UploadAvatarRequest {
  token: string;
  file: File;
}

export async function uploadAvatar({
  token,
  file,
}: UploadAvatarRequest): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await api.post<string>('/users/upload-avatar', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
}

export interface GetAvatarRequest {
  token: string;
  id: string;
}

export async function getAvatar({
  token,
  id,
}: GetAvatarRequest): Promise<string> {
  const res = await api.get<string>(`/users/${id}/avatar`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
}

export interface DeleteAvatarRequest {
  token: string;
  id: string;
}

export async function deleteAvatar({
  token,
  id,
}: DeleteAvatarRequest): Promise<void> {
  await api.delete(`/users/${id}/avatar`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export interface UpdateAvatarRequest {
  token: string;
  id: string;
  file: File;
}

export async function updateAvatar({
  token,
  id,
  file,
}: UpdateAvatarRequest): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await api.patch<string>(`/users/${id}/avatar`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
}
