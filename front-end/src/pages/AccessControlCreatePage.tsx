import AccessControlCreateForm from '../components/AccessControlCreateForm';
import { superAdminItems } from '../config/sidebarItems/superAdminItems';
import MainLayout from '../layouts/MainLayout';

const AccessControlCreatePage = () => (
  <MainLayout menuItems={superAdminItems} pageTitle="Cadastro de novo acesso">
    <AccessControlCreateForm />
  </MainLayout>
);

export default AccessControlCreatePage;
