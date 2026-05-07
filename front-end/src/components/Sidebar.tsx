import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import type { ElementType } from 'react';

import { Link, useLocation } from 'react-router-dom';

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
      {/* Logo */}
      <Box
        sx={{
          p: 2.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          component="img"
          src="/grey-cultural-group-logo.png"
          alt="Logotipo Cinza do Grupo Cultural"
          sx={{
            width: '100%',
            maxHeight: 72,
            objectFit: 'contain',
          }}
        />
      </Box>

      {/* Menu */}
      <List sx={{ pt: 1.5, px: 1 }}>
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
    </Box>
  );
};

export default Sidebar;
