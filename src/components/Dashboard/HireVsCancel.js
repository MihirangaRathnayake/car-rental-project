import React from 'react';
import { MdTrendingUp } from 'react-icons/md';
import './HireVsCancel.css';

/**
 * Hire vs Cancel Chart Component
 * Shows pie chart with hire/cancel statistics
 */
const HireVsCancel = () => {
  const data = {
    totalHired: 54,
    totalCanceled: 20,
    totalPending: 26
  };

  const total = data.totalHired + data.totalCanceled + data.totalPending;
  
  // Calculate percentages and angles
  const hiredPercentage = ((data.totalHired / total) * 100).toFixed(0);
  const canceledPercentage = ((data.totalCanceled / total) * 100).toFixed(0);
  const pendingPercentage = ((data.totalPending / total) * 100).toFixed(0);

  // SVG circle parameters
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate stroke dash arrays for each segment
  const hiredStroke = (data.totalHired / total) * circumference;
  const canceledStroke = (data.totalCanceled / total) * circumference;
  const pendingStroke = (data.totalPending / total) * circumference;

  return (
    <div className="hire-vs-cancel card">
      <div className="chart-header">
        <h3 className="widget-title">Hire vs Cancel</h3>
        <select className="period-select">
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      <div className="chart-content">
        <div className="pie-chart-container">
          <svg className="pie-chart" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="10"
            />
            
            {/* Hired segment */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="10"
              strokeDasharray={`${hiredStroke} ${circumference}`}
              strokeDashoffset="0"
              transform="rotate(-90 50 50)"
              className="chart-segment hired"
            />
            
            {/* Canceled segment */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#ef4444"
              strokeWidth="10"
              strokeDasharray={`${canceledStroke} ${circumference}`}
              strokeDashoffset={-hiredStroke}
              transform="rotate(-90 50 50)"
              className="chart-segment canceled"
            />
            
            {/* Pending segment */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#10b981"
              strokeWidth="10"
              strokeDasharray={`${pendingStroke} ${circumference}`}
              strokeDashoffset={-(hiredStroke + canceledStroke)}
              transform="rotate(-90 50 50)"
              className="chart-segment pending"
            />
          </svg>
        </div>

        <div className="chart-stats">
          <div className="stat-item hired-stat">
            <div className="stat-indicator">
              <div className="stat-dot hired"></div>
              <span className="stat-label">Total Hired</span>
            </div>
            <div className="stat-value">
              <span className="stat-number">{hiredPercentage}%</span>
              <MdTrendingUp className="stat-change positive" />
            </div>
          </div>

          <div className="stat-item canceled-stat">
            <div className="stat-indicator">
              <div className="stat-dot canceled"></div>
              <span className="stat-label">Total Canceled</span>
            </div>
            <div className="stat-value">
              <span className="stat-number">{canceledPercentage}%</span>
              <MdTrendingUp className="stat-change negative" />
            </div>
          </div>

          <div className="stat-item pending-stat">
            <div className="stat-indicator">
              <div className="stat-dot pending"></div>
              <span className="stat-label">Total Pending</span>
            </div>
            <div className="stat-value">
              <span className="stat-number">{pendingPercentage}%</span>
              <MdTrendingUp className="stat-change positive" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HireVsCancel;