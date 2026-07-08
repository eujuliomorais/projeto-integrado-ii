import api from './api';

export async function validateCard(number: string) {
  const res = await api.get(`/cards/validate?number=${number}`);
  return res.data;
}

export async function updateValidityDate(date: string, token: string) {
  const res = await api.put(
    `/cards/settings/validity?validityDate=${date}`,
    null,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
}

export async function getValidityDate(token: string) {
  try {
    const res = await api.get('/cards/settings/validity', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch {
    return '';
  }
}

export async function selfDownloadCard(token: string) {
  const res = await api.get(`/cards/me/download`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'blob',
  });

  return res.data;
}

export async function downloadCardById(id: string, token: string) {
  const res = await api.get(`/cards/${id}/download`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'blob',
  });

  return res.data;
}

export async function sendCardEmailById(id: string, token: string) {
  const res = await api.post(`/cards/${id}/send-email`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
}
