import AssociateSelfSupplementForm from '../components/AssociateSelfSupplementForm';
import { associateItems } from '../config/sidebarItems/associateItems';
import MainLayout from '../layouts/MainLayout';

const AssociateSelfSupplementPage = () => (
  <MainLayout menuItems={associateItems} pageTitle="Meu Cadastro">
    <AssociateSelfSupplementForm />
  </MainLayout>
);

export default AssociateSelfSupplementPage;
