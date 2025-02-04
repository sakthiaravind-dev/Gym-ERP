import React, { useState, useEffect } from 'react';
import StatGroup from '../components/dashboard/StatGroup';
import FollowUpTask from '../components/dashboard/FollowUpTask';
import getStats from '../constants/dashboardStats';

import { LucideIcon } from 'lucide-react';

interface Stat {
  title: string;
  value: string;
  Icon: LucideIcon;
  path: string;
}

const Dashboard: React.FC = () => {
  const [membershipStats, setMembershipStats] = useState<Stat[]>([]);
  const [activityStats, setActivityStats] = useState<Stat[]>([]);
  const [demographicStats, setDemographicStats] = useState<Stat[]>([]);
  const [financialStats, setFinancialStats] = useState<Stat[]>([]);
  const [pendingStats, setPendingStats] = useState<Stat[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const stats = await getStats();
      setMembershipStats(stats.membershipStats);
      setActivityStats(stats.activityStats);
      setDemographicStats(stats.demographicStats);
      setFinancialStats(stats.financialStats);
      setPendingStats(stats.pendingStats);
    };

    fetchStats();
  }, []);

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