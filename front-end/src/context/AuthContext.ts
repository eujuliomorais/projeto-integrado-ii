import { createContext } from 'react';
import type { AuthUser } from '../services/auth/auth.types';

export interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuthData: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export const AuthContext = createContext({} as AuthContextType);
