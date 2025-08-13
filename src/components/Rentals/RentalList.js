import React, { useState, useEffect } from 'react';
import { rentalAPI } from '../../services/api';
import BookingForm from '../Bookings/BookingForm';
import './RentalList.css';

const RentalList = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const data = await rentalAPI.getAllRentals();
      setRentals(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch rentals: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRental = async (rentalId) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await rentalAPI.completeRental(rentalId, today);
      fetchRentals(); // Refresh the list
    } catch (err) {
      setError('Failed to complete rental: ' + err.message);
    }
  };

  const handleBookingCreated = () => {
    fetchRentals();
    setShowBookingForm(false);
  };

  const filteredRentals = rentals.filter(rental => {
    if (statusFilter === 'ALL') return true;
    return rental.status === statusFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return '#007bff';
      case 'COMPLETED': return '#28a745';
      case 'CANCELLED': return '#dc3545';
      case 'OVERDUE': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE': return 'fas fa-play-circle';
      case 'COMPLETED': return 'fas fa-check-circle';
      case 'CANCELLED': return 'fas fa-times-circle';
      case 'OVERDUE': return 'fas fa-exclamation-triangle';
      default: return 'fas fa-question-circle';
    }
  };

  const isOverdue = (rental) => {
    if (rental.status !== 'ACTIVE') return false;
    const endDate = new Date(rental.endDate);
    const today = new Date();
    return endDate < today;
  };

  if (loading) {
    return (
      <div className="rental-list-container">
        <div className="loading">
          <i className="fas fa-spinner fa-spin"></i> Loading rentals...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rental-list-container">
        <div className="error">
          <i className="fas fa-exclamation-triangle"></i> {error}
          <button onClick={fetchRentals} className="retry-btn">
            <i className="fas fa-redo"></i> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rental-list-container">
      <div className="rental-list-header">
        <h2>Rental Management</h2>
        
        <div className="header-actions">
          <button 
            onClick={() => setShowBookingForm(true)} 
            className="add-btn"
          >
            <i className="fas fa-calendar-plus"></i> Create New Booking
          </button>
          
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>
      </div>

      <div className="rentals-grid">
        {filteredRentals.map(rental => (
          <div key={rental.id} className={`rental-card ${isOverdue(rental) ? 'overdue' : ''}`}>
            <div className="rental-header">
              <h3>Rental #{rental.id}</h3>
              <span 
                className="rental-status"
                style={{ backgroundColor: getStatusColor(rental.status) }}
              >
                <i className={getStatusIcon(isOverdue(rental) ? 'OVERDUE' : rental.status)}></i>
                {isOverdue(rental) ? 'OVERDUE' : rental.status}
              </span>
            </div>
            
            <div className="rental-details">
              <div className="customer-info">
                <h4>Customer</h4>
                <p>{rental.customer.firstName} {rental.customer.lastName}</p>
                <p>{rental.customer.email}</p>
                <p>{rental.customer.phoneNumber}</p>
              </div>
              
              <div className="car-info">
                <h4>Vehicle</h4>
                <p>{rental.car.make} {rental.car.model} ({rental.car.year})</p>
                <p>License: {rental.car.licensePlate}</p>
                <p>Daily Rate: ${rental.car.dailyRate}</p>
              </div>
              
              <div className="rental-info">
                <h4>Rental Details</h4>
                <p><strong>Start Date:</strong> {new Date(rental.startDate).toLocaleDateString()}</p>
                <p><strong>End Date:</strong> {new Date(rental.endDate).toLocaleDateString()}</p>
                {rental.actualReturnDate && (
                  <p><strong>Returned:</strong> {new Date(rental.actualReturnDate).toLocaleDateString()}</p>
                )}
                <p><strong>Total Cost:</strong> ${rental.totalCost}</p>
                {rental.notes && <p><strong>Notes:</strong> {rental.notes}</p>}
              </div>
            </div>
            
            {rental.status === 'ACTIVE' && (
              <div className="rental-actions">
                <button 
                  onClick={() => handleCompleteRental(rental.id)}
                  className="complete-btn"
                >
                  <i className="fas fa-check-circle"></i> Complete Rental
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredRentals.length === 0 && (
        <div className="no-rentals">
          <p>No rentals found matching your criteria.</p>
        </div>
      )}

      {showBookingForm && (
        <BookingForm
          onBookingCreated={handleBookingCreated}
          onClose={() => setShowBookingForm(false)}
        />
      )}
    </div>
  );
};

export default RentalList;