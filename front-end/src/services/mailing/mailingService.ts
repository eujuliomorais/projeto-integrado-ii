import api from '../api';

export type MailingRecipientScope = 'ALL' | 'ASSOCIATES' | 'ADMINS_AND_CONSULTANTS';

export interface MailingRecipient {
  id: string;
  name: string;
  email: string;
}

export interface SendMailingPayload {
  subject: string;
  message: string;
  emails: string[];
}

export interface MailingSentResponse {
  message: string;
  sentCount: number;
}

export async function getMailingRecipients(
  token: string,
  scope: MailingRecipientScope
): Promise<MailingRecipient[]> {
  const res = await api.get<MailingRecipient[]>('/mailing/recipients', {
    headers: { Authorization: `Bearer ${token}` },
    params: { scope },
  });
  return res.data;
}

export async function sendMailing(
  token: string,
  payload: SendMailingPayload
): Promise<MailingSentResponse> {
  const res = await api.post<MailingSentResponse>('/mailing/send', payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updateBirthdayTemplate(
  token: string,
  message: string
): Promise<string> {
  const res = await api.post<string>(
    '/mailing/birthday-template',
    { message },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}

export async function getBirthdayTemplate(token: string): Promise<string> {
  const res = await api.get<{ message: string }>('/mailing/birthday-template', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.message;
}
