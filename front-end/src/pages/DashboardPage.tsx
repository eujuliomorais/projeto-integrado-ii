// src/pages/DashboardPage.tsx

import { Typography } from '@mui/material';

import { useAuth } from '../hooks/useAuth';

import { adminItems } from '../config/sidebarItems/adminItems';
import { associateItems } from '../config/sidebarItems/associateItems';
import { consultantItems } from '../config/sidebarItems/consultantItems';
import { superAdminItems } from '../config/sidebarItems/superAdminItems';

import MainLayout from '../layouts/MainLayout';

const DashboardPage = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const menuItemsByRole = {
    SUPER_ADMIN: superAdminItems,
    ADMIN: adminItems,
    CONSULTANT: consultantItems,
    ASSOCIATE: associateItems,
  };

  const menuItems = menuItemsByRole[user.role];

  return (
    <MainLayout menuItems={menuItems}>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Bem-vindo, {user.name}
      </Typography>

      <Typography sx={{ mt: 2 }}>Perfil atual: {user.role}</Typography>
    </MainLayout>
  );
};

export default DashboardPage;
