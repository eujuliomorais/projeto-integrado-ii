import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import {
  AppBar,
  Box,
  Button,
  Container,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';

import { useState } from 'react';

import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo-deles.svg';

const MENU_ITEMS = [
  { label: 'Entrar como associado', href: '/login-associado' },
  { label: 'Gerenciar Associados', href: '/login' },
  { label: 'Controle de acesso', href: '/login-controle' },
];

interface HeaderProps {
  transparent?: boolean;
}

const Header = ({ transparent = false }: HeaderProps) => {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  const open = Boolean(anchor);

  const navigate = useNavigate();

  const location = useLocation();

  return (
    <AppBar
      position={transparent ? 'absolute' : 'static'}
      elevation={0}
      sx={{
        bgcolor: transparent ? 'transparent' : 'background.paper',
        boxShadow: transparent ? 'none' : '0 2px 12px rgba(0,0,0,0.08)',
        zIndex: 1100,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            justifyContent: 'space-between',
            py: { xs: 2, md: 3 },
          }}
        >
          {/* Logo */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <Box
              component="img"
              src={Logo}
              alt="Grupo Cultural de Dom Maurício"
              sx={{
                height: {
                  xs: 50,
                  sm: 60,
                  md: 80,
                },

                width: 'auto',

                objectFit: 'contain',

                flexShrink: 0,
                
                filter: transparent ? 'drop-shadow(0px 0px 8px rgba(255, 255, 255, 0.8))' : 'none',
              }}
            />
          </Box>

          {/* Navegação */}
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            {/* Início */}
            <Button
              component={RouterLink}
              to="/"
              sx={{
                color: location.pathname === '/'
                  ? 'primary.main'
                  : transparent
                    ? 'rgba(255,255,255,0.9)'
                    : 'text.secondary',

                fontWeight: location.pathname === '/' ? 700 : 600,

                textTransform: 'none',
                fontSize: 15,

                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              Início
            </Button>

            {/* Validar Carteirinha */}
            <Button
              component={RouterLink}
              to="/validate"
              sx={{
                color: location.pathname === '/validate'
                  ? 'primary.main'
                  : transparent
                    ? 'rgba(255,255,255,0.9)'
                    : 'text.secondary',

                fontWeight: location.pathname === '/validate' ? 700 : 600,

                textTransform: 'none',
                fontSize: 15,

                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              Validar Carteirinha
            </Button>

            {/* Entrar */}
            <Button
              endIcon={
                open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
              }
              onClick={(e) => setAnchor(e.currentTarget)}
              sx={{
                color: transparent
                  ? 'rgba(255,255,255,0.9)'
                  : open
                    ? 'primary.main'
                    : 'text.secondary',

                fontWeight: open ? 700 : 600,

                textTransform: 'none',
                fontSize: 15,

                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              Entrar
            </Button>

            {/* Dropdown */}
            <Menu
              anchorEl={anchor}
              open={open}
              onClose={() => setAnchor(null)}
              transformOrigin={{
                horizontal: 'right',
                vertical: 'top',
              }}
              anchorOrigin={{
                horizontal: 'right',
                vertical: 'bottom',
              }}
              slotProps={{
                paper: {
                  elevation: 3,
                  sx: {
                    borderRadius: 2,
                    minWidth: 230,
                    mt: 0.5,
                  },
                },
              }}
            >
              {MENU_ITEMS.map((item, idx) => (
                <MenuItem
                  key={item.href}
                  onClick={() => {
                    setAnchor(null);
                    navigate(item.href);
                  }}
                  sx={{
                    py: 1.5,
                    px: 2.5,

                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',

                    borderTop: idx === 0 ? 'none' : '1px solid',

                    borderColor: 'divider',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: 'text.secondary',
                    }}
                  >
                    {item.label}
                  </Typography>

                  <NavigateNextIcon
                    sx={{
                      fontSize: 18,
                      color: 'text.disabled',
                    }}
                  />
                </MenuItem>
              ))}
            </Menu>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
