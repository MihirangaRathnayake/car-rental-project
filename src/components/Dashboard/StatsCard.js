import React from 'react';
import { 
  MdAttachMoney, 
  MdTrendingUp, 
  MdTrendingDown,
  MdDirectionsCar,
  MdCalendarToday
} from 'react-icons/md';
import { FaMoneyBillWave } from 'react-icons/fa';
import './StatsCard.css';

/**
 * Statistics Card Component
 * Displays key metrics with change indicators
 */
const StatsCard = ({ title, value, change, comparison, period, type }) => {
  const getIcon = () => {
    switch (type) {
      case 'income':
        return MdAttachMoney;
      case 'expense':
        return FaMoneyBillWave;
      case 'cars':
        return MdDirectionsCar;
      case 'bookings':
        return MdCalendarToday;
      default:
        return MdAttachMoney;
    }
  };

  const getChangeColor = () => {
    if (!change) return '';
    return change > 0 ? 'positive' : 'negative';
  };

  return (
    <div className={`stats-card ${type}`}>
      <div className="stats-header">
        <div className="stats-icon">
          {React.createElement(getIcon())}
        </div>
        <h3 className="stats-title">{title}</h3>
      </div>
      
      <div className="stats-value">
        {value}
      </div>
      
      {change && (
        <div className="stats-change">
          <span className={`change-indicator ${getChangeColor()}`}>
            {change > 0 ? <MdTrendingUp /> : <MdTrendingDown />} {Math.abs(change)}%
          </span>
          <span className="change-text">
            Compared to {comparison} {period}
          </span>
        </div>
      )}
      
      {period && !change && (
        <div className="stats-period">
          Last week income: $25658.00
        </div>
      )}
    </div>
  );
};

export default StatsCard;