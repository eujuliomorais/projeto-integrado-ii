import CommunicationForm from '../components/CommunicationForm';
import { adminItems } from '../config/sidebarItems/adminItems';
import MainLayout from '../layouts/MainLayout';

const CommunicationPage = () => {
  return (
    <MainLayout menuItems={adminItems} pageTitle="Comunicação">
      <CommunicationForm />
    </MainLayout>
  );
};

export default CommunicationPage;
