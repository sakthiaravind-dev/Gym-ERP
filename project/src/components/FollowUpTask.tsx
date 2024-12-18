import React from 'react';
import { Edit } from 'lucide-react';

interface TaskItemProps {
  title: string;
  count: number;
  items: Array<{ name: string; id: string }>;
}

const TaskItem = ({ title, count, items }: TaskItemProps) => {
  return (
    <div className="flex-1 bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-purple-800 font-semibold">{title} ({count})</h3>
        <Edit size={16} className="text-gray-400" />
      </div>
      {items.length > 0 ? (
        items.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2">
            <span className="text-gray-700">{item.name}</span>
            <span className="text-gray-500 text-sm">{item.id}</span>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center py-4">No {title.toLowerCase()} left today</p>
      )}
      <button className="text-purple-600 text-sm mt-4">View More</button>
    </div>
  );
};

const FollowUpTask = () => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Follow-up Task</h2>
      <div className="grid grid-cols-4 gap-4">
        <TaskItem 
          title="Inquiry" 
          count={0}
          items={[]}
        />
        <TaskItem 
          title="Fees Pending" 
          count={167}
          items={[{ name: "SUDHARSHAN M S", id: "9500335340" }]}
        />
        <TaskItem 
          title="Membership Expiring" 
          count={113}
          items={[{ name: "PRITHIV", id: "9629282932" }]}
        />
        <TaskItem 
          title="Birthday" 
          count={171}
          items={[{ name: "DURAI SHANKER", id: "25/12/1965" }]}
        />
      </div>
    </div>
  );
};

export default FollowUpTask;