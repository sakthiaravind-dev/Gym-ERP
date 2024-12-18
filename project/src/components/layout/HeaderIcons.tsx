import React from 'react';
import { Bell, BarChart2, Dumbbell, MessageCircle, User } from 'lucide-react';

const iconList = [
  { Icon: User, label: 'Profile' },
  { Icon: Bell, label: 'Notifications' },
  { Icon: MessageCircle, label: 'Messages' },
  { Icon: Dumbbell, label: 'Workouts' },
  { Icon: BarChart2, label: 'Statistics' }
];

const HeaderIcons: React.FC = () => {
  return (
    <div className="flex items-center space-x-4">
      {iconList.map(({ Icon, label }, index) => (
        <button
          key={index}
          className="p-2 hover:bg-gray-100 rounded-full"
          title={label}
        >
          <Icon size={20} className="text-purple-700" />
        </button>
      ))}
    </div>
  );
};

export default HeaderIcons;