import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';

import type { ElementType } from 'react';

import { Link, useLocation } from 'react-router-dom';
import LogoCinza from '../assets/logo-cinza.svg';
export interface SidebarItem {
  label: string;
  href: string;
  icon?: ElementType;
}

interface SidebarProps {
  items: SidebarItem[];
}

const Sidebar = ({ items }: SidebarProps) => {
  const { pathname } = useLocation();

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      <Toolbar sx={{ display: { xs: 'block', md: 'none' } }} />
      {/* Top Logo (Desktop Only) */}
      <Box
        component={Link}
        to="/associado/dashboard"
        sx={{
          pt: 4,
          pb: 3,
          pl: 2,
          pr: 1,
          display: { xs: 'none', md: 'block' },
          textDecoration: 'none',
        }}
      >
        <Box
          component="img"
          src={LogoCinza}
          alt="Logo SIGA"
          sx={{
            height: 90,
            width: '100%',
            objectFit: 'contain',
            objectPosition: 'left center',
          }}
        />
      </Box>

      {/* Menu */}
      <List sx={{ pt: 1, px: 1 }}>
        {items.map((item) => {
          const active = pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <ListItemButton
              key={item.href}
              component={Link}
              to={item.href}
              selected={active}
              sx={{
                borderRadius: 1.5,
                mb: 0.5,

                borderLeft: '3px solid',

                borderColor: active ? 'primary.main' : 'transparent',

                '&.Mui-selected': {
                  bgcolor: 'custom.orange.light30',

                  '&:hover': {
                    bgcolor: 'custom.orange.light30',
                  },
                },

                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            >
              {Icon && (
                <ListItemIcon
                  sx={{
                    minWidth: 36,

                    color: active ? 'primary.main' : 'text.secondary',
                  }}
                >
                  <Icon />
                </ListItemIcon>
              )}

              <ListItemText
                primary={item.label}
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: 14,
                      fontWeight: active ? 700 : 500,

                      color: active ? 'primary.main' : 'text.secondary',
                    },
                  },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* Bottom Logo*/}
      <Box
        component={Link}
        to="/associado/dashboard"
        sx={{
          mt: 'auto',
          p: 3,
          display: { xs: 'flex', md: 'none' },
          justifyContent: 'center',
          textDecoration: 'none',
        }}
      >
        <Box
          component="img"
          src={LogoCinza}
          alt="Logo SIGA"
          sx={{
            height: 100,
            width: 'auto',
            objectFit: 'contain',
          }}
        />
      </Box>
    </Box>
  );
};

export default Sidebar;
