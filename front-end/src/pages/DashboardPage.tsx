import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import { associateItems } from '../config/sidebarItems/associateItems';
import MainLayout from '../layouts/MainLayout';
import { decodeJwt } from '../services/auth/jwt.config';

import AssociateDashboard from '../components/Dashboards/AssociateDashboard';

const DashboardPage = () => {
  const { token } = useAuth();

  if (!token) {
    return null;
  }

  const user = decodeJwt(token);

  if (!user) {
    return null;
  }

  if (user.role === 'SUPER_ADMIN') {
    return <Navigate to="/controle-de-acesso" replace />;
  }

  if (user.role === 'ADMIN' || user.role === 'CONSULTANT') {
    return <Navigate to="/admin/associados" replace />;
  }

  return (
    <MainLayout menuItems={associateItems}>
      <AssociateDashboard />
    </MainLayout>
  );
};

export default DashboardPage;
