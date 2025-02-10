/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { fetchFollowUpData } from '../constants/followUpData';
import { useNavigate } from 'react-router-dom';
import TaskItem from './dashboard/TaskItem';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

interface FollowUpItem {
  title: string;
  count: number;
  items: { name: string; id: string }[];
}

const FollowUpTask = () => {
  const [followUpData, setFollowUpData] = useState<FollowUpItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      const data = await fetchFollowUpData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformedData = data.map((item: any) => ({
        title: item.title,
        count: item.count,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items: item.items.map((subItem: any) => ({
          name: subItem.name || subItem.member_name,
          id: subItem.id || subItem.emp_id || subItem.member_id,
        })),
      }));
      setFollowUpData(transformedData);
    };

    getData();
  }, []);

  const handleRedirect = (path: string) => {
    navigate(path);
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Follow-up Task</h2>
      <div className="grid grid-cols-4 gap-4">
        {followUpData.map((task, index) => (
          <TaskItem 
            key={index}
            title={task.title}
            count={task.count}
            items={task.items.slice(0, 5)}
            onViewMore={() => {
              if (task.title === "Fees Pending") {
                handleRedirect("/pt/pending");
              } else if (task.title === "Membership Expiring") {
                handleRedirect("/followup");
              }
            }}
            onRedirect={() => {
              if (task.title === "Fees Pending") {
                handleRedirect("/pt/pending");
              } else if (task.title === "Membership Expiring") {
                handleRedirect("/followup");
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FollowUpTask;