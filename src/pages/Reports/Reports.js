import React, { useState, useEffect } from 'react';
import './Reports.css';

// Icon component for CDN-based icons
const Icon = ({ type, className = "", style = "material" }) => {
    const materialIconsMap = {
        download: "download",
        calendar: "event",
        trending_up: "trending_up",
        trending_down: "trending_down",
        car: "directions_car",
        people: "people",
        money: "payments",
        refresh: "refresh",
        view: "visibility",
        star: "star",
        close: "close",
        info: "info",
        license: "credit_card",
        trophy: "emoji_events",
        analytics: "analytics",
        feedback: "feedback",
        insights: "insights",
        lightbulb: "lightbulb",
        edit: "edit"
    };

    const fontAwesomeMap = {
        download: "fas fa-download",
        calendar: "fas fa-calendar",
        trending_up: "fas fa-arrow-trend-up",
        trending_down: "fas fa-arrow-trend-down",
        car: "fas fa-car",
        people: "fas fa-users",
        money: "fas fa-money-bill-wave",
        refresh: "fas fa-sync",
        view: "fas fa-eye",
        star: "fas fa-star",
        close: "fas fa-times",
        info: "fas fa-info-circle",
        license: "fas fa-id-card",
        trophy: "fas fa-trophy",
        analytics: "fas fa-chart-line",
        feedback: "fas fa-comments",
        insights: "fas fa-lightbulb",
        lightbulb: "fas fa-lightbulb",
        edit: "fas fa-edit"
    };

    if (style === "fontawesome") {
        return <i className={`${fontAwesomeMap[type]} ${className}`}></i>;
    }

    return <span className={`material-icons ${className}`}>{materialIconsMap[type]}</span>;
};

/**
 * Reports Page Component
 * Displays various business reports and analytics
 */
const Reports = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
    const [reportData, setReportData] = useState({
        totalRevenue: 45680.00,
        totalBookings: 234,
        activeCustomers: 156,
        fleetUtilization: 78,
        revenueChange: 12.5,
        bookingsChange: 8.3,
        customersChange: 15.2,
        utilizationChange: 5.1,
        topPerformingCars: [
            { id: 1, make: 'Toyota', model: 'Camry', bookings: 45, revenue: 2250, utilization: 89, rating: 4.8, licensePlate: 'ABC-123' },
            { id: 2, make: 'Honda', model: 'Accord', bookings: 38, revenue: 1900, utilization: 76, rating: 4.6, licensePlate: 'XYZ-789' },
            { id: 3, make: 'BMW', model: 'X5', bookings: 32, revenue: 2720, utilization: 85, rating: 4.9, licensePlate: 'BMW-001' },
            { id: 4, make: 'Mercedes', model: 'C-Class', bookings: 28, revenue: 2100, utilization: 72, rating: 4.7, licensePlate: 'MER-456' },
            { id: 5, make: 'Audi', model: 'A4', bookings: 25, revenue: 1875, utilization: 68, rating: 4.5, licensePlate: 'AUD-789' },
            { id: 6, make: 'Nissan', model: 'Altima', bookings: 22, revenue: 1650, utilization: 65, rating: 4.4, licensePlate: 'NIS-321' }
        ],
        categoryBreakdown: [
            { category: 'Economy Cars', revenue: 18500, percentage: 40.5 },
            { category: 'Luxury Cars', revenue: 15200, percentage: 33.3 },
            { category: 'SUVs', revenue: 8900, percentage: 19.5 },
            { category: 'Sports Cars', revenue: 3080, percentage: 6.7 }
        ],
        customerSegments: [
            { segment: 'Business', count: 89, revenue: 22400 },
            { segment: 'Leisure', count: 67, revenue: 23280 }
        ]
    });

    const [loading, setLoading] = useState(true);
    const [selectedCar, setSelectedCar] = useState(null);
    const [showCarModal, setShowCarModal] = useState(false);

    useEffect(() => {
        // Simulate API call
        const fetchReportData = async () => {
            try {
                setLoading(true);
                await new Promise(resolve => setTimeout(resolve, 1000));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching report data:', error);
                setLoading(false);
            }
        };

        fetchReportData();
    }, [selectedPeriod]);

    const handleExportReport = (type) => {
        console.log(`Exporting ${type} report...`);
        // Simulate export process
        const exportBtn = document.querySelector('.btn-primary');
        const originalText = exportBtn.innerHTML;
        exportBtn.innerHTML = '<div class="loading-spinner-small"></div> Exporting...';
        exportBtn.disabled = true;

        setTimeout(() => {
            exportBtn.innerHTML = originalText;
            exportBtn.disabled = false;
            alert(`${type} report exported successfully!`);
        }, 2000);
    };

    const handleRefreshData = () => {
        setLoading(true);
        // Simulate data refresh
        setTimeout(() => {
            // Update with slightly different data to show refresh
            setReportData(prev => ({
                ...prev,
                totalRevenue: prev.totalRevenue + Math.random() * 1000 - 500,
                totalBookings: prev.totalBookings + Math.floor(Math.random() * 20 - 10),
                activeCustomers: prev.activeCustomers + Math.floor(Math.random() * 10 - 5)
            }));
            setLoading(false);
        }, 1500);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const handleViewCarDetails = (car) => {
        setSelectedCar(car);
        setShowCarModal(true);
    };

    const handleCloseCarModal = () => {
        setShowCarModal(false);
        setSelectedCar(null);
    };

    if (loading) {
        return (
            <div className="reports-loading">
                <div className="loading-spinner"></div>
                <p>Loading reports...</p>
            </div>
        );
    }

    return (
        <div className="reports-page">
            <div className="page-header">
                <div className="header-left">
                    <h1 className="page-title">Business Reports</h1>
                    <p className="page-subtitle">Comprehensive analytics and insights</p>
                </div>
                <div className="header-actions">
                    <select
                        className="period-select"
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                    >
                        <option value="thisWeek">This Week</option>
                        <option value="thisMonth">This Month</option>
                        <option value="lastMonth">Last Month</option>
                        <option value="thisQuarter">This Quarter</option>
                        <option value="thisYear">This Year</option>
                    </select>
                    <button
                        className="btn btn-secondary"
                        onClick={handleRefreshData}
                        disabled={loading}
                    >
                        <Icon type="refresh" />
                        Refresh
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => handleExportReport('comprehensive')}
                    >
                        <Icon type="download" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="metrics-grid">
                <div className="metric-card revenue">
                    <div className="metric-icon">
                        <Icon type="money" />
                    </div>
                    <div className="metric-content">
                        <h3 className="metric-title">Total Revenue</h3>
                        <p className="metric-value">{formatCurrency(reportData.totalRevenue)}</p>
                        <span className={`metric-change ${reportData.revenueChange > 0 ? 'positive' : 'negative'}`}>
                            {reportData.revenueChange > 0 ? <Icon type="trending_up" /> : <Icon type="trending_down" />}
                            {reportData.revenueChange > 0 ? '+' : ''}{reportData.revenueChange}% from last period
                        </span>
                    </div>
                </div>

                <div className="metric-card bookings">
                    <div className="metric-icon">
                        <Icon type="calendar" />
                    </div>
                    <div className="metric-content">
                        <h3 className="metric-title">Total Bookings</h3>
                        <p className="metric-value">{reportData.totalBookings}</p>
                        <span className={`metric-change ${reportData.bookingsChange > 0 ? 'positive' : 'negative'}`}>
                            {reportData.bookingsChange > 0 ? <Icon type="trending_up" /> : <Icon type="trending_down" />}
                            {reportData.bookingsChange > 0 ? '+' : ''}{reportData.bookingsChange}% from last period
                        </span>
                    </div>
                </div>

                <div className="metric-card customers">
                    <div className="metric-icon">
                        <Icon type="people" />
                    </div>
                    <div className="metric-content">
                        <h3 className="metric-title">Active Customers</h3>
                        <p className="metric-value">{reportData.activeCustomers}</p>
                        <span className={`metric-change ${reportData.customersChange > 0 ? 'positive' : 'negative'}`}>
                            {reportData.customersChange > 0 ? <Icon type="trending_up" /> : <Icon type="trending_down" />}
                            {reportData.customersChange > 0 ? '+' : ''}{reportData.customersChange}% from last period
                        </span>
                    </div>
                </div>

                <div className="metric-card utilization">
                    <div className="metric-icon">
                        <Icon type="car" />
                    </div>
                    <div className="metric-content">
                        <h3 className="metric-title">Fleet Utilization</h3>
                        <p className="metric-value">{reportData.fleetUtilization}%</p>
                        <span className={`metric-change ${reportData.utilizationChange > 0 ? 'positive' : 'negative'}`}>
                            {reportData.utilizationChange > 0 ? <Icon type="trending_up" /> : <Icon type="trending_down" />}
                            {reportData.utilizationChange > 0 ? '+' : ''}{reportData.utilizationChange}% from last period
                        </span>
                    </div>
                </div>
            </div>

            <div className="reports-container">
                <div className="reports-grid">
                    {/* Top Performing Cars */}
                    <div className="report-section">
                        <div className="section-header">
                            <h2 className="section-title">Top Performing Cars</h2>
                            <button
                                className="btn btn-secondary"
                                onClick={() => handleExportReport('top-cars')}
                            >
                                <Icon type="download" />
                                Export
                            </button>
                        </div>
                        <div className="cars-grid">
                            {reportData.topPerformingCars.map((car, index) => (
                                <div key={car.id} className="car-card">
                                    <div className="car-card-header">
                                        <div className="car-rank">#{index + 1}</div>
                                        <div className="car-details">
                                            <h3 className="car-name">{car.make} {car.model}</h3>
                                            <span className="car-plate">{car.licensePlate}</span>
                                        </div>
                                        <div className="car-actions">
                                            <button
                                                className="action-btn"
                                                onClick={() => handleViewCarDetails(car)}
                                                title="View car details"
                                            >
                                                <Icon type="view" />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="car-card-body">
                                        <div className="car-metrics">
                                            <div className="metric-item">
                                                <div className="metric-icon bookings">
                                                    <Icon type="calendar" />
                                                </div>
                                                <div className="metric-content">
                                                    <span className="metric-value">{car.bookings}</span>
                                                    <span className="metric-label">Bookings</span>
                                                </div>
                                            </div>
                                            
                                            <div className="metric-item">
                                                <div className="metric-icon revenue">
                                                    <Icon type="money" />
                                                </div>
                                                <div className="metric-content">
                                                    <span className="metric-value">{formatCurrency(car.revenue)}</span>
                                                    <span className="metric-label">Revenue</span>
                                                </div>
                                            </div>
                                            
                                            <div className="metric-item">
                                                <div className="metric-icon rating">
                                                    <Icon type="star" />
                                                </div>
                                                <div className="metric-content">
                                                    <span className="metric-value">{car.rating}</span>
                                                    <span className="metric-label">Rating</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="car-status">
                                            <span className={`status-badge ${car.bookings > 30 ? 'status-active' : car.bookings > 15 ? 'status-moderate' : 'status-low'}`}>
                                                <Icon type={car.bookings > 30 ? 'trending_up' : car.bookings > 15 ? 'trending_up' : 'trending_down'} />
                                                {car.bookings > 30 ? 'High Demand' : car.bookings > 15 ? 'Moderate' : 'Low Demand'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats Summary */}
                    <div className="report-section">
                        <div className="section-header">
                            <h2 className="section-title">Performance Summary</h2>
                            <button
                                className="btn btn-secondary"
                                onClick={() => handleExportReport('summary')}
                            >
                                <Icon type="download" />
                                Export
                            </button>
                        </div>
                        <div className="quick-stats-grid">
                            <div className="quick-stat-card">
                                <div className="stat-icon revenue">
                                    <Icon type="money" />
                                </div>
                                <div className="stat-content">
                                    <div className="stat-value">{formatCurrency(reportData.totalRevenue)}</div>
                                    <div className="stat-label">Total Revenue</div>
                                </div>
                            </div>
                            <div className="quick-stat-card">
                                <div className="stat-icon bookings">
                                    <Icon type="calendar" />
                                </div>
                                <div className="stat-content">
                                    <div className="stat-value">{reportData.totalBookings}</div>
                                    <div className="stat-label">Total Bookings</div>
                                </div>
                            </div>
                            <div className="quick-stat-card">
                                <div className="stat-icon customers">
                                    <Icon type="people" />
                                </div>
                                <div className="stat-content">
                                    <div className="stat-value">{reportData.activeCustomers}</div>
                                    <div className="stat-label">Active Customers</div>
                                </div>
                            </div>
                            <div className="quick-stat-card">
                                <div className="stat-icon utilization">
                                    <Icon type="car" />
                                </div>
                                <div className="stat-content">
                                    <div className="stat-value">{reportData.fleetUtilization}%</div>
                                    <div className="stat-label">Fleet Utilization</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Analytics */}
                <div className="analytics-grid">
                    {/* Category Breakdown */}
                    <div className="report-section">
                        <div className="section-header">
                            <h2 className="section-title">Revenue by Category</h2>
                            <button
                                className="btn btn-secondary"
                                onClick={() => handleExportReport('categories')}
                            >
                                <Icon type="download" />
                                Export
                            </button>
                        </div>
                        <div className="category-breakdown">
                            {reportData.categoryBreakdown.map((category, index) => (
                                <div key={index} className="category-item">
                                    <div className="category-info">
                                        <span className="category-name">{category.category}</span>
                                        <span className="category-percentage">{category.percentage}%</span>
                                    </div>
                                    <div className="category-bar">
                                        <div
                                            className="category-fill"
                                            style={{ width: `${category.percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="category-revenue">
                                        {formatCurrency(category.revenue)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Customer Segments */}
                    <div className="report-section">
                        <div className="section-header">
                            <h2 className="section-title">Customer Segments</h2>
                            <button
                                className="btn btn-secondary"
                                onClick={() => handleExportReport('segments')}
                            >
                                <Icon type="download" />
                                Export
                            </button>
                        </div>
                        <div className="segments-chart">
                            {reportData.customerSegments.map((segment, index) => (
                                <div key={index} className="segment-item">
                                    <div className="segment-header">
                                        <h3 className="segment-name">{segment.segment}</h3>
                                        <span className="segment-count">{segment.count} customers</span>
                                    </div>
                                    <div className="segment-revenue">
                                        <span className="revenue-label">Revenue:</span>
                                        <span className="revenue-value">{formatCurrency(segment.revenue)}</span>
                                    </div>
                                    <div className="segment-avg">
                                        <span className="avg-label">Avg per customer:</span>
                                        <span className="avg-value">{formatCurrency(segment.revenue / segment.count)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Car Details Modal */}
            {showCarModal && selectedCar && (
                <div className="modal-overlay" onClick={handleCloseCarModal}>
                    <div className="modal-content car-details-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title-section">
                                <div className="car-icon-large">
                                    <Icon type="car" />
                                </div>
                                <div>
                                    <h2 className="modal-title">
                                        {selectedCar.make} {selectedCar.model}
                                    </h2>
                                    <p className="modal-subtitle">Vehicle Performance Report</p>
                                </div>
                            </div>
                            <button className="modal-close" onClick={handleCloseCarModal}>
                                <Icon type="close" />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="car-details-grid">
                                <div className="detail-section vehicle-info">
                                    <div className="section-header-icon">
                                        <Icon type="info" />
                                        <h3 className="detail-title">Vehicle Information</h3>
                                    </div>
                                    <div className="detail-item">
                                        <div className="detail-icon">
                                            <Icon type="car" />
                                        </div>
                                        <div className="detail-content">
                                            <span className="detail-label">Make & Model</span>
                                            <span className="detail-value">{selectedCar.make} {selectedCar.model}</span>
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <div className="detail-icon">
                                            <Icon type="license" />
                                        </div>
                                        <div className="detail-content">
                                            <span className="detail-label">License Plate</span>
                                            <span className="detail-value license-plate">{selectedCar.licensePlate}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="detail-section performance-metrics">
                                    <div className="section-header-icon">
                                        <Icon type="analytics" />
                                        <h3 className="detail-title">Performance Metrics</h3>
                                    </div>
                                    <div className="detail-item">
                                        <div className="detail-icon">
                                            <Icon type="calendar" />
                                        </div>
                                        <div className="detail-content">
                                            <span className="detail-label">Total Bookings</span>
                                            <span className="detail-value">{selectedCar.bookings}</span>
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <div className="detail-icon">
                                            <Icon type="money" />
                                        </div>
                                        <div className="detail-content">
                                            <span className="detail-label">Total Revenue</span>
                                            <span className="detail-value revenue-highlight">{formatCurrency(selectedCar.revenue)}</span>
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <div className="detail-icon">
                                            <Icon type="star" />
                                        </div>
                                        <div className="detail-content">
                                            <span className="detail-label">Customer Rating</span>
                                            <span className="detail-value">{selectedCar.rating}/5.0</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={handleCloseCarModal}>
                                Close
                            </button>
                            <button className="btn btn-success">
                                <Icon type="edit" />
                                Edit Vehicle
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;