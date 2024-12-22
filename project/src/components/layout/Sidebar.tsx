import React from 'react';
import { menuItems } from '../../constants/menuItems';
import SidebarItem from './SidebarItem';

const Sidebar: React.FC = () => {
  return (
    <div className="relative top-0 left-0 w-20 min-h-screen bg-gradient-to-b from-pink-900 to-indigo-900 p-4  flex flex-col items-center space-y py-4">
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