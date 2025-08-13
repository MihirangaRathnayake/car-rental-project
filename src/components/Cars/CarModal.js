import React, { useState, useEffect } from 'react';
import './CarModal.css';

/**
 * Car Modal Component
 * Form for adding/editing car information
 */
const CarModal = ({ car, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    color: '',
    status: 'available',
    dailyRate: '',
    mileage: '',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    seats: 5
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (car) {
      setFormData(car);
    }
  }, [car]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.make.trim()) {
      newErrors.make = 'Make is required';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }

    if (!formData.licensePlate.trim()) {
      newErrors.licensePlate = 'License plate is required';
    }

    if (!formData.color.trim()) {
      newErrors.color = 'Color is required';
    }

    if (!formData.dailyRate || formData.dailyRate <= 0) {
      newErrors.dailyRate = 'Daily rate must be greater than 0';
    }

    if (!formData.mileage || formData.mileage < 0) {
      newErrors.mileage = 'Mileage must be 0 or greater';
    }

    if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Please enter a valid year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({
        ...formData,
        dailyRate: parseFloat(formData.dailyRate),
        mileage: parseInt(formData.mileage),
        year: parseInt(formData.year),
        seats: parseInt(formData.seats)
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {car ? 'Edit Car' : 'Add New Car'}
          </h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="car-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Make *</label>
              <input
                type="text"
                name="make"
                className={`form-input ${errors.make ? 'error' : ''}`}
                value={formData.make}
                onChange={handleChange}
                placeholder="e.g. Toyota"
              />
              {errors.make && <span className="error-message">{errors.make}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Model *</label>
              <input
                type="text"
                name="model"
                className={`form-input ${errors.model ? 'error' : ''}`}
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g. Camry"
              />
              {errors.model && <span className="error-message">{errors.model}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Year *</label>
              <input
                type="number"
                name="year"
                className={`form-input ${errors.year ? 'error' : ''}`}
                value={formData.year}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear() + 1}
              />
              {errors.year && <span className="error-message">{errors.year}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">License Plate *</label>
              <input
                type="text"
                name="licensePlate"
                className={`form-input ${errors.licensePlate ? 'error' : ''}`}
                value={formData.licensePlate}
                onChange={handleChange}
                placeholder="e.g. ABC-123"
              />
              {errors.licensePlate && <span className="error-message">{errors.licensePlate}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Color *</label>
              <input
                type="text"
                name="color"
                className={`form-input ${errors.color ? 'error' : ''}`}
                value={formData.color}
                onChange={handleChange}
                placeholder="e.g. Silver"
              />
              {errors.color && <span className="error-message">{errors.color}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Daily Rate ($) *</label>
              <input
                type="number"
                name="dailyRate"
                className={`form-input ${errors.dailyRate ? 'error' : ''}`}
                value={formData.dailyRate}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="45.00"
              />
              {errors.dailyRate && <span className="error-message">{errors.dailyRate}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Mileage *</label>
              <input
                type="number"
                name="mileage"
                className={`form-input ${errors.mileage ? 'error' : ''}`}
                value={formData.mileage}
                onChange={handleChange}
                min="0"
                placeholder="15000"
              />
              {errors.mileage && <span className="error-message">{errors.mileage}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Fuel Type</label>
              <select
                name="fuelType"
                className="form-select"
                value={formData.fuelType}
                onChange={handleChange}
              >
                <option value="Gasoline">Gasoline</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Transmission</label>
              <select
                name="transmission"
                className="form-select"
                value={formData.transmission}
                onChange={handleChange}
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Seats</label>
            <select
              name="seats"
              className="form-select"
              value={formData.seats}
              onChange={handleChange}
            >
              <option value={2}>2 Seats</option>
              <option value={4}>4 Seats</option>
              <option value={5}>5 Seats</option>
              <option value={7}>7 Seats</option>
              <option value={8}>8 Seats</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {car ? 'Update Car' : 'Add Car'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarModal;