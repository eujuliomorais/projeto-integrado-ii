import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar, { type SidebarItem } from '../components/Sidebar';
import { adminItems } from '../config/sidebarItems/adminItems';
import { associateItems } from '../config/sidebarItems/associateItems';
import { consultantItems } from '../config/sidebarItems/consultantItems';
import { superAdminItems } from '../config/sidebarItems/superAdminItems';
import { useAuth } from '../hooks/useAuth';
import { api_base_url } from '../services/api';
import { getCategories } from '../services/associate/associateService';
import { authGetProfile } from '../services/auth/authService';
import { decodeJwt } from '../services/auth/jwt.config';
import { normalizeRoleView } from '../services/auth/roles';
import { getValidityDate } from '../services/cardService';
import { getAvatar } from '../services/user/imageService';

const DRAWER_WIDTH = 224;

const UserMenu = () => {
  const { logout, token } = useAuth();
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('');
  const [rawRole, setRawRole] = useState('');

  const [userAvatar, setUserAvatar] = useState('');

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        if (!token) {
          logout();
          return;
        }

        const user = await authGetProfile({ token });

        if (!user) {
          logout();
          return;
        }

        const { id } = user;

        if (!id) {
          logout();
          return;
        }

        let avatarUrl;
        try {
          avatarUrl = await getAvatar({ token, id });
        } catch {
          avatarUrl = '';
        } finally {
          setUserAvatar(avatarUrl ? `${api_base_url}${avatarUrl}` : '');
        }

        setDisplayName(
          rawRole === 'SUPER_ADMIN'
            ? 'Grupo Cultural Dom Maurício'
            : (user.name?.split(' ')[0] ?? 'Usuário')
        );
        setRole(normalizeRoleView(user.role));
        setRawRole(user.role);
      } catch {
        logout();
      }
    };

    loadUserInfo();
  }, [token, logout, rawRole]);

  const handleLogout = () => {
    setAnchor(null);
    logout();
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={1.5}
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{ cursor: 'pointer', userSelect: 'none', alignItems: 'center' }}
      >
        <Avatar
          src={userAvatar}
          sx={{
            width: 38,
            height: 38,
            bgcolor: 'primary.main',
          }}
        >
          {/* Removida a condicional e ajustado o tamanho para 24 */}
          <PersonOutlineIcon sx={{ fontSize: 24, color: '#ffffff' }} />
        </Avatar>
        <Stack sx={{ display: { xs: 'none', sm: 'flex' } }}>
          <Typography
            variant="body2"
            color="text.primary"
            sx={{ fontWeight: 700, lineHeight: 1.2 }}
          >
            {displayName}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ lineHeight: 1.2 }}
          >
            {role}
          </Typography>
        </Stack>
        <KeyboardArrowDownIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
      </Stack>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: { sx: { borderRadius: 2, minWidth: 160, mt: 0.5 } },
        }}
      >
        <MenuItem
          onClick={() => {
            setAnchor(null);
            if (rawRole === 'ASSOCIATE') {
              navigate('/associado/meu-cadastro');
            } else if (rawRole === 'CONSULTANT' || rawRole === 'ADMIN') {
              navigate('/admin/meu-perfil');
            } else if (rawRole === 'SUPER_ADMIN') {
              navigate('/controle-de-acesso/meu-perfil');
            }
          }}
        >
          Meu Perfil
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          Sair
        </MenuItem>
      </Menu>
    </>
  );
};

interface MainLayoutProps {
  children: React.ReactNode;
  menuItems?: SidebarItem[];
  pageTitle?: string;
}

const MainLayout = ({ children, menuItems, pageTitle }: MainLayoutProps) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [missingValidityDate, setMissingValidityDate] = useState(false);
  const [missingCategories, setMissingCategories] = useState(false);

  let activeItems: SidebarItem[] = [];
  let userRole = '';

  if (menuItems) {
    activeItems = menuItems;
  } else if (token) {
    const user = decodeJwt(token);
    userRole = user?.role || '';

    if (user?.role === 'SUPER_ADMIN') {
      activeItems = superAdminItems;
    } else if (user?.role === 'CONSULTANT') {
      activeItems = consultantItems;
    } else if (user?.role === 'ASSOCIATE') {
      activeItems = associateItems;
    } else if (user?.role === 'ADMIN') {
      activeItems = adminItems;
    } else {
      activeItems = [];
    }
  }

  useEffect(() => {
    const checkSystemSettings = async () => {
      if (token && (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN')) {
        // Valida a Data
        try {
          const date = await getValidityDate(token);
          setMissingValidityDate(!date);
        } catch (error) {
          console.error('Erro ao verificar data de validade:', error);
        }

        // Valida as Categorias
        try {
          const categories = await getCategories(token);
          // Se não retornar nada uo se o array vier vazio (length === 0)
          setMissingCategories(!categories || categories.length === 0);
        } catch (error) {
          console.error('Erro ao verificar categorias:', error);
        }
      }
    };

    checkSystemSettings();
  }, [token, userRole]);

  const drawer = <Sidebar items={activeItems} />;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Mobile AppBar */}
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          display: { sm: 'none' },
          bgcolor: 'background.paper',
          color: 'text.primary',
          zIndex: (t) => t.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton onClick={() => setMobileOpen(true)} edge="start">
            <MenuIcon />
          </IconButton>
          {pageTitle && (
            <Typography variant="h6" sx={{ flex: 1, ml: 1, fontWeight: 700 }}>
              {pageTitle}
            </Typography>
          )}
          <UserMenu />
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop permanent drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            border: 'none',
            boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* CONTEÚDO PRINCIPAL */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          overflow: 'auto',
          pt: { xs: '56px', sm: 0 },
        }}
      >
        {/* Desktop top bar */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 4,
            py: 1.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          {pageTitle ? (
            <Typography
              variant="h5"
              sx={{ fontWeight: 700 }}
              color="text.primary"
            >
              {pageTitle}
            </Typography>
          ) : (
            <Box />
          )}
          <UserMenu />
        </Box>

        {/* CONTAINER DOS ALERTAS E DA PÁGINA */}
        <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 } }}>
          {/* BANNER DE AVISO - DATA DE VALIDADE */}
          {missingValidityDate && (
            <Alert
              severity="warning"
              icon={<WarningAmberIcon />}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => navigate('/admin/configuracoes')}
                >
                  Configurar
                </Button>
              }
              sx={{ mb: 3, borderRadius: 2, alignItems: 'center' }}
            >
              <strong>Atenção:</strong> A Data de Validade Anual não foi
              definida. O cadastro de novos associados está bloqueado até que a
              configuração seja feita.
            </Alert>
          )}

          {/* BANNER DE AVISO - CATEGORIAS */}
          {missingCategories && (
            <Alert
              severity="warning"
              icon={<WarningAmberIcon />}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => navigate('/admin/configuracoes')}
                >
                  Configurar
                </Button>
              }
              sx={{ mb: 3, borderRadius: 2, alignItems: 'center' }}
            >
              <strong>Atenção:</strong> Nenhuma categoria de cadastro foi
              definida. O cadastro de novos associados está bloqueado até que ao
              menos uma seja adicionada.
            </Alert>
          )}

          {/* Renderiza as páginas aqui dentro */}
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
