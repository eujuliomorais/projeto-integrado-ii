import api from '../api';
import type {
  Associate,
  AssociateCategoryResponse,
  CreateAssociatePayload,
  UpdateAssociatePayload,
} from './associate.types';
import type {
  SelfDeclarationResponse,
  UpdateSelfDeclarationPayload,
} from './selfDeclaration/selfDeclaration.types';

export interface GetAssociatesParams {
  page?: number;
  size?: number;
  search?: string;
}

export async function getAssociates(
  bearerToken: string,
  params?: GetAssociatesParams
): Promise<Associate[]> {
  const res = await api.get('/associates', {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
    params,
  });

  return res.data;
}

export async function getAssociateById(
  bearerToken: string,
  id: string
): Promise<Associate> {
  const res = await api.get(`/associates/${id}`, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  return res.data;
}

export async function getMyAssociate(bearerToken: string): Promise<Associate> {
  const res = await api.get('/associates/me', {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  return res.data;
}

export async function createAssociate(
  bearerToken: string,
  data: CreateAssociatePayload
): Promise<Associate> {
  const res = await api.post('/associates', data, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  return res.data;
}

export async function updateAssociate(
  bearerToken: string,
  id: string,
  data: UpdateAssociatePayload
): Promise<Associate> {
  const res = await api.patch(`/associates/${id}`, data, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  return res.data;
}

export async function deleteAssociate(
  bearerToken: string,
  id: string
): Promise<void> {
  await api.delete(`/associates/${id}`, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });
}

export async function updateMySelfDeclaration(
  bearerToken: string,
  data: UpdateSelfDeclarationPayload
): Promise<SelfDeclarationResponse> {
  const res = await api.patch('/associates/me/self-declaration', data, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  return res.data;
}

export async function getCategories(
  bearerToken: string
): Promise<AssociateCategoryResponse[]> {
  const res = await api.get('/categories', {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  return res.data;
}

export async function createCategory(bearerToken: string, name: string) {
  const res = await api.post(
    '/categories',
    { name },
    {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    }
  );

  return res.data;
}

export async function deleteCategory(
  bearerToken: string,
  id: string
): Promise<string | null> {
  const res = await api.delete(`/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  switch (res.status) {
    case 400:
      return 'Categoria não existe ou está em uso';
    case 403:
      return 'Ocorreu um erro';
  }

  return null;
}

export async function getAssociateRegistrationForm(
  bearerToken: string,
  id: string
): Promise<Blob> {
  const res = await api.get(`/associates/${id}/registration-form`, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
    responseType: 'blob',
  });

  return res.data;
}
