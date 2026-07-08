import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { default as AccessControlCreatePage } from './pages/AccessControlCreatePage';
import AccessControlLoginPage from './pages/AccessControlLoginPage';
import AccessControlProfilePage from './pages/AccessControlProfilePage';
import AccessControlSelectedUserPage from './pages/AccessControlSelectedUserPage';
import { default as AccessControlTablePage } from './pages/AccessControlTablePage';
import AdminProfilePage from './pages/AdminProfilePage';
import AdminTokenResetPage from './pages/AdminTokenResetPage';
import AssociateCreatePage from './pages/AssociateCreatePage';
import AssociateLoginPage from './pages/AssociateLoginPage';
import AssociateProfilePage from './pages/AssociateProfilePage';
import AssociateSelfSupplementPage from './pages/AssociateSelfSupplementPage';
import AssociatesTablePage from './pages/AssociatesTablePage';
import CommunicationPage from './pages/CommunicationPage';
import DashboardPage from './pages/DashboardPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LandingPage from './pages/LandingPage';
import LandingValidatePage from './pages/LandingValidatePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SettingsPage from './pages/SettingsPage';
import TokenPage from './pages/TokenPage';
import PrivateRoute from './routes/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/validate" element={<LandingValidatePage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/insert-token" element={<AdminTokenResetPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route path="/login-associado" element={<AssociateLoginPage />} />
          <Route path="/token-associado" element={<TokenPage />} />

          <Route path="/login-controle" element={<AccessControlLoginPage />} />

          {/* Privadas */}
          {/* Controle de acesso */}
          <Route element={<PrivateRoute allowedRoles={['SUPER_ADMIN']} />}>
            <Route
              path="/controle-de-acesso"
              element={<AccessControlTablePage />}
            />
            <Route
              path="/controle-de-acesso/novo"
              element={<AccessControlCreatePage />}
            />
            <Route
              path="/controle-de-acesso/:id"
              element={<AccessControlSelectedUserPage />}
            />
            <Route
              path="/controle-de-acesso/meu-perfil"
              element={<AccessControlProfilePage />}
            />
          </Route>

          {/* Administradores e Consultores */}
          <Route
            element={<PrivateRoute allowedRoles={['ADMIN', 'CONSULTANT']} />}
          >
            <Route path="/admin/associados" element={<AssociatesTablePage />} />
            <Route
              path="/admin/associados/novo"
              element={<AssociateCreatePage />}
            />
            <Route
              path="/admin/associados/:id"
              element={<AssociateProfilePage />}
            />
            <Route path="/admin/comunicacao" element={<CommunicationPage />} />
            <Route path="/admin/configuracoes" element={<SettingsPage />} />
            <Route path="/admin/meu-perfil" element={<AdminProfilePage />} />
          </Route>

          {/* Associados */}
          <Route element={<PrivateRoute allowedRoles={['ASSOCIATE']} />}>
            <Route path="/associado/dashboard" element={<DashboardPage />} />
            <Route
              path="/associado/meu-cadastro"
              element={<AssociateSelfSupplementPage />}
            />
          </Route>

          {/* Inexistentes */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
