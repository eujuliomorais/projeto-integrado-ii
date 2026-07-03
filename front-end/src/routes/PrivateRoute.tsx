import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { decodeJwt } from '../services/auth/jwt.config';
import type { Role } from '../services/auth/roles';

const redirectByRole: Record<Role, string> = {
  SUPER_ADMIN: '/controle-de-acesso',
  ADMIN: '/admin/associados',
  CONSULTANT: '/admin/associados',
  ASSOCIATE: '/associado/dashboard',
};

interface PrivateRouteProps {
  allowedRoles?: Role[];
}

const PrivateRoute = ({ allowedRoles }: PrivateRouteProps) => {
  const { isAuthenticated, token, logout } = useAuth();

  if (!isAuthenticated || !token) {
    logout();
    return <Navigate to="/" replace />;
  }

  let role: Role;

  try {
    role = decodeJwt(token).role;
  } catch {
    logout();
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={redirectByRole[role]} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
