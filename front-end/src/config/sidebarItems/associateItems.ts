import { Home, Person } from '@mui/icons-material';
import type { SidebarItem } from '../../components/Sidebar';

export const associateItems: SidebarItem[] = [
  {
    label: 'Inicio',
    href: '/associado/dashboard',
    icon: Home,
  },
  {
    label: 'Meu Cadastro',
    href: '/associado/meu-cadastro',
    icon: Person,
  },
];
