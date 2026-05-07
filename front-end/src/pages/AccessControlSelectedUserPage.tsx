import AccessControlSelectedUserForm from '../components/AccessControlSelectedUserForm';
import { menuItems } from '../config/menuItems';
import MainLayout from '../layouts/MainLayout';

const AccessControlSelectedUserPage = () => (
  <MainLayout menuItems={menuItems} pageTitle="Perfil de Gestor">
    <AccessControlSelectedUserForm />
  </MainLayout>
);

export default AccessControlSelectedUserPage;
