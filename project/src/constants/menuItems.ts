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

export const menuItems = [
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