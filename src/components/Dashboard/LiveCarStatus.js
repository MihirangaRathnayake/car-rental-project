import React, { useState, useEffect } from 'react';
import { MdFilterList } from 'react-icons/md';
import './LiveCarStatus.css';

/**
 * Live Car Status Component
 * Shows real-time status of cars and trips
 */
const LiveCarStatus = () => {
  const [carStatuses, setCarStatuses] = useState([
    {
      id: 1,
      carNo: '6465',
      driver: 'Alex Noman',
      avatar: 'AN',
      status: 'completed',
      tripStatus: 'Completed',
      earning: 35.44
    },
    {
      id: 2,
      carNo: '5865',
      driver: 'Razib Rahman',
      avatar: 'RR',
      status: 'pending',
      tripStatus: 'Pending',
      earning: 0.00
    },
    {
      id: 3,
      carNo: '1755',
      driver: 'Luke Norton',
      avatar: 'LN',
      status: 'in-route',
      tripStatus: 'In Route',
      earning: 23.50
    }
  ]);

  const [filter, setFilter] = useState('all');

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'in-route':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const filteredStatuses = carStatuses.filter(car => {
    if (filter === 'all') return true;
    return car.status === filter;
  });

  const handleViewDetails = (carId) => {
    console.log('View details for car:', carId);
    // In real app, this would navigate to car details or open modal
  };

  return (
    <div className="live-car-status card">
      <div className="status-header">
        <h3 className="widget-title">Live Car Status</h3>
        <button className="filter-btn">
          <MdFilterList />
          Filter
        </button>
      </div>

      <div className="status-table-container">
        <table className="status-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Car no.</th>
              <th>Driver</th>
              <th>Trip Status</th>
              <th>Earning</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStatuses.map((car, index) => (
              <tr key={car.id}>
                <td>{String(index + 1).padStart(2, '0')}</td>
                <td className="car-number">{car.carNo}</td>
                <td>
                  <div className="driver-info">
                    <div className="driver-avatar">
                      {car.avatar}
                    </div>
                    <span className="driver-name">{car.driver}</span>
                  </div>
                </td>
                <td>
                  <div className="status-indicator">
                    <div 
                      className="status-dot"
                      style={{ backgroundColor: getStatusColor(car.status) }}
                    ></div>
                    <span className="status-text">{car.tripStatus}</span>
                  </div>
                </td>
                <td className="earning">
                  ${car.earning.toFixed(2)}
                </td>
                <td>
                  <button 
                    className="btn btn-secondary details-btn"
                    onClick={() => handleViewDetails(car.id)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LiveCarStatus;