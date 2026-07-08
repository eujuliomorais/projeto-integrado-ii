import MyProfileForm from '../components/AdminProfileForm';
import { adminItems } from '../config/sidebarItems/adminItems';
import { consultantItems } from '../config/sidebarItems/consultantItems';
import { superAdminItems } from '../config/sidebarItems/superAdminItems';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../hooks/useAuth';
import { decodeJwt } from '../services/auth/jwt.config';
import type { SidebarItem } from '../components/Sidebar';

const AdminProfilePage = () => {
  return (
    <MainLayout pageTitle="Meu Perfil">
      <MyProfileForm />
    </MainLayout>
  );
};

export default AdminProfilePage;
