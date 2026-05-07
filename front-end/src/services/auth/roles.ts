export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'CONSULTANT' | 'ASSOCIATE';

export const roleLabels: Record<Role, string> = {
  SUPER_ADMIN: 'Super Administrator',
  ADMIN: 'Administrator',
  CONSULTANT: 'Consultant',
  ASSOCIATE: 'Associate',
};
