import React, { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import { fetchFollowUpData } from '../../constants/followUpData';

const FollowUpTask: React.FC = () => {
  interface Task {
    title: string;
    count: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: { name: any; id: any; }[];
  }

  const [followUpData, setFollowUpData] = useState<Task[]>([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchFollowUpData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const normalizedData = data.map((task: any) => ({
        ...task,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items: task.items.map((item: any) => ({
          name: item.name || item.member_name,
          id: item.id || item.emp_id || item.member_id,
        })),
      }));
      setFollowUpData(normalizedData);
    };

    getData();
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Follow-up Task</h2>
      <div className="grid grid-cols-4 gap-4">
        {followUpData.map((task, index) => (
          <TaskItem 
            onViewMore={function (): void {
              throw new Error('Function not implemented.');
            } } key={index}
            {...task}          />
        ))}
      </div>
    </div>
  );
};

export default FollowUpTask;