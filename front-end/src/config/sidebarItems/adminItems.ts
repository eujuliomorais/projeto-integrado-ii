import { PersonOutlined } from '@mui/icons-material';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import type { SidebarItem } from '../../components/Sidebar';

export const adminItems: SidebarItem[] = [
  {
    label: 'Associados',
    href: '/admin/associados',
    icon: GroupOutlinedIcon,
  },
  {
    label: 'Comunicação',
    href: '/admin/comunicacao',
    icon: MessageOutlinedIcon,
  },
  {
    label: 'Configurações',
    href: '/admin/configuracoes',
    icon: SettingsOutlinedIcon,
  },
  {
    label: 'Meu Perfil',
    href: '/admin/meu-perfil',
    icon: PersonOutlined,
  },
];
