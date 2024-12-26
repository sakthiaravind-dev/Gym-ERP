import React from 'react';
import StatGroup from '../components/dashboard/StatGroup';
import FollowUpTask from '../components/dashboard/FollowUpTask';
import { 
  membershipStats, 
  activityStats, 
  demographicStats, 
  financialStats, 
  pendingStats
} from '../constants/dashboardStats';

const Dashboard: React.FC = () => {
  return (
    <>
      <StatGroup stats={membershipStats} />
      <StatGroup stats={activityStats} />
      <StatGroup stats={demographicStats} />
      <StatGroup stats={financialStats} />
      <StatGroup stats={pendingStats} />
      <FollowUpTask />
    </>
  );
};

export default Dashboard;