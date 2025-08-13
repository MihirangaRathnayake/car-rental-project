import React, { useState } from 'react';
import './EarningsSummary.css';

/**
 * Earnings Summary Component
 * Shows earnings chart with period selection
 */
const EarningsSummary = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Mar 2022 - Oct 2022');
  const [selectedMetric, setSelectedMetric] = useState('last6months');

  // Mock chart data points
  const chartData = [
    { month: 'May', value: 1800, x: 10 },
    { month: 'Jun', value: 2200, x: 20 },
    { month: 'Jul', value: 1900, x: 30 },
    { month: 'Aug', value: 2400, x: 40 },
    { month: 'Sep', value: 2800, x: 50 },
    { month: 'Oct', value: 2600, x: 60 }
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));
  const chartHeight = 120;

  const generatePath = () => {
    const points = chartData.map((point, index) => {
      const x = (index / (chartData.length - 1)) * 100;
      const y = chartHeight - (point.value / maxValue) * chartHeight;
      return `${x},${y}`;
    }).join(' ');
    
    return `M ${points.replace(/,/g, ' L ')}`;
  };

  const generateAreaPath = () => {
    const points = chartData.map((point, index) => {
      const x = (index / (chartData.length - 1)) * 100;
      const y = chartHeight - (point.value / maxValue) * chartHeight;
      return `${x},${y}`;
    });
    
    const pathStart = `M 0,${chartHeight}`;
    const pathLine = points.map(point => `L ${point}`).join(' ');
    const pathEnd = `L 100,${chartHeight} Z`;
    
    return `${pathStart} ${pathLine} ${pathEnd}`;
  };

  return (
    <div className="earnings-summary card">
      <div className="earnings-header">
        <h3 className="widget-title">Earning Summary</h3>
        <select 
          className="period-select"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          <option value="Mar 2022 - Oct 2022">Mar 2022 - Oct 2022</option>
          <option value="Jan 2022 - Aug 2022">Jan 2022 - Aug 2022</option>
          <option value="Jun 2022 - Dec 2022">Jun 2022 - Dec 2022</option>
        </select>
      </div>

      <div className="chart-container">
        <svg className="earnings-chart" viewBox={`0 0 100 ${chartHeight}`}>
          {/* Grid lines */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05"/>
            </linearGradient>
          </defs>
          
          {/* Area fill */}
          <path
            d={generateAreaPath()}
            fill="url(#areaGradient)"
          />
          
          {/* Main line */}
          <path
            d={generatePath()}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {chartData.map((point, index) => {
            const x = (index / (chartData.length - 1)) * 100;
            const y = chartHeight - (point.value / maxValue) * chartHeight;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="1"
                fill="#3b82f6"
                className="data-point"
              />
            );
          })}
        </svg>
        
        <div className="chart-labels">
          {chartData.map((point, index) => (
            <span key={index} className="chart-label">
              {point.month}
            </span>
          ))}
        </div>
      </div>

      <div className="earnings-legend">
        <div className="legend-item">
          <div className="legend-dot current"></div>
          <span>Last 6 months</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot previous"></div>
          <span>Same period last year</span>
        </div>
      </div>
    </div>
  );
};

export default EarningsSummary;