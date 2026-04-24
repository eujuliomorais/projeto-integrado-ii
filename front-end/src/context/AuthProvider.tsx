import { useState } from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const setAuthToken = (token: string) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        setAuthToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
