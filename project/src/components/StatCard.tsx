import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  Icon: LucideIcon;
  className?: string;
}

const StatCard = ({ title, value, Icon, className = '' }: StatCardProps) => {
  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase">{title}</h3>
          <p className="text-2xl font-bold text-purple-800 mt-2">{value}</p>
        </div>
        <Icon className="text-purple-600" size={24} />
      </div>
    </div>
  );
};

export default StatCard;