import api from './api';

export async function validateCard(code: string) {
  const res = await api.post('/cards/validate', { code });
  return res.data;
}
