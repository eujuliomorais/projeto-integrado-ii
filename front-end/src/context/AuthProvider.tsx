import { useEffect, useMemo, useState } from 'react';

import type { AuthUser } from '../services/auth/auth.types';
import { isTokenExpired } from '../services/auth/jwt.config';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem('token');

    if (!storedToken) {
      return null;
    }

    if (isTokenExpired(storedToken)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }

    return storedToken;
  });

  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      return null;
    }

    const storedToken = localStorage.getItem('token');

    if (!storedToken || isTokenExpired(storedToken)) {
      localStorage.removeItem('user');
      return null;
    }

    return JSON.parse(storedUser);
  });

  const setAuthToken = (token: string) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const setAuthUser = (user: AuthUser) => {
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const removeAuthUser = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const removeAuthToken = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    const checkToken = () => {
      if (isTokenExpired(token)) {
        logout();
      }
    };

    checkToken();
  }, [token]);

  const isAuthenticated = token !== null && !isTokenExpired(token);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated,
      setAuthToken,
      setAuthUser,
      removeAuthToken,
      removeAuthUser,
      logout,
    }),
    [token, user, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
