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
  { icon: LayoutDashboard, label: 'Dashboard', path:'/profile' },
  { icon: CalendarCheck, label: 'Bookings', path:'/addmember'},
  { icon: LineChart, label: 'Reports', path:'/addstaff'},
  { icon: DollarSign, label: 'Transactions', path:'/addlead'},
  { icon: Users, label: 'Members', path:'/transaction'},
  { icon: UserCog, label: 'Staff', path:'/profile'},
  { icon: Star, label: 'Ratings', path:'/profile'},
  { icon: Settings, label: 'Admin', path:'/profile'},
  { icon: UserPlus, label: 'Leads', path:'/profile'},
  { icon: ClipboardList, label: 'Attendance', path:'/profile'},
  { icon: Clock, label: 'Employee', path:'/profile'},
];

const Sidebar = () => {
  return (
    <div className="w-20 min-h-screen h-screen flex flex-col items-center py-4">
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
