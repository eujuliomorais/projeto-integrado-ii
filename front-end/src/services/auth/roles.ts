export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'CONSULTANT' | 'ASSOCIATE';

export const roleLabels: Record<Role, string> = {
  SUPER_ADMIN: 'Super Administrator',
  ADMIN: 'Administrator',
  CONSULTANT: 'Consultant',
  ASSOCIATE: 'Associate',
};

export const normalizeRoleView = (role: Role) => {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'Controle de Acesso';
    case 'ADMIN':
      return 'Administrador';
    case 'ASSOCIATE':
      return 'Associado';
    case 'CONSULTANT':
      return 'Consultor';
  }
};
