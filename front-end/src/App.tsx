import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import AccessControlLoginPage from './pages/AccessControlLoginPage';
import AssociateLoginPage from './pages/AssociateLoginPage';
import ComingSoonPage from './pages/ComingSoonPage';
import DashboardPage from './pages/DashboardPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import TokenPage from './pages/TokenPage';
import PrivateRoute from './routes/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route path="/login-associado" element={<AssociateLoginPage />} />
          <Route path="/token-associado" element={<TokenPage />} />

          <Route path="/login-controle" element={<AccessControlLoginPage />} />

            <Route path="/dashboard" element={<DashboardPage />} />
          {/* Privadas */}
          <Route element={<PrivateRoute />}>

            <Route path="/settings" element={<ComingSoonPage />} />
            <Route path="/reports" element={<ComingSoonPage />} />
            <Route path="/users" element={<ComingSoonPage />} />
            <Route path="/membership-card" element={<ComingSoonPage />} />
          </Route>

          {/* Não implementadas */}
          <Route path="/" element={<ComingSoonPage />} />

          {/* Inexistentes */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
