import React from 'react';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  LineChart, 
  DollarSign,
  Users,
  UserCog,
  Star,
  Settings,
  UserPlus,
  ClipboardList,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: CalendarCheck, label: 'Bookings', path: '/bookings' },
  { icon: LineChart, label: 'Reports', path: '/reports' },
  { icon: DollarSign, label: 'Transactions', path: '/transactions' },
  { icon: Users, label: 'Members', path: '/members' },
  { icon: UserCog, label: 'Staff', path: '/staff' },
  { icon: Star, label: 'Ratings', path: '/ratings' },
  { icon: Settings, label: 'Admin', path: '/admin' },
  { icon: UserPlus, label: 'Leads', path: '/leads' },
  { icon: ClipboardList, label: 'Attendance', path: '/attendance' },
  { icon: Clock, label: 'Employee', path: '/employee' },
];

const Sidebar = () => {
  return (
    <div className="w-20 min-h-screen bg-gradient-to-b from-darkRed via-darkRed/10 to-vibrantPink h-screen flex flex-col items-center py-4">
      <div className="mb-8">
        <h1 className="text-white font-bold text-xl">Gym+</h1>
      </div>
      <nav className="flex-1">
        {menuItems.map((item, index) => (
          <Link
            to={item.path}
            key={index}
            className="flex flex-col items-center justify-center p-4 text-white hover:bg-[#6B206B] cursor-pointer"
          >
            <item.icon size={20} />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
