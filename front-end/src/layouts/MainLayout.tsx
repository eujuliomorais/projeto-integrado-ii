import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import Sidebar, { type SidebarItem } from '../components/Sidebar';

const DRAWER_WIDTH = 224;

// Mock — substituir por contexto de autenticação
const ASSOCIATIONS = ['com Dom Maurício', 'Outra Associação'];

const AssociationMenu = () => {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [selected, setSelected] = useState(ASSOCIATIONS[0]);

  return (
    <>
      <Stack
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{ cursor: 'pointer', userSelect: 'none', alignItems: 'flex-end' }}
      >
        <Stack direction="row" sx={{ alignItems: 'center' }} spacing={0.5}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 600, lineHeight: 1 }}
          >
            Associação
          </Typography>
          <KeyboardArrowDownIcon
            sx={{ fontSize: 16, color: 'text.secondary' }}
          />
        </Stack>
        <Typography
          variant="body2"
          color="text.primary"
          sx={{ fontWeight: 700, lineHeight: 1.4 }}
        >
          {selected}
        </Typography>
      </Stack>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {ASSOCIATIONS.map((a) => (
          <MenuItem
            key={a}
            selected={a === selected}
            onClick={() => {
              setSelected(a);
              setAnchor(null);
            }}
          >
            {a}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

interface MainLayoutProps {
  children: React.ReactNode;
  menuItems: SidebarItem[];
  pageTitle?: string;
}

const MainLayout = ({ children, menuItems, pageTitle }: MainLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawer = <Sidebar items={menuItems} />;

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
          <AssociationMenu />
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

      {/* Content */}
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
          {/* Título da página no topbar */}
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
          <AssociationMenu />
        </Box>

        <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 } }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
