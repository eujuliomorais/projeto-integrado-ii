import AccessControlProfileForm from '../components/AccessControlProfileForm';
import { superAdminItems } from '../config/sidebarItems/superAdminItems';
import MainLayout from '../layouts/MainLayout';

const AccessControlProfilePage = () => (
  <MainLayout menuItems={superAdminItems} pageTitle="Meu Perfil">
    <AccessControlProfileForm />
  </MainLayout>
);

export default AccessControlProfilePage;
