import { jwtDecode, type JwtPayload } from 'jwt-decode';
import type { Role } from './roles';

interface JwtTokenPayload extends JwtPayload {
  sub: string;
  role: Role;
}

export function decodeJwt(token: string): JwtTokenPayload {
  const decoded = jwtDecode<JwtTokenPayload>(token);

  if (!decoded.sub) {
    throw new Error('Erro ao verificar o token');
  }

  return decoded;
}

type ExpJwtPayload = {
  exp: number;
};

export const isTokenExpired = (token: string) => {
  try {
    const decoded = jwtDecode<ExpJwtPayload>(token);

    return decoded.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};