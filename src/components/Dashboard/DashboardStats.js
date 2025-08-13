import React, { useState, useEffect } from 'react';
import { carAPI, customerAPI, rentalAPI } from '../../services/api';
import './DashboardStats.css';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    totalCustomers: 0,
    activeRentals: 0,
    completedRentals: 0,
    overdueRentals: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      const [
        allCars,
        availableCars,
        allCustomers,
        allRentals,
        activeRentals,
        completedRentals,
        overdueRentals
      ] = await Promise.all([
        carAPI.getAllCars(),
        carAPI.getAvailableCars(),
        customerAPI.getAllCustomers(),
        rentalAPI.getAllRentals(),
        rentalAPI.getRentalsByStatus('ACTIVE'),
        rentalAPI.getRentalsByStatus('COMPLETED'),
        rentalAPI.getOverdueRentals()
      ]);

      // Calculate total revenue from completed rentals
      const totalRevenue = completedRentals.reduce((sum, rental) => {
        return sum + parseFloat(rental.totalCost || 0);
      }, 0);

      setStats({
        totalCars: allCars.length,
        availableCars: availableCars.length,
        totalCustomers: allCustomers.length,
        activeRentals: activeRentals.length,
        completedRentals: completedRentals.length,
        overdueRentals: overdueRentals.length,
        totalRevenue: totalRevenue
      });

      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard statistics: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-stats-container">
        <div className="loading">
          <i className="fas fa-spinner fa-spin"></i> Loading dashboard statistics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-stats-container">
        <div className="error">
          <i className="fas fa-exclamation-triangle"></i> {error}
          <button onClick={fetchDashboardStats} className="retry-btn">
            <i className="fas fa-redo"></i> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-stats-container">
      <h2>Dashboard Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-card fleet">
          <div className="stat-icon">
            <i className="fas fa-car"></i>
          </div>
          <div className="stat-content">
            <h3>Fleet Status</h3>
            <div className="stat-numbers">
              <div className="primary-stat">{stats.totalCars}</div>
              <div className="secondary-stat">Total Cars</div>
            </div>
            <div className="stat-detail">
              {stats.availableCars} Available
            </div>
          </div>
        </div>

        <div className="stat-card customers">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3>Customers</h3>
            <div className="stat-numbers">
              <div className="primary-stat">{stats.totalCustomers}</div>
              <div className="secondary-stat">Registered</div>
            </div>
          </div>
        </div>

        <div className="stat-card rentals">
          <div className="stat-icon">
            <i className="fas fa-clipboard-list"></i>
          </div>
          <div className="stat-content">
            <h3>Active Rentals</h3>
            <div className="stat-numbers">
              <div className="primary-stat">{stats.activeRentals}</div>
              <div className="secondary-stat">Currently Rented</div>
            </div>
            {stats.overdueRentals > 0 && (
              <div className="stat-alert">
                {stats.overdueRentals} Overdue
              </div>
            )}
          </div>
        </div>

        <div className="stat-card revenue">
          <div className="stat-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-content">
            <h3>Revenue</h3>
            <div className="stat-numbers">
              <div className="primary-stat">${stats.totalRevenue.toFixed(2)}</div>
              <div className="secondary-stat">Total Earned</div>
            </div>
            <div className="stat-detail">
              {stats.completedRentals} Completed Rentals
            </div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button 
            onClick={() => window.location.href = '/bookings'}
            className="action-btn primary"
          >
            <i className="fas fa-calendar-plus"></i> Create New Booking
          </button>
          <button 
            onClick={() => window.location.href = '/cars'}
            className="action-btn secondary"
          >
            <i className="fas fa-car"></i> Manage Fleet
          </button>
          <button 
            onClick={() => window.location.href = '/customers'}
            className="action-btn secondary"
          >
            <i className="fas fa-users"></i> View Customers
          </button>
          <button 
            onClick={fetchDashboardStats}
            className="action-btn refresh"
          >
            <i className="fas fa-sync-alt"></i> Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;