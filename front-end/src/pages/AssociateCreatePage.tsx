import AssociateCreateForm from '../components/AssociateCreateForm';
import { adminItems } from '../config/sidebarItems/adminItems';
import MainLayout from '../layouts/MainLayout';

const AssociateCreatePage = () => {
  return (
    <MainLayout pageTitle="Cadastro de Associados">
      <AssociateCreateForm />
    </MainLayout>
  );
};

export default AssociateCreatePage;
