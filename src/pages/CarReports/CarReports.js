import React, { useState, useEffect } from 'react';
import { 
  MdDirectionsCar, 
  MdBuild, 
  MdLocalGasStation,
  MdDateRange,
  MdDownload,
  MdSearch,
  MdFilterList,
  MdVisibility
} from 'react-icons/md';
import './CarReports.css';

/**
 * Car Reports Page Component
 * Displays detailed reports about car performance, maintenance, and utilization
 */
const CarReports = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reportType, setReportType] = useState('performance');
  const [selectedCar, setSelectedCar] = useState(null);
  const [showCarDetails, setShowCarDetails] = useState(false);

  // Mock data
  const mockCars = [
    {
      id: 1,
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      licensePlate: 'ABC-123',
      status: 'available',
      totalBookings: 45,
      totalRevenue: 2250.00,
      totalMileage: 15000,
      utilizationRate: 78,
      maintenanceCost: 450.00,
      fuelCost: 320.00,
      lastMaintenance: '2024-01-15',
      nextMaintenance: '2024-04-15',
      averageRating: 4.8,
      issues: []
    },
    {
      id: 2,
      make: 'Honda',
      model: 'Accord',
      year: 2021,
      licensePlate: 'XYZ-789',
      status: 'rented',
      totalBookings: 38,
      totalRevenue: 1900.00,
      totalMileage: 22000,
      utilizationRate: 65,
      maintenanceCost: 380.00,
      fuelCost: 290.00,
      lastMaintenance: '2024-02-01',
      nextMaintenance: '2024-05-01',
      averageRating: 4.6,
      issues: ['Minor scratch on door']
    },
    {
      id: 3,
      make: 'BMW',
      model: 'X5',
      year: 2023,
      licensePlate: 'BMW-001',
      status: 'maintenance',
      totalBookings: 32,
      totalRevenue: 2720.00,
      totalMileage: 8000,
      utilizationRate: 85,
      maintenanceCost: 650.00,
      fuelCost: 420.00,
      lastMaintenance: '2024-02-10',
      nextMaintenance: '2024-02-20',
      averageRating: 4.9,
      issues: ['Oil change required', 'Brake inspection needed']
    },
    {
      id: 4,
      make: 'Mercedes',
      model: 'C-Class',
      year: 2022,
      licensePlate: 'MER-456',
      status: 'available',
      totalBookings: 28,
      totalRevenue: 2100.00,
      totalMileage: 12000,
      utilizationRate: 72,
      maintenanceCost: 520.00,
      fuelCost: 350.00,
      lastMaintenance: '2024-01-20',
      nextMaintenance: '2024-04-20',
      averageRating: 4.7,
      issues: []
    }
  ];

  useEffect(() => {
    const fetchCarReports = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCars(mockCars);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching car reports:', error);
        setLoading(false);
      }
    };

    fetchCarReports();
  }, []);

  const filteredCars = cars.filter(car => {
    const matchesSearch = 
      car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || car.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleExportReport = () => {
    console.log('Exporting car reports...');
    // Simulate export process
    const exportBtn = document.querySelector('.btn-primary');
    const originalText = exportBtn.innerHTML;
    exportBtn.innerHTML = '<div class="loading-spinner-small"></div> Exporting...';
    exportBtn.disabled = true;
    
    setTimeout(() => {
      exportBtn.innerHTML = originalText;
      exportBtn.disabled = false;
      alert('Car reports exported successfully!');
    }, 2000);
  };

  const handleViewCarDetails = (car) => {
    setSelectedCar(car);
    setShowCarDetails(true);
  };

  const handleScheduleMaintenance = (carId) => {
    console.log(`Scheduling maintenance for car ${carId}`);
    // Update car status to maintenance
    setCars(cars.map(car => 
      car.id === carId 
        ? { ...car, status: 'maintenance' }
        : car
    ));
  };

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUtilizationColor = (rate) => {
    if (rate >= 80) return '#10b981';
    if (rate >= 60) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div className="car-reports-loading">
        <div className="loading-spinner"></div>
        <p>Loading car reports...</p>
      </div>
    );
  }

  return (
    <div className="car-reports-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Car Reports</h1>
          <p className="page-subtitle">Detailed analytics and performance metrics for your fleet</p>
        </div>
        <div className="header-actions">
          <select 
            className="report-type-select"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="performance">Performance Report</option>
            <option value="maintenance">Maintenance Report</option>
            <option value="financial">Financial Report</option>
          </select>
          <button className="btn btn-primary" onClick={handleExportReport}>
            <MdDownload />
            Export Report
          </button>
        </div>
      </div>

      {/* Fleet Overview */}
      <div className="fleet-overview">
        <div className="overview-card">
          <div className="overview-icon">
            <MdDirectionsCar />
          </div>
          <div className="overview-content">
            <h3 className="overview-title">Total Fleet</h3>
            <p className="overview-value">{cars.length} Cars</p>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon">
            <MdDateRange />
          </div>
          <div className="overview-content">
            <h3 className="overview-title">Average Utilization</h3>
            <p className="overview-value">
              {Math.round(cars.reduce((sum, car) => sum + car.utilizationRate, 0) / cars.length)}%
            </p>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon">
            <MdBuild />
          </div>
          <div className="overview-content">
            <h3 className="overview-title">Maintenance Due</h3>
            <p className="overview-value">
              {cars.filter(car => car.status === 'maintenance').length} Cars
            </p>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon">
            <MdLocalGasStation />
          </div>
          <div className="overview-content">
            <h3 className="overview-title">Total Revenue</h3>
            <p className="overview-value">
              {formatCurrency(cars.reduce((sum, car) => sum + car.totalRevenue, 0))}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="car-reports-filters">
        <div className="search-container">
          <MdSearch className="search-icon" />
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

      {/* Car Reports Table */}
      <div className="car-reports-table-container">
        <table className="car-reports-table table">
          <thead>
            <tr>
              <th>Car</th>
              <th>Status</th>
              <th>Bookings</th>
              <th>Revenue</th>
              <th>Utilization</th>
              <th>Maintenance</th>
              <th>Rating</th>
              <th>Issues</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCars.map(car => (
              <tr key={car.id}>
                <td>
                  <div className="car-info">
                    <div className="car-name">{car.make} {car.model}</div>
                    <div className="car-details">
                      <span className="car-year">{car.year}</span>
                      <span className="car-plate">{car.licensePlate}</span>
                    </div>
                  </div>
                </td>
                <td>
                  {getStatusBadge(car.status)}
                </td>
                <td>
                  <span className="booking-count">{car.totalBookings}</span>
                </td>
                <td>
                  <span className="revenue-amount">{formatCurrency(car.totalRevenue)}</span>
                </td>
                <td>
                  <div className="utilization-container">
                    <div className="utilization-bar">
                      <div 
                        className="utilization-fill"
                        style={{ 
                          width: `${car.utilizationRate}%`,
                          backgroundColor: getUtilizationColor(car.utilizationRate)
                        }}
                      ></div>
                    </div>
                    <span className="utilization-text">{car.utilizationRate}%</span>
                  </div>
                </td>
                <td>
                  <div className="maintenance-info">
                    <div className="maintenance-cost">{formatCurrency(car.maintenanceCost)}</div>
                    <div className="maintenance-date">
                      Next: {formatDate(car.nextMaintenance)}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="rating-container">
                    <span className="rating-value">⭐ {car.averageRating}</span>
                  </div>
                </td>
                <td>
                  <div className="issues-container">
                    {car.issues.length > 0 ? (
                      <div className="issues-list">
                        <span className="issues-count">{car.issues.length} issues</span>
                        <div className="issues-tooltip">
                          {car.issues.map((issue, index) => (
                            <div key={index} className="issue-item">{issue}</div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className="no-issues">No issues</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="car-actions">
                    <button 
                      className="btn btn-secondary action-btn"
                      onClick={() => handleViewCarDetails(car)}
                      title="View details"
                    >
                      <MdVisibility />
                    </button>
                    {car.status !== 'maintenance' && (
                      <button 
                        className="btn btn-warning action-btn"
                        onClick={() => handleScheduleMaintenance(car.id)}
                        title="Schedule maintenance"
                      >
                        <MdBuild />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredCars.length === 0 && (
        <div className="no-car-reports">
          <p>No cars found matching your criteria.</p>
        </div>
      )}

      {/* Car Details Modal */}
      {showCarDetails && selectedCar && (
        <div className="modal-overlay" onClick={() => setShowCarDetails(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {selectedCar.make} {selectedCar.model} ({selectedCar.year})
              </h2>
              <button className="modal-close" onClick={() => setShowCarDetails(false)}>
                ×
              </button>
            </div>
            <div className="car-details-content">
              <div className="details-grid">
                <div className="detail-section">
                  <h3 className="section-title">Basic Information</h3>
                  <div className="detail-row">
                    <span className="detail-label">License Plate:</span>
                    <span className="detail-value">{selectedCar.licensePlate}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span className="detail-value">{getStatusBadge(selectedCar.status)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Total Mileage:</span>
                    <span className="detail-value">{selectedCar.totalMileage.toLocaleString()} miles</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3 className="section-title">Performance Metrics</h3>
                  <div className="detail-row">
                    <span className="detail-label">Total Bookings:</span>
                    <span className="detail-value">{selectedCar.totalBookings}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Total Revenue:</span>
                    <span className="detail-value">{formatCurrency(selectedCar.totalRevenue)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Utilization Rate:</span>
                    <span className="detail-value">{selectedCar.utilizationRate}%</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Average Rating:</span>
                    <span className="detail-value">⭐ {selectedCar.averageRating}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3 className="section-title">Maintenance & Costs</h3>
                  <div className="detail-row">
                    <span className="detail-label">Maintenance Cost:</span>
                    <span className="detail-value">{formatCurrency(selectedCar.maintenanceCost)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Fuel Cost:</span>
                    <span className="detail-value">{formatCurrency(selectedCar.fuelCost)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Last Maintenance:</span>
                    <span className="detail-value">{formatDate(selectedCar.lastMaintenance)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Next Maintenance:</span>
                    <span className="detail-value">{formatDate(selectedCar.nextMaintenance)}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3 className="section-title">Current Issues</h3>
                  {selectedCar.issues.length > 0 ? (
                    <div className="issues-list-modal">
                      {selectedCar.issues.map((issue, index) => (
                        <div key={index} className="issue-item-modal">
                          <span className="issue-priority">⚠️</span>
                          <span className="issue-text">{issue}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-issues-modal">No current issues reported</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarReports;