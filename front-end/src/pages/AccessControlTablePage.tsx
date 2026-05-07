import AccessControlSearchTable from '../components/AccessControlSearchTable';
import { superAdminItems } from '../config/sidebarItems/superAdminItems';
import MainLayout from '../layouts/MainLayout';

const AccessControlTablePage = () => (
  <MainLayout menuItems={superAdminItems} pageTitle="Controle de Acesso">
    <AccessControlSearchTable />
  </MainLayout>
);

export default AccessControlTablePage;
