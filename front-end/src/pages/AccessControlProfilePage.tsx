import AccessControlProfileForm from '../components/AccessControlProfileForm';
import { menuItems } from '../config/menuItems';
import MainLayout from '../layouts/MainLayout';

const AccessControlProfilePage = () => (
  <MainLayout menuItems={menuItems} pageTitle="Meu Perfil">
    <AccessControlProfileForm />
  </MainLayout>
);

export default AccessControlProfilePage;
