import React, { useState, useEffect } from 'react';
import { carAPI } from '../../services/api';
import CarForm from './CarForm';
import './CarList.css';

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showCarForm, setShowCarForm] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const data = await carAPI.getAllCars();
      setCars(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch cars: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchCars();
      return;
    }

    try {
      setLoading(true);
      const data = await carAPI.searchCars(searchTerm);
      setCars(data);
      setError(null);
    } catch (err) {
      setError('Search failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (carId, newStatus) => {
    try {
      await carAPI.updateCarStatus(carId, newStatus);
      fetchCars(); // Refresh the list
    } catch (err) {
      setError('Failed to update car status: ' + err.message);
    }
  };

  const handleEditCar = (car) => {
    setEditingCar(car);
    setShowCarForm(true);
  };

  const handleDeleteCar = async (carId) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await carAPI.deleteCar(carId);
        fetchCars();
      } catch (err) {
        setError('Failed to delete car: ' + err.message);
      }
    }
  };

  const handleCarFormClose = () => {
    setShowCarForm(false);
    setEditingCar(null);
  };

  const handleCarCreated = () => {
    fetchCars();
    handleCarFormClose();
  };

  const filteredCars = cars.filter(car => {
    if (statusFilter === 'ALL') return true;
    return car.status === statusFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE': return '#28a745';
      case 'RENTED': return '#dc3545';
      case 'MAINTENANCE': return '#ffc107';
      case 'OUT_OF_SERVICE': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'AVAILABLE': return 'fas fa-check-circle';
      case 'RENTED': return 'fas fa-car';
      case 'MAINTENANCE': return 'fas fa-wrench';
      case 'OUT_OF_SERVICE': return 'fas fa-times-circle';
      default: return 'fas fa-question-circle';
    }
  };

  if (loading) {
    return (
      <div className="car-list-container">
        <div className="loading">
          <i className="fas fa-spinner fa-spin"></i> Loading cars...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="car-list-container">
        <div className="error">
          <i className="fas fa-exclamation-triangle"></i> {error}
          <button onClick={fetchCars} className="retry-btn">
            <i className="fas fa-redo"></i> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="car-list-container">
      <div className="car-list-header">
        <h2>Car Fleet Management</h2>
        
        <div className="header-actions">
          <button 
            onClick={() => setShowCarForm(true)} 
            className="add-btn"
          >
            <i className="fas fa-plus"></i> Add New Car
          </button>
        </div>
        
        <div className="car-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search cars by make or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} className="search-btn">
              <i className="fas fa-search"></i> Search
            </button>
          </div>
          
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="ALL">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="RENTED">Rented</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="OUT_OF_SERVICE">Out of Service</option>
          </select>
        </div>
      </div>

      <div className="cars-grid">
        {filteredCars.map(car => (
          <div key={car.id} className="car-card">
            <div className="car-header">
              <h3>{car.make} {car.model}</h3>
              <span 
                className="car-status"
                style={{ backgroundColor: getStatusColor(car.status) }}
              >
                <i className={getStatusIcon(car.status)}></i> {car.status}
              </span>
            </div>
            
            <div className="car-details">
              <p><strong>Year:</strong> {car.year}</p>
              <p><strong>License Plate:</strong> {car.licensePlate}</p>
              <p><strong>Daily Rate:</strong> ${car.dailyRate}</p>
              {car.fuelType && <p><strong>Fuel:</strong> {car.fuelType}</p>}
              {car.transmissionType && <p><strong>Transmission:</strong> {car.transmissionType}</p>}
              {car.seatingCapacity && <p><strong>Seats:</strong> {car.seatingCapacity}</p>}
            </div>
            
            <div className="car-actions">
              <select 
                value={car.status}
                onChange={(e) => handleStatusChange(car.id, e.target.value)}
                className="status-select"
              >
                <option value="AVAILABLE">Available</option>
                <option value="RENTED">Rented</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
              </select>
              
              <div className="action-buttons">
                <button 
                  onClick={() => handleEditCar(car)}
                  className="edit-btn"
                >
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button 
                  onClick={() => handleDeleteCar(car.id)}
                  className="delete-btn"
                >
                  <i className="fas fa-trash"></i> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCars.length === 0 && (
        <div className="no-cars">
          <p>No cars found matching your criteria.</p>
        </div>
      )}

      {showCarForm && (
        <CarForm
          editCar={editingCar}
          onCarCreated={handleCarCreated}
          onClose={handleCarFormClose}
        />
      )}
    </div>
  );
};

export default CarList;