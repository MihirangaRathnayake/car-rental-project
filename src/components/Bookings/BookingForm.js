import React, { useState, useEffect } from 'react';
import { carAPI, customerAPI, rentalAPI } from '../../services/api';
import './BookingForm.css';

const BookingForm = ({ onBookingCreated, onClose }) => {
  const [availableCars, setAvailableCars] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    carId: '',
    customerId: '',
    startDate: '',
    endDate: '',
    notes: ''
  });
  
  const [estimatedCost, setEstimatedCost] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (formData.carId && formData.startDate && formData.endDate) {
      calculateCost();
    }
  }, [formData.carId, formData.startDate, formData.endDate]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [carsData, customersData] = await Promise.all([
        carAPI.getAvailableCars(),
        customerAPI.getAllCustomers()
      ]);
      setAvailableCars(carsData);
      setCustomers(customersData);
    } catch (err) {
      setError('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateCost = async () => {
    try {
      const cost = await rentalAPI.calculateRentalCost(
        formData.carId,
        formData.startDate,
        formData.endDate
      );
      setEstimatedCost(cost);
    } catch (err) {
      console.error('Failed to calculate cost:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'carId') {
      const car = availableCars.find(c => c.id === parseInt(value));
      setSelectedCar(car);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.carId || !formData.customerId || !formData.startDate || !formData.endDate) {
      setError('Please fill in all required fields');
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError('End date must be after start date');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const rentalData = {
        car: { id: parseInt(formData.carId) },
        customer: { id: parseInt(formData.customerId) },
        startDate: formData.startDate,
        endDate: formData.endDate,
        notes: formData.notes,
        totalCost: estimatedCost
      };

      const newRental = await rentalAPI.createRental(rentalData);
      
      if (onBookingCreated) {
        onBookingCreated(newRental);
      }
      
      // Reset form
      setFormData({
        carId: '',
        customerId: '',
        startDate: '',
        endDate: '',
        notes: ''
      });
      setEstimatedCost(null);
      setSelectedCar(null);
      
      alert('Booking created successfully!');
      
    } catch (err) {
      setError('Failed to create booking: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && availableCars.length === 0) {
    return <div className="booking-form-loading">Loading...</div>;
  }

  return (
    <div className="booking-form-container">
      <div className="booking-form">
        <div className="booking-form-header">
          <h2>Create New Booking</h2>
          {onClose && (
            <button onClick={onClose} className="close-btn">
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="customerId">Customer *</label>
              <select
                id="customerId"
                name="customerId"
                value={formData.customerId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.firstName} {customer.lastName} - {customer.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="carId">Vehicle *</label>
              <select
                id="carId"
                name="carId"
                value={formData.carId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Vehicle</option>
                {availableCars.map(car => (
                  <option key={car.id} value={car.id}>
                    {car.make} {car.model} ({car.year}) - ${car.dailyRate}/day
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date *</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date *</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          {selectedCar && (
            <div className="selected-car-info">
              <h3>Selected Vehicle Details</h3>
              <div className="car-details">
                <p><strong>Vehicle:</strong> {selectedCar.make} {selectedCar.model} ({selectedCar.year})</p>
                <p><strong>License Plate:</strong> {selectedCar.licensePlate}</p>
                <p><strong>Daily Rate:</strong> ${selectedCar.dailyRate}</p>
                {selectedCar.fuelType && <p><strong>Fuel Type:</strong> {selectedCar.fuelType}</p>}
                {selectedCar.transmissionType && <p><strong>Transmission:</strong> {selectedCar.transmissionType}</p>}
                {selectedCar.seatingCapacity && <p><strong>Seats:</strong> {selectedCar.seatingCapacity}</p>}
              </div>
            </div>
          )}

          {estimatedCost && (
            <div className="cost-estimate">
              <h3>Cost Estimate</h3>
              <p className="total-cost">${estimatedCost}</p>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="notes">Notes (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
              placeholder="Any special requirements or notes..."
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={loading || !estimatedCost}
              className="submit-btn"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Creating Booking...
                </>
              ) : (
                <>
                  <i className="fas fa-calendar-check"></i> Create Booking
                </>
              )}
            </button>
            {onClose && (
              <button type="button" onClick={onClose} className="cancel-btn">
                <i className="fas fa-times"></i> Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;