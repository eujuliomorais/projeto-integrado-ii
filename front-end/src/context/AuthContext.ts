import { createContext } from 'react';
import type { AuthUser } from '../services/auth/auth.types';

export interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuthToken: (token: string) => void;
  setAuthUser: (user: AuthUser) => void;
  removeAuthToken: () => void;
  removeAuthUser: () => void;
  logout: () => void;
}

export const AuthContext = createContext({} as AuthContextType);
