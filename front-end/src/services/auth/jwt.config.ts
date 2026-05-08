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
