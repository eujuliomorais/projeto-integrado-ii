import AccessControlSearchTable from '../components/AccessControlSearchTable';
import { menuItems } from '../config/menuItems';
import MainLayout from '../layouts/MainLayout';

const AccessControlTablePage = () => (
  <MainLayout menuItems={menuItems} pageTitle="Controle de Acesso">
    <AccessControlSearchTable />
  </MainLayout>
);

export default AccessControlTablePage;
