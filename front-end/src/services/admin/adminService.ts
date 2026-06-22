import api from '../api';
import type { Associate } from '../associate/associate.types';

interface AdminFetchAssociatesRequest {
  bearerToken: string;
}

export async function adminFetchAssociates({
  bearerToken,
}: AdminFetchAssociatesRequest): Promise<Associate[]> {
  const res = await api.get('/admins/all-associates', {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  return res.data.content;
}
