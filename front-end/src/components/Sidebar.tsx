import React from 'react';

export interface MenuItem {
  label: string;
  href: string;
}

interface SidebarProps {
  items: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  return (
    <aside className="w-64 bg-white shadow-md">
      <nav className="flex flex-col p-4 space-y-2">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="text-gray-700 hover:bg-gray-200 p-2 rounded"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
