import React from 'react';
import StatGroup from '../components/dashboard/StatGroup';
import FollowUpTask from '../components/dashboard/FollowUpTask';
import { 
  membershipStats, 
  activityStats, 
  demographicStats, 
  financialStats 
} from '../constants/dashboardStats';

const Dashboard: React.FC = () => {
  return (
    <>
      <StatGroup stats={membershipStats} />
      <StatGroup stats={activityStats} />
      <StatGroup stats={demographicStats} />
      <StatGroup stats={financialStats} />
      <FollowUpTask />
    </>
  );
};

export default Dashboard;