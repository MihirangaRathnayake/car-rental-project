import React, { useState, useEffect } from 'react';
import './CustomerModal.css';

/**
 * Customer Modal Component
 * Form for adding/editing customer information
 */
const CustomerModal = ({ customer, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    licenseNumber: '',
    dateOfBirth: '',
    status: 'active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        licenseNumber: customer.licenseNumber,
        dateOfBirth: customer.dateOfBirth,
        status: customer.status
      });
    }
  }, [customer]);

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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'License number is required';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 18) {
        newErrors.dateOfBirth = 'Customer must be at least 18 years old';
      }
      
      if (birthDate > today) {
        newErrors.dateOfBirth = 'Date of birth cannot be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal customer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {customer ? 'Edit Customer' : 'Add New Customer'}
          </h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="customer-form">
          {/* Personal Information */}
          <div className="form-section">
            <h3 className="section-title">Personal Information</h3>
            
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                className={`form-input ${errors.name ? 'error' : ''}`}
                value={formData.name}
                onChange={handleChange}
                placeholder="John Smith"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 234-567-8900"
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Address *</label>
              <textarea
                name="address"
                className={`form-input ${errors.address ? 'error' : ''}`}
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St, New York, NY 10001"
                rows="3"
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>
          </div>

          {/* License Information */}
          <div className="form-section">
            <h3 className="section-title">License Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">License Number *</label>
                <input
                  type="text"
                  name="licenseNumber"
                  className={`form-input ${errors.licenseNumber ? 'error' : ''}`}
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="DL123456789"
                />
                {errors.licenseNumber && <span className="error-message">{errors.licenseNumber}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  className={`form-input ${errors.dateOfBirth ? 'error' : ''}`}
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                />
                {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="form-section">
            <h3 className="section-title">Account Status</h3>
            
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {customer ? 'Update Customer' : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;