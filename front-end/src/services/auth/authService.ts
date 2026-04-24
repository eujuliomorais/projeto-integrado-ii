import api from '../api';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

// export async function forgotPassword(email: string) {
//   const res = await api.post('/auth/forgot-password', { email });
//   return res.data;
// }

// export async function resetPassword(token: string, newPassword: string) {
//   const res = await api.post('/auth/reset-password', { token, newPassword });
//   return res.data;
// }

export async function login({
  email,
  password,
}: LoginRequest): Promise<LoginResponse> {
  const res = await api.post('/auth/login', { email, password });
  // console.log(res.data);
  return res.data;
}

export function logout() {
  localStorage.removeItem('token');
}