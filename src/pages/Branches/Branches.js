import React, { useState, useEffect } from 'react';
import {
    MdAdd,
    MdEdit,
    MdDelete,
    MdLocationOn,
    MdPhone,
    MdEmail,
    MdPerson,
    MdDirectionsCar,
    MdPeople,
    MdTrendingUp,
    MdTrendingDown,
    MdVisibility,
    MdRefresh,
    MdSearch,
    MdFilterList,
    MdBusiness
} from 'react-icons/md';
import BranchModal from '../../components/Branches/BranchModal';
import BranchDetailsModal from '../../components/Branches/BranchDetailsModal';
import './Branches.css';

/**
 * Branches Management Page
 * Comprehensive branch management with analytics and detailed information
 */
const Branches = () => {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [editingBranch, setEditingBranch] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid'); // grid or list

    // Mock comprehensive branch data
    const mockBranches = [
        {
            id: 1,
            name: 'Downtown Branch',
            code: 'DT001',
            address: '123 Main Street, Downtown, NY 10001',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            phone: '+1 (555) 123-4567',
            email: 'downtown@carrental.com',
            manager: {
                name: 'John Smith',
                phone: '+1 (555) 123-4568',
                email: 'john.smith@carrental.com',
                avatar: 'JS'
            },
            status: 'active',
            openingHours: '8:00 AM - 8:00 PM',
            totalCars: 45,
            availableCars: 32,
            totalBookings: 234,
            monthlyRevenue: 45680.00,
            customerRating: 4.8,
            employees: 12,
            establishedDate: '2020-01-15',
            performance: {
                utilizationRate: 78,
                customerSatisfaction: 4.8,
                monthlyGrowth: 12.5,
                profitMargin: 23.4
            },
            recentBookings: [
                { id: 1, customer: 'Alice Johnson', car: 'Toyota Camry', date: '2024-02-15', amount: 225 },
                { id: 2, customer: 'Bob Wilson', car: 'Honda Accord', date: '2024-02-14', amount: 350 }
            ]
        },
        {
            id: 2,
            name: 'Airport Branch',
            code: 'AP002',
            address: '456 Airport Drive, Terminal 2, NY 11430',
            city: 'Queens',
            state: 'NY',
            zipCode: '11430',
            phone: '+1 (555) 234-5678',
            email: 'airport@carrental.com',
            manager: {
                name: 'Sarah Davis',
                phone: '+1 (555) 234-5679',
                email: 'sarah.davis@carrental.com',
                avatar: 'SD'
            },
            status: 'active',
            openingHours: '24/7',
            totalCars: 68,
            availableCars: 45,
            totalBookings: 456,
            monthlyRevenue: 78920.00,
            customerRating: 4.6,
            employees: 18,
            establishedDate: '2019-06-20',
            performance: {
                utilizationRate: 85,
                customerSatisfaction: 4.6,
                monthlyGrowth: 8.3,
                profitMargin: 28.7
            },
            recentBookings: [
                { id: 1, customer: 'Mike Chen', car: 'BMW X5', date: '2024-02-15', amount: 450 },
                { id: 2, customer: 'Lisa Brown', car: 'Mercedes C-Class', date: '2024-02-14', amount: 380 }
            ]
        },
        {
            id: 3,
            name: 'Suburban Branch',
            code: 'SB003',
            address: '789 Oak Avenue, Westfield, NJ 07090',
            city: 'Westfield',
            state: 'NJ',
            zipCode: '07090',
            phone: '+1 (555) 345-6789',
            email: 'suburban@carrental.com',
            manager: {
                name: 'Michael Johnson',
                phone: '+1 (555) 345-6790',
                email: 'michael.johnson@carrental.com',
                avatar: 'MJ'
            },
            status: 'active',
            openingHours: '9:00 AM - 6:00 PM',
            totalCars: 28,
            availableCars: 19,
            totalBookings: 156,
            monthlyRevenue: 28450.00,
            customerRating: 4.9,
            employees: 8,
            establishedDate: '2021-03-10',
            performance: {
                utilizationRate: 72,
                customerSatisfaction: 4.9,
                monthlyGrowth: 15.2,
                profitMargin: 31.2
            },
            recentBookings: [
                { id: 1, customer: 'Emma Wilson', car: 'Toyota Prius', date: '2024-02-15', amount: 180 },
                { id: 2, customer: 'David Lee', car: 'Honda CR-V', date: '2024-02-14', amount: 220 }
            ]
        },
        {
            id: 4,
            name: 'Business District',
            code: 'BD004',
            address: '321 Corporate Plaza, Manhattan, NY 10016',
            city: 'Manhattan',
            state: 'NY',
            zipCode: '10016',
            phone: '+1 (555) 456-7890',
            email: 'business@carrental.com',
            manager: {
                name: 'Emily Rodriguez',
                phone: '+1 (555) 456-7891',
                email: 'emily.rodriguez@carrental.com',
                avatar: 'ER'
            },
            status: 'maintenance',
            openingHours: '7:00 AM - 9:00 PM',
            totalCars: 52,
            availableCars: 38,
            totalBookings: 298,
            monthlyRevenue: 62340.00,
            customerRating: 4.7,
            employees: 15,
            establishedDate: '2018-11-05',
            performance: {
                utilizationRate: 81,
                customerSatisfaction: 4.7,
                monthlyGrowth: -2.1,
                profitMargin: 25.8
            },
            recentBookings: [
                { id: 1, customer: 'James Taylor', car: 'Audi A4', date: '2024-02-15', amount: 320 },
                { id: 2, customer: 'Anna Garcia', car: 'BMW 3 Series', date: '2024-02-14', amount: 290 }
            ]
        }
    ];

    const [branchStats, setBranchStats] = useState({
        totalBranches: 4,
        activeBranches: 3,
        totalCars: 193,
        totalEmployees: 53,
        averageRating: 4.75,
        totalRevenue: 215390.00
    });

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                setLoading(true);
                await new Promise(resolve => setTimeout(resolve, 1000));
                setBranches(mockBranches);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching branches:', error);
                setLoading(false);
            }
        };

        fetchBranches();
    }, []);

    const handleAddBranch = () => {
        setEditingBranch(null);
        setShowModal(true);
    };

    const handleEditBranch = (branch) => {
        setEditingBranch(branch);
        setShowModal(true);
    };

    const handleViewBranch = (branch) => {
        setSelectedBranch(branch);
        setShowDetailsModal(true);
    };

    const handleDeleteBranch = (branchId) => {
        if (window.confirm('Are you sure you want to delete this branch?')) {
            setBranches(branches.filter(branch => branch.id !== branchId));
            // Update stats
            setBranchStats(prev => ({
                ...prev,
                totalBranches: prev.totalBranches - 1
            }));
        }
    };

    const handleSaveBranch = (branchData) => {
        if (editingBranch) {
            setBranches(branches.map(branch =>
                branch.id === editingBranch.id
                    ? { ...branch, ...branchData }
                    : branch
            ));
        } else {
            const newBranch = {
                id: Date.now(),
                ...branchData,
                totalCars: 0,
                availableCars: 0,
                totalBookings: 0,
                monthlyRevenue: 0,
                customerRating: 0,
                employees: 0,
                establishedDate: new Date().toISOString().split('T')[0],
                performance: {
                    utilizationRate: 0,
                    customerSatisfaction: 0,
                    monthlyGrowth: 0,
                    profitMargin: 0
                },
                recentBookings: []
            };
            setBranches([...branches, newBranch]);
            setBranchStats(prev => ({
                ...prev,
                totalBranches: prev.totalBranches + 1
            }));
        }
        setShowModal(false);
    };

    const handleRefreshData = () => {
        setLoading(true);
        setTimeout(() => {
            // Simulate data refresh with slight variations
            setBranches(prev => prev.map(branch => ({
                ...branch,
                monthlyRevenue: branch.monthlyRevenue + (Math.random() - 0.5) * 1000,
                availableCars: Math.max(0, branch.availableCars + Math.floor((Math.random() - 0.5) * 5))
            })));
            setLoading(false);
        }, 1500);
    };

    const filteredBranches = branches.filter(branch => {
        const matchesSearch =
            branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            branch.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            branch.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
            branch.manager.name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || branch.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        const statusClasses = {
            active: 'status-active',
            maintenance: 'status-maintenance',
            inactive: 'status-inactive'
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

    const getPerformanceColor = (value, type) => {
        if (type === 'growth') {
            return value > 0 ? '#10b981' : '#ef4444';
        }
        if (type === 'rating') {
            return value >= 4.5 ? '#10b981' : value >= 4.0 ? '#f59e0b' : '#ef4444';
        }
        return '#3b82f6';
    };

    if (loading) {
        return (
            <div className="branches-loading">
                <div className="loading-spinner"></div>
                <p>Loading branches...</p>
            </div>
        );
    }

    return (
        <div className="branches-page">
            <div className="page-header">
                <div className="header-left">
                    <h1 className="page-title">Branch Management</h1>
                    <p className="page-subtitle">Manage and monitor all branch locations</p>
                </div>
                <div className="header-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={handleRefreshData}
                        disabled={loading}
                    >
                        <MdRefresh />
                        Refresh
                    </button>
                    <button className="btn btn-primary" onClick={handleAddBranch}>
                        <MdAdd />
                        Add Branch
                    </button>
                </div>
            </div>

            {/* Branch Statistics */}
            <div className="branch-stats-grid">
                <div className="stat-card total">
                    <div className="stat-icon">
                        <MdBusiness />
                    </div>
                    <div className="stat-content">
                        <h3 className="stat-title">Total Branches</h3>
                        <p className="stat-value">{branchStats.totalBranches}</p>
                        <span className="stat-subtitle">Across all locations</span>
                    </div>
                </div>

                <div className="stat-card active">
                    <div className="stat-icon">
                        <MdTrendingUp />
                    </div>
                    <div className="stat-content">
                        <h3 className="stat-title">Active Branches</h3>
                        <p className="stat-value">{branchStats.activeBranches}</p>
                        <span className="stat-subtitle">Currently operational</span>
                    </div>
                </div>

                <div className="stat-card cars">
                    <div className="stat-icon">
                        <MdDirectionsCar />
                    </div>
                    <div className="stat-content">
                        <h3 className="stat-title">Total Fleet</h3>
                        <p className="stat-value">{branchStats.totalCars}</p>
                        <span className="stat-subtitle">Cars across branches</span>
                    </div>
                </div>

                <div className="stat-card employees">
                    <div className="stat-icon">
                        <MdPeople />
                    </div>
                    <div className="stat-content">
                        <h3 className="stat-title">Total Employees</h3>
                        <p className="stat-value">{branchStats.totalEmployees}</p>
                        <span className="stat-subtitle">Staff members</span>
                    </div>
                </div>

                <div className="stat-card rating">
                    <div className="stat-icon">
                        ⭐
                    </div>
                    <div className="stat-content">
                        <h3 className="stat-title">Average Rating</h3>
                        <p className="stat-value">{branchStats.averageRating}</p>
                        <span className="stat-subtitle">Customer satisfaction</span>
                    </div>
                </div>

                <div className="stat-card revenue">
                    <div className="stat-icon">
                        <MdTrendingUp />
                    </div>
                    <div className="stat-content">
                        <h3 className="stat-title">Total Revenue</h3>
                        <p className="stat-value">{formatCurrency(branchStats.totalRevenue)}</p>
                        <span className="stat-subtitle">Monthly combined</span>
                    </div>
                </div>
            </div>

            {/* Filters and View Controls */}
            <div className="branches-controls">
                <div className="search-container">
                    <MdSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search branches..."
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
                    <option value="active">Active</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inactive">Inactive</option>
                </select>

                <div className="view-toggle">
                    <button
                        className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                    >
                        Grid
                    </button>
                    <button
                        className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                    >
                        List
                    </button>
                </div>
            </div>

            {/* Branches Display */}
            <div className={`branches-container ${viewMode}`}>
                {filteredBranches.map(branch => (
                    <div key={branch.id} className="branch-card">
                        <div className="branch-header">
                            <div className="branch-title">
                                <h3 className="branch-name">{branch.name}</h3>
                                <span className="branch-code">{branch.code}</span>
                                {getStatusBadge(branch.status)}
                            </div>
                            <div className="branch-actions">
                                <button
                                    className="card-action-btn view-btn"
                                    onClick={() => handleViewBranch(branch)}
                                    title="View Details"
                                >
                                    <MdVisibility />
                                </button>
                                <button
                                    className="card-action-btn edit-btn"
                                    onClick={() => handleEditBranch(branch)}
                                    title="Edit Branch"
                                >
                                    <MdEdit />
                                </button>
                                <button
                                    className="card-action-btn delete-btn"
                                    onClick={() => handleDeleteBranch(branch.id)}
                                    title="Delete Branch"
                                >
                                    <MdDelete />
                                </button>
                            </div>
                        </div>

                        <div className="branch-info">
                            <div className="info-row">
                                <MdLocationOn className="info-icon" />
                                <span className="info-text">{branch.address}</span>
                            </div>
                            <div className="info-row">
                                <MdPhone className="info-icon" />
                                <span className="info-text">{branch.phone}</span>
                            </div>
                            <div className="info-row">
                                <MdPerson className="info-icon" />
                                <span className="info-text">Manager: {branch.manager.name}</span>
                            </div>
                        </div>

                        <div className="branch-metrics">
                            <div className="metric-item">
                                <span className="metric-label">Cars</span>
                                <span className="metric-value">{branch.availableCars}/{branch.totalCars}</span>
                            </div>
                            <div className="metric-item">
                                <span className="metric-label">Revenue</span>
                                <span className="metric-value">{formatCurrency(branch.monthlyRevenue)}</span>
                            </div>
                            <div className="metric-item">
                                <span className="metric-label">Rating</span>
                                <span className="metric-value">⭐ {branch.customerRating}</span>
                            </div>
                            <div className="metric-item">
                                <span className="metric-label">Utilization</span>
                                <span className="metric-value">{branch.performance.utilizationRate}%</span>
                            </div>
                        </div>

                        <div className="branch-performance">
                            <div className="performance-bar">
                                <div className="performance-label">Utilization Rate</div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${branch.performance.utilizationRate}%`,
                                            backgroundColor: getPerformanceColor(branch.performance.utilizationRate, 'utilization')
                                        }}
                                    ></div>
                                </div>
                                <span className="performance-value">{branch.performance.utilizationRate}%</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredBranches.length === 0 && (
                <div className="no-branches">
                    <p>No branches found matching your criteria.</p>
                </div>
            )}

            {/* Modals */}
            {showModal && (
                <BranchModal
                    branch={editingBranch}
                    onSave={handleSaveBranch}
                    onClose={() => setShowModal(false)}
                />
            )}

            {showDetailsModal && selectedBranch && (
                <BranchDetailsModal
                    branch={selectedBranch}
                    onClose={() => setShowDetailsModal(false)}
                />
            )}
        </div>
    );
};

export default Branches;