import React from 'react';
import DashboardStats from '../../components/Dashboard/DashboardStats';
import './Dashboard.css';

/**
 * Dashboard Page Component
 * Main dashboard with real-time statistics from the API
 */
const Dashboard = () => {
  return (
    <div className="dashboard">
      <DashboardStats />
    </div>
  );
};

export default Dashboard;