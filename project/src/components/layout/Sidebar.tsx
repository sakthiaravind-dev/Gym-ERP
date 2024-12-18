import React from 'react';
import { menuItems } from '../../constants/menuItems';
import SidebarItem from './SidebarItem';

const Sidebar: React.FC = () => {
  return (
    <div className="w-20 min-h-screen bg-[#4A0D4A] flex flex-col items-center py-4">
      <div className="mb-8">
        <h1 className="text-white font-bold text-xl">Gym+</h1>
      </div>
      <nav className="flex-1">
        {menuItems.map((item, index) => (
          <SidebarItem key={index} {...item} />
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;