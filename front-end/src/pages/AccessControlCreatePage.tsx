import AccessControlCreateForm from '../components/AccessControlCreateForm';
import { menuItems } from '../config/menuItems';
import MainLayout from '../layouts/MainLayout';

const AccessControlCreatePage = () => (
  <MainLayout menuItems={menuItems} pageTitle="Cadastro de novo acesso">
    <AccessControlCreateForm />
  </MainLayout>
);

export default AccessControlCreatePage;
