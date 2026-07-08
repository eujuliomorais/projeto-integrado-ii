import AccessControlSelectedUserForm from '../components/AccessControlSelectedUserForm';
import { superAdminItems } from '../config/sidebarItems/superAdminItems';import MainLayout from '../layouts/MainLayout';

const AccessControlSelectedUserPage = () => (
  <MainLayout menuItems={superAdminItems} pageTitle="Perfil de Gestor">
    <AccessControlSelectedUserForm />
  </MainLayout>
);

export default AccessControlSelectedUserPage;
