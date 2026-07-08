import AssociatesTable from '../components/AssociatesTable';
import { adminItems } from '../config/sidebarItems/adminItems';
import MainLayout from '../layouts/MainLayout';

const AssociatesTablePage = () => {
  return (
    <MainLayout pageTitle="Associados">
      <AssociatesTable />
    </MainLayout>
  );
};

export default AssociatesTablePage;
