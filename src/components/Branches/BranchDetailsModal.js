import React, { useState } from 'react';
import { 
  MdLocationOn,
  MdPhone,
  MdEmail,
  MdPerson,
  MdDirectionsCar,
  MdPeople,
  MdTrendingUp,
  MdTrendingDown,
  MdSchedule,
  MdStar,
  MdAttachMoney
} from 'react-icons/md';
import './BranchDetailsModal.css';

/**
 * Branch Details Modal Component
 * Comprehensive view of branch information with analytics
 */
const BranchDetailsModal = ({ branch, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPerformanceColor = (value, type) => {
    if (type === 'growth') {
      return value > 0 ? '#10b981' : '#ef4444';
    }
    if (type === 'rating') {
      return value >= 4.5 ? '#10b981' : value >= 4.0 ? '#f59e0b' : '#ef4444';
    }
    return '#3b82f6';
  };

  const renderOverviewTab = () => (
    <div className="tab-content">
      <div className="details-grid">
        {/* Basic Information */}
        <div className="detail-section">
          <h3 className="section-title">Branch Information</h3>
          <div className="info-list">
            <div className="info-item">
              <MdLocationOn className="info-icon" />
              <div className="info-content">
                <span className="info-label">Address</span>
                <span className="info-value">{branch.address}</span>
              </div>
            </div>
            <div className="info-item">
              <MdPhone className="info-icon" />
              <div className="info-content">
                <span className="info-label">Phone</span>
                <span className="info-value">{branch.phone}</span>
              </div>
            </div>
            <div className="info-item">
              <MdEmail className="info-icon" />
              <div className="info-content">
                <span className="info-label">Email</span>
                <span className="info-value">{branch.email}</span>
              </div>
            </div>
            <div className="info-item">
              <MdSchedule className="info-icon" />
              <div className="info-content">
                <span className="info-label">Hours</span>
                <span className="info-value">{branch.openingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Manager Information */}
        <div className="detail-section">
          <h3 className="section-title">Branch Manager</h3>
          <div className="manager-card">
            <div className="manager-avatar">
              {branch.manager.avatar}
            </div>
            <div className="manager-info">
              <h4 className="manager-name">{branch.manager.name}</h4>
              <div className="manager-contact">
                <div className="contact-item">
                  <MdPhone className="contact-icon" />
                  <span>{branch.manager.phone}</span>
                </div>
                <div className="contact-item">
                  <MdEmail className="contact-icon" />
                  <span>{branch.manager.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-section">
        <h3 className="section-title">Key Metrics</h3>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon cars">
              <MdDirectionsCar />
            </div>
            <div className="metric-content">
              <span className="metric-value">{branch.availableCars}/{branch.totalCars}</span>
              <span className="metric-label">Available Cars</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon bookings">
              <MdAttachMoney />
            </div>
            <div className="metric-content">
              <span className="metric-value">{formatCurrency(branch.monthlyRevenue)}</span>
              <span className="metric-label">Monthly Revenue</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon rating">
              <MdStar />
            </div>
            <div className="metric-content">
              <span className="metric-value">{branch.customerRating}</span>
              <span className="metric-label">Customer Rating</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon employees">
              <MdPeople />
            </div>
            <div className="metric-content">
              <span className="metric-value">{branch.employees}</span>
              <span className="metric-label">Employees</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="tab-content">
      <div className="performance-grid">
        <div className="performance-card">
          <h4 className="performance-title">Utilization Rate</h4>
          <div className="performance-value">
            <span className="value-number">{branch.performance.utilizationRate}%</span>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${branch.performance.utilizationRate}%`,
                  backgroundColor: getPerformanceColor(branch.performance.utilizationRate, 'utilization')
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="performance-card">
          <h4 className="performance-title">Customer Satisfaction</h4>
          <div className="performance-value">
            <span className="value-number">{branch.performance.customerSatisfaction}</span>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map(star => (
                <MdStar 
                  key={star}
                  className={`star ${star <= branch.performance.customerSatisfaction ? 'filled' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="performance-card">
          <h4 className="performance-title">Monthly Growth</h4>
          <div className="performance-value">
            <span 
              className="value-number"
              style={{ color: getPerformanceColor(branch.performance.monthlyGrowth, 'growth') }}
            >
              {branch.performance.monthlyGrowth > 0 ? <MdTrendingUp /> : <MdTrendingDown />}
              {Math.abs(branch.performance.monthlyGrowth)}%
            </span>
          </div>
        </div>

        <div className="performance-card">
          <h4 className="performance-title">Profit Margin</h4>
          <div className="performance-value">
            <span className="value-number">{branch.performance.profitMargin}%</span>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${branch.performance.profitMargin}%`,
                  backgroundColor: '#10b981'
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="chart-section">
        <h4 className="chart-title">Performance Trends</h4>
        <div className="chart-placeholder">
          <div className="chart-bars">
            {[65, 78, 82, 75, 88, 92].map((height, index) => (
              <div 
                key={index}
                className="chart-bar"
                style={{ height: `${height}%` }}
              ></div>
            ))}
          </div>
          <div className="chart-labels">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBookingsTab = () => (
    <div className="tab-content">
      <div className="bookings-section">
        <h3 className="section-title">Recent Bookings</h3>
        <div className="bookings-list">
          {branch.recentBookings.map(booking => (
            <div key={booking.id} className="booking-item">
              <div className="booking-info">
                <span className="customer-name">{booking.customer}</span>
                <span className="car-model">{booking.car}</span>
              </div>
              <div className="booking-details">
                <span className="booking-date">{formatDate(booking.date)}</span>
                <span className="booking-amount">{formatCurrency(booking.amount)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="booking-stats">
        <div className="stat-item">
          <span className="stat-label">Total Bookings</span>
          <span className="stat-value">{branch.totalBookings}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Average Booking Value</span>
          <span className="stat-value">{formatCurrency(branch.monthlyRevenue / branch.totalBookings)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Established</span>
          <span className="stat-value">{formatDate(branch.establishedDate)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal branch-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-info">
            <h2 className="modal-title">{branch.name}</h2>
            <span className="branch-code">{branch.code}</span>
            <span className={`status-badge status-${branch.status}`}>
              {branch.status}
            </span>
          </div>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
          >
            Performance
          </button>
          <button 
            className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings
          </button>
        </div>

        <div className="modal-content">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'performance' && renderPerformanceTab()}
          {activeTab === 'bookings' && renderBookingsTab()}
        </div>
      </div>
    </div>
  );
};

export default BranchDetailsModal;