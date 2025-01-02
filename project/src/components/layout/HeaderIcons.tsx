import React, { useState } from 'react';
import { Bell, BarChart2, Dumbbell, MessageCircle, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeaderIcons: React.FC = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const toggleMenu = (index: number) => {
    setActiveMenu(activeMenu === index ? null : index);
  };

  const iconList = [
    { Icon: User, label: 'Profile', path: '/profile' },
    { Icon: Bell, label: 'Notifications' },
    { Icon: MessageCircle, label: 'Messages' },
    {
      Icon: Dumbbell,
      label: 'Workouts',
      menuItems: [
        { label: 'Personal Diet', onClick: () => alert('Personal Diet selected!') },
        { label: 'Common Diet', onClick: () => alert('Common Diet selected!') },
        { label: 'Work-Out', onClick: () => navigate('/work-out') }, 
      ],
    },
    { Icon: BarChart2, label: 'Statistics' },
  ];

  return (
    <div className="flex items-center space-x-4 relative">
      {iconList.map(({ Icon, label, menuItems }, index) => (
        <div key={index} className="relative">
          <button
            onClick={() => menuItems ? toggleMenu(index) : undefined}
            className="p-2 hover:bg-gray-100 rounded-full"
            title={label}
          >
            <Icon size={20} className="text-purple-700" />
          </button>

          {menuItems && activeMenu === index && (
            <div className="absolute top-10 right-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <ul className="py-1">
                {menuItems.map((item, idx) => (
                  <li key={idx}>
                    <button
                      onClick={item.onClick}
                      className="block w-full text-left px-4 py-2 hover:bg-purple-100 text-gray-700"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default HeaderIcons;
