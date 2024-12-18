import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-white hover:bg-[#6B206B] cursor-pointer">
      <Icon size={20} />
      <span className="text-xs mt-1">{label}</span>
    </div>
  );
};

export default SidebarItem;