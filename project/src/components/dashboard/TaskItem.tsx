/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Edit } from 'lucide-react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';

interface TaskItemProps {
  title: string;
  count: number;
  items: Array<{ name: string; id: string }>;
  onViewMore: () => void;
  onRedirect: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ title, count, items, onViewMore, onRedirect }) => {
  return (
    <div className="flex-1 bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-purple-800 font-semibold">{title} ({count})</h3>
        <Edit size={16} className="text-gray-400" />
      </div>
      {items.length > 0 ? (
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-700">{items[0].name}</span>
          <span className="text-gray-500 text-sm">{items[0].id}</span>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No {title.toLowerCase()} left today</p>
      )}
      <button className="text-purple-600 text-sm mt-4" onClick={onViewMore}>View More</button>
      <button className="text-purple-600 text-sm mt-4" onClick={onRedirect}>Go to {title}</button>
    </div>
  );
};

export default TaskItem;