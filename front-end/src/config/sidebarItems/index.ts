import type { SidebarItem } from '../../components/Sidebar';
import type { Role } from '../../services/auth/roles';

import { adminItems } from './adminItems';
import { associateItems } from './associateItems';
import { consultantItems } from './consultantItems';
import { superAdminItems } from './superAdminItems';

export const itemsByRole: Record<Role, SidebarItem[]> = {
  SUPER_ADMIN: superAdminItems,
  ADMIN: adminItems,
  CONSULTANT: consultantItems,
  ASSOCIATE: associateItems,
};
