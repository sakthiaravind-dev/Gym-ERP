import React from 'react';
import StatCard from './StatCardTop';
import { Link } from 'react-router-dom'; 
import { LucideIcon } from 'lucide-react';

interface Stat {
  title: string;
  value: string;
  Icon: LucideIcon;
  path: string;
}

interface StatGroupProps {
  stats: Stat[];
}

const StatGroup: React.FC<StatGroupProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      {stats.map((stat, index) => (
        <Link to={stat.path} key={index} className="block">
          <StatCard
            title={stat.title}
            value={stat.value}
            Icon={stat.Icon}
          />
        </Link>
      ))}
    </div>
  );
};

export default StatGroup;
