import React, { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import CarModal from '../../components/Cars/CarModal';
import './Cars.css';

/**
 * Cars Management Page
 * Handles listing, adding, editing, and deleting cars
 */
const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - in real app, this would come from API
  const mockCars = [
    {
      id: 1,
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      licensePlate: 'ABC-123',
      color: 'Silver',
      status: 'available',
      dailyRate: 45.00,
      mileage: 15000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      seats: 5,
      image: 'https://via.placeholder.com/300x200?text=Toyota+Camry'
    },
    {
      id: 2,
      make: 'Honda',
      model: 'Accord',
      year: 2021,
      licensePlate: 'XYZ-789',
      color: 'Black',
      status: 'rented',
      dailyRate: 50.00,
      mileage: 22000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      seats: 5,
      image: 'https://via.placeholder.com/300x200?text=Honda+Accord'
    },
    {
      id: 3,
      make: 'BMW',
      model: 'X5',
      year: 2023,
      licensePlate: 'BMW-001',
      color: 'White',
      status: 'maintenance',
      dailyRate: 85.00,
      mileage: 8000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      seats: 7,
      image: 'https://via.placeholder.com/300x200?text=BMW+X5'
    },
    {
      id: 4,
      make: 'Mercedes',
      model: 'C-Class',
      year: 2022,
      licensePlate: 'MER-456',
      color: 'Blue',
      status: 'available',
      dailyRate: 75.00,
      mileage: 12000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      seats: 5,
      image: 'https://via.placeholder.com/300x200?text=Mercedes+C-Class'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchCars = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCars(mockCars);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cars:', error);
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleAddCar = () => {
    setEditingCar(null);
    setShowModal(true);
  };

  const handleEditCar = (car) => {
    setEditingCar(car);
    setShowModal(true);
  };

  const handleDeleteCar = (carId) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      setCars(cars.filter(car => car.id !== carId));
    }
  };

  const handleSaveCar = (carData) => {
    if (editingCar) {
      // Update existing car
      setCars(cars.map(car => 
        car.id === editingCar.id 
          ? { ...car, ...carData }
          : car
      ));
    } else {
      // Add new car
      const newCar = {
        id: Date.now(),
        ...carData,
        image: 'https://via.placeholder.com/300x200?text=' + carData.make + '+' + carData.model
      };
      setCars([...cars, newCar]);
    }
    setShowModal(false);
  };

  const filteredCars = cars.filter(car => {
    const matchesSearch = 
      car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || car.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusClasses = {
      available: 'status-available',
      rented: 'status-rented',
      maintenance: 'status-maintenance'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status]}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="cars-loading">
        <div className="loading-spinner"></div>
        <p>Loading cars...</p>
      </div>
    );
  }

  return (
    <div className="cars-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Cars Management</h1>
          <p className="page-subtitle">Manage your fleet of rental cars</p>
        </div>
        <button className="btn btn-primary" onClick={handleAddCar}>
          <MdAdd />
          Add New Car
        </button>
      </div>

      <div className="cars-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search cars..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select
          className="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="rented">Rented</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      <div className="cars-grid">
        {filteredCars.map(car => (
          <div key={car.id} className="car-card">
            <div className="car-image">
              <img src={car.image} alt={`${car.make} ${car.model}`} />
              <div className="car-status">
                {getStatusBadge(car.status)}
              </div>
            </div>
            
            <div className="car-info">
              <h3 className="car-title">{car.make} {car.model}</h3>
              <p className="car-year">{car.year}</p>
              
              <div className="car-details">
                <div className="detail-item">
                  <span className="detail-label">License:</span>
                  <span className="detail-value">{car.licensePlate}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Color:</span>
                  <span className="detail-value">{car.color}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Seats:</span>
                  <span className="detail-value">{car.seats}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Mileage:</span>
                  <span className="detail-value">{car.mileage.toLocaleString()} mi</span>
                </div>
              </div>
              
              <div className="car-rate">
                <span className="rate-amount">${car.dailyRate}</span>
                <span className="rate-period">/day</span>
              </div>
            </div>
            
            <div className="car-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => handleEditCar(car)}
              >
                <MdEdit /> Edit
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => handleDeleteCar(car.id)}
              >
                <MdDelete /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCars.length === 0 && (
        <div className="no-cars">
          <p>No cars found matching your criteria.</p>
        </div>
      )}

      {showModal && (
        <CarModal
          car={editingCar}
          onSave={handleSaveCar}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Cars;