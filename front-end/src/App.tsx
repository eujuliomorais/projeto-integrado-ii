import { menuItems } from './config/menuItems';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <MainLayout menuItems={menuItems}>
      <h1 className="text-2xl font-bold text-gray-800">
        Sistema de emissão de carteirinha
      </h1>
      <p className="mt-2 text-gray-600">conteúdo da tela.</p>
    </MainLayout>
  );
}

export default App;
