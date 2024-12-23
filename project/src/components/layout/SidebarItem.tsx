import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  path: string; // Add path to the props
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, path }) => {
  return (
    <Link
      to={path} // Use path for navigation
      className="flex flex-col items-center justify-center p-4 text-white hover:bg-[#6B206B] cursor-pointer"
    >
      <Icon size={20} />
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
};

export default SidebarItem;
