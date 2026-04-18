import React from 'react';
import Sidebar, { type MenuItem } from '../components/Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  menuItems: MenuItem[];
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, menuItems }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Menu lateral */}
      <Sidebar items={menuItems} />

      <div className="flex-1 flex flex-col">
        <header className="h-12 bg-transparent flex items-center justify-end px-4">
          {/* Implementação futura de usuário logado, atualmente 'invisivel' */}
        </header>

        {/* Container */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
