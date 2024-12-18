import React from 'react';
import StatCard from './StatCard';
import { LucideIcon } from 'lucide-react';

interface Stat {
  title: string;
  value: string;
  Icon: LucideIcon;
}

interface StatGroupProps {
  stats: Stat[];
}

const StatGroup: React.FC<StatGroupProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          Icon={stat.Icon}
        />
      ))}
    </div>
  );
};

export default StatGroup;