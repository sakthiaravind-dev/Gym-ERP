import React from 'react';
import TaskItem from './TaskItem';
import { followUpData } from '../../constants/followUpData';

const FollowUpTask: React.FC = () => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Follow-up Task</h2>
      <div className="grid grid-cols-4 gap-4">
        {followUpData.map((task, index) => (
          <TaskItem 
            key={index}
            {...task}
          />
        ))}
      </div>
    </div>
  );
};

export default FollowUpTask;