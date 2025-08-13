import React, { useState } from 'react';
import { carAPI } from '../../services/api';
import './CarForm.css';

const CarForm = ({ onCarCreated, onClose, editCar = null }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    make: editCar?.make || '',
    model: editCar?.model || '',
    year: editCar?.year || new Date().getFullYear(),
    licensePlate: editCar?.licensePlate || '',
    dailyRate: editCar?.dailyRate || '',
    status: editCar?.status || 'AVAILABLE',
    fuelType: editCar?.fuelType || '',
    transmissionType: editCar?.transmissionType || '',
    seatingCapacity: editCar?.seatingCapacity || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.make || !formData.model || !formData.year || 
        !formData.licensePlate || !formData.dailyRate) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.dailyRate <= 0) {
      setError('Daily rate must be greater than 0');
      return;
    }

    if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      setError('Please enter a valid year');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const carData = {
        ...formData,
        year: parseInt(formData.year),
        dailyRate: parseFloat(formData.dailyRate),
        seatingCapacity: formData.seatingCapacity ? parseInt(formData.seatingCapacity) : null
      };

      let car;
      if (editCar) {
        car = await carAPI.updateCar(editCar.id, carData);
      } else {
        car = await carAPI.createCar(carData);
      }
      
      if (onCarCreated) {
        onCarCreated(car);
      }
      
      // Reset form if creating new car
      if (!editCar) {
        setFormData({
          make: '',
          model: '',
          year: new Date().getFullYear(),
          licensePlate: '',
          dailyRate: '',
          status: 'AVAILABLE',
          fuelType: '',
          transmissionType: '',
          seatingCapacity: ''
        });
      }
      
      alert(editCar ? 'Car updated successfully!' : 'Car added successfully!');
      
      if (onClose) {
        onClose();
      }
      
    } catch (err) {
      setError('Failed to save car: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="car-form-container">
      <div className="car-form">
        <div className="car-form-header">
          <h2>{editCar ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
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
              <label htmlFor="make">Make *</label>
              <input
                type="text"
                id="make"
                name="make"
                value={formData.make}
                onChange={handleInputChange}
                placeholder="e.g., Toyota, Honda, BMW"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="model">Model *</label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                placeholder="e.g., Camry, Civic, X5"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="year">Year *</label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                min="1900"
                max={new Date().getFullYear() + 1}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="licensePlate">License Plate *</label>
              <input
                type="text"
                id="licensePlate"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleInputChange}
                placeholder="e.g., ABC123"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dailyRate">Daily Rate ($) *</label>
              <input
                type="number"
                id="dailyRate"
                name="dailyRate"
                value={formData.dailyRate}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                placeholder="e.g., 45.00"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="AVAILABLE">Available</option>
                <option value="RENTED">Rented</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fuelType">Fuel Type</label>
              <select
                id="fuelType"
                name="fuelType"
                value={formData.fuelType}
                onChange={handleInputChange}
              >
                <option value="">Select Fuel Type</option>
                <option value="Gasoline">Gasoline</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Plug-in Hybrid">Plug-in Hybrid</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="transmissionType">Transmission</label>
              <select
                id="transmissionType"
                name="transmissionType"
                value={formData.transmissionType}
                onChange={handleInputChange}
              >
                <option value="">Select Transmission</option>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
                <option value="CVT">CVT</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="seatingCapacity">Seating Capacity</label>
            <input
              type="number"
              id="seatingCapacity"
              name="seatingCapacity"
              value={formData.seatingCapacity}
              onChange={handleInputChange}
              min="1"
              max="15"
              placeholder="e.g., 5"
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Saving...
                </>
              ) : editCar ? (
                <>
                  <i className="fas fa-car"></i> Update Vehicle
                </>
              ) : (
                <>
                  <i className="fas fa-plus-circle"></i> Add Vehicle
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

export default CarForm;