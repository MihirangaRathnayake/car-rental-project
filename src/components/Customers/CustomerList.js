import React, { useState, useEffect } from 'react';
import { customerAPI } from '../../services/api';
import CustomerForm from './CustomerForm';
import './CustomerList.css';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerAPI.getAllCustomers();
      setCustomers(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch customers: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchCustomers();
      return;
    }

    try {
      setLoading(true);
      const data = await customerAPI.searchCustomers(searchTerm);
      setCustomers(data);
      setError(null);
    } catch (err) {
      setError('Search failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setShowCustomerForm(true);
  };

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerAPI.deleteCustomer(customerId);
        fetchCustomers();
      } catch (err) {
        setError('Failed to delete customer: ' + err.message);
      }
    }
  };

  const handleCustomerFormClose = () => {
    setShowCustomerForm(false);
    setEditingCustomer(null);
  };

  const handleCustomerCreated = () => {
    fetchCustomers();
    handleCustomerFormClose();
  };

  if (loading) {
    return (
      <div className="customer-list-container">
        <div className="loading">
          <i className="fas fa-spinner fa-spin"></i> Loading customers...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="customer-list-container">
        <div className="error">
          <i className="fas fa-exclamation-triangle"></i> {error}
          <button onClick={fetchCustomers} className="retry-btn">
            <i className="fas fa-redo"></i> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-list-container">
      <div className="customer-list-header">
        <h2>Customer Management</h2>
        
        <div className="header-actions">
          <button 
            onClick={() => setShowCustomerForm(true)} 
            className="add-btn"
          >
            <i className="fas fa-user-plus"></i> Add New Customer
          </button>
          
          <div className="search-box">
            <input
              type="text"
              placeholder="Search customers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} className="search-btn">
              <i className="fas fa-search"></i> Search
            </button>
          </div>
        </div>
      </div>

      <div className="customers-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Driver License</th>
              <th>Address</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.firstName} {customer.lastName}</td>
                <td>{customer.email}</td>
                <td>{customer.phoneNumber}</td>
                <td>{customer.driverLicense}</td>
                <td>{customer.address || 'N/A'}</td>
                <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => handleEditCustomer(customer)}
                      className="edit-btn"
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteCustomer(customer.id)}
                      className="delete-btn"
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {customers.length === 0 && (
        <div className="no-customers">
          <p>No customers found.</p>
        </div>
      )}

      {showCustomerForm && (
        <CustomerForm
          editCustomer={editingCustomer}
          onCustomerCreated={handleCustomerCreated}
          onClose={handleCustomerFormClose}
        />
      )}
    </div>
  );
};

export default CustomerList;