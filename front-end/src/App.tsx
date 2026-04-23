import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </BrowserRouter>
    // <MainLayout menuItems={menuItems}>
    //   <h1 className="text-2xl font-bold text-gray-800">
    //     Sistema de emissão de carteirinha
    //   </h1>
    //   <p className="mt-2 text-gray-600">conteúdo da tela.</p>
    // </MainLayout>
  );
}

export default App;
