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

const MENU_ITEMS = [
  { label: 'Entrar como associado', href: '/login-associado' },
  { label: 'Entrar como administrador', href: '/login' },
  { label: 'Controle de acesso', href: '/login-controle' },
];

const Header = () => {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  const open = Boolean(anchor);

  const navigate = useNavigate();

  const location = useLocation();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            justifyContent: 'space-between',
            py: 1,
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
              src="/system-logo.png"
              alt="Grupo Cultural de Dom Maurício"
              sx={{
                height: {
                  xs: 42,
                  sm: 48,
                  md: 56,
                },

                width: 'auto',

                objectFit: 'contain',

                flexShrink: 0,
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
                color:
                  location.pathname === '/' ? 'primary.main' : 'text.secondary',

                fontWeight: location.pathname === '/' ? 700 : 600,

                textTransform: 'none',
                fontSize: 15,

                '&:hover': {
                  color: 'text.primary',
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
                color:
                  location.pathname === '/validate'
                    ? 'primary.main'
                    : 'text.secondary',

                fontWeight: location.pathname === '/validate' ? 700 : 600,

                textTransform: 'none',
                fontSize: 15,

                '&:hover': {
                  color: 'text.primary',
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
                color: open ? 'primary.main' : 'text.secondary',

                fontWeight: open ? 700 : 600,

                textTransform: 'none',
                fontSize: 15,

                '&:hover': {
                  color: 'text.primary',
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
