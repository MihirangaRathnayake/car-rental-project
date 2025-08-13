import React, { useState, useEffect } from 'react';
import { 
  MdAdd, 
  MdEdit, 
  MdDelete, 
  MdPhone, 
  MdHome, 
  MdCreditCard 
} from 'react-icons/md';
import CustomerModal from '../../components/Customers/CustomerModal';
import './Customers.css';

/**
 * Customers Management Page
 * Handles listing and managing customer information
 */
const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - in real app, this would come from API
  const mockCustomers = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1 234-567-8900',
      address: '123 Main St, New York, NY 10001',
      licenseNumber: 'DL123456789',
      dateOfBirth: '1985-06-15',
      totalBookings: 5,
      totalSpent: 1250.00,
      status: 'active',
      joinedDate: '2023-01-15',
      lastBooking: '2024-02-10'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 234-567-8901',
      address: '456 Oak Ave, Los Angeles, CA 90210',
      licenseNumber: 'DL987654321',
      dateOfBirth: '1990-03-22',
      totalBookings: 3,
      totalSpent: 875.00,
      status: 'active',
      joinedDate: '2023-03-20',
      lastBooking: '2024-02-12'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike@example.com',
      phone: '+1 234-567-8902',
      address: '789 Pine St, Chicago, IL 60601',
      licenseNumber: 'DL456789123',
      dateOfBirth: '1988-11-08',
      totalBookings: 8,
      totalSpent: 2100.00,
      status: 'active',
      joinedDate: '2022-11-10',
      lastBooking: '2024-02-08'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily@example.com',
      phone: '+1 234-567-8903',
      address: '321 Elm St, Miami, FL 33101',
      licenseNumber: 'DL789123456',
      dateOfBirth: '1992-07-30',
      totalBookings: 2,
      totalSpent: 650.00,
      status: 'inactive',
      joinedDate: '2023-08-05',
      lastBooking: '2024-01-20'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCustomers(mockCustomers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setShowModal(true);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setShowModal(true);
  };

  const handleDeleteCustomer = (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(customer => customer.id !== customerId));
    }
  };

  const handleSaveCustomer = (customerData) => {
    if (editingCustomer) {
      // Update existing customer
      setCustomers(customers.map(customer => 
        customer.id === editingCustomer.id 
          ? { ...customer, ...customerData }
          : customer
      ));
    } else {
      // Add new customer
      const newCustomer = {
        id: Date.now(),
        ...customerData,
        totalBookings: 0,
        totalSpent: 0.00,
        status: 'active',
        joinedDate: new Date().toISOString().split('T')[0],
        lastBooking: null
      };
      setCustomers([...customers, newCustomer]);
    }
    setShowModal(false);
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'status-available',
      inactive: 'status-maintenance'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status]}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCustomerInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="customers-loading">
        <div className="loading-spinner"></div>
        <p>Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="customers-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Customers Management</h1>
          <p className="page-subtitle">Manage customer information and profiles</p>
        </div>
        <button className="btn btn-primary" onClick={handleAddCustomer}>
          <MdAdd />
          Add Customer
        </button>
      </div>

      <div className="customers-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search customers..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="customers-stats">
          <div className="stat-item">
            <span className="stat-value">{customers.length}</span>
            <span className="stat-label">Total Customers</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{customers.filter(c => c.status === 'active').length}</span>
            <span className="stat-label">Active</span>
          </div>
        </div>
      </div>

      <div className="customers-grid">
        {filteredCustomers.map(customer => (
          <div key={customer.id} className="customer-card">
            <div className="customer-header">
              <div className="customer-avatar">
                {getCustomerInitials(customer.name)}
              </div>
              <div className="customer-basic">
                <h3 className="customer-name">{customer.name}</h3>
                <p className="customer-email">{customer.email}</p>
                {getStatusBadge(customer.status)}
              </div>
            </div>
            
            <div className="customer-details">
              <div className="detail-row">
                <MdPhone className="detail-icon" />
                <span className="detail-text">{customer.phone}</span>
              </div>
              <div className="detail-row">
                <MdHome className="detail-icon" />
                <span className="detail-text">{customer.address}</span>
              </div>
              <div className="detail-row">
                <MdCreditCard className="detail-icon" />
                <span className="detail-text">{customer.licenseNumber}</span>
              </div>
            </div>
            
            <div className="customer-stats">
              <div className="stat-group">
                <div className="stat-item">
                  <span className="stat-number">{customer.totalBookings}</span>
                  <span className="stat-label">Bookings</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">${customer.totalSpent.toFixed(0)}</span>
                  <span className="stat-label">Total Spent</span>
                </div>
              </div>
              
              <div className="customer-dates">
                <div className="date-item">
                  <span className="date-label">Joined:</span>
                  <span className="date-value">{formatDate(customer.joinedDate)}</span>
                </div>
                <div className="date-item">
                  <span className="date-label">Last Booking:</span>
                  <span className="date-value">{formatDate(customer.lastBooking)}</span>
                </div>
              </div>
            </div>
            
            <div className="customer-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => handleEditCustomer(customer)}
              >
                <MdEdit /> Edit
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => handleDeleteCustomer(customer.id)}
              >
                <MdDelete /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="no-customers">
          <p>No customers found matching your search criteria.</p>
        </div>
      )}

      {showModal && (
        <CustomerModal
          customer={editingCustomer}
          onSave={handleSaveCustomer}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Customers;