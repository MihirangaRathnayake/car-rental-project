import React, { useState, useEffect } from 'react';
import './BranchModal.css';

/**
 * Branch Modal Component
 * Comprehensive form for adding/editing branch information
 */
const BranchModal = ({ branch, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    manager: {
      name: '',
      phone: '',
      email: '',
      avatar: ''
    },
    status: 'active',
    openingHours: '9:00 AM - 6:00 PM'
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  useEffect(() => {
    if (branch) {
      setFormData({
        name: branch.name,
        code: branch.code,
        address: branch.address,
        city: branch.city,
        state: branch.state,
        zipCode: branch.zipCode,
        phone: branch.phone,
        email: branch.email,
        manager: branch.manager,
        status: branch.status,
        openingHours: branch.openingHours
      });
    }
  }, [branch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('manager.')) {
      const managerField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        manager: {
          ...prev.manager,
          [managerField]: value,
          avatar: managerField === 'name' ? generateAvatar(value) : prev.manager.avatar
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const generateAvatar = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Branch name is required';
      }
      if (!formData.code.trim()) {
        newErrors.code = 'Branch code is required';
      }
      if (!formData.address.trim()) {
        newErrors.address = 'Address is required';
      }
      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
      }
      if (!formData.state.trim()) {
        newErrors.state = 'State is required';
      }
      if (!formData.zipCode.trim()) {
        newErrors.zipCode = 'ZIP code is required';
      }
    }

    if (step === 2) {
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!formData.openingHours.trim()) {
        newErrors.openingHours = 'Opening hours are required';
      }
    }

    if (step === 3) {
      if (!formData.manager.name.trim()) {
        newErrors['manager.name'] = 'Manager name is required';
      }
      if (!formData.manager.phone.trim()) {
        newErrors['manager.phone'] = 'Manager phone is required';
      }
      if (!formData.manager.email.trim()) {
        newErrors['manager.email'] = 'Manager email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.manager.email)) {
        newErrors['manager.email'] = 'Manager email is invalid';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateStep(currentStep)) {
      onSave(formData);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h3 className="step-title">Branch Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Branch Name *</label>
                <input
                  type="text"
                  name="name"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Downtown Branch"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Branch Code *</label>
                <input
                  type="text"
                  name="code"
                  className={`form-input ${errors.code ? 'error' : ''}`}
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="DT001"
                />
                {errors.code && <span className="error-message">{errors.code}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Address *</label>
              <input
                type="text"
                name="address"
                className={`form-input ${errors.address ? 'error' : ''}`}
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main Street"
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  name="city"
                  className={`form-input ${errors.city ? 'error' : ''}`}
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="New York"
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">State *</label>
                <input
                  type="text"
                  name="state"
                  className={`form-input ${errors.state ? 'error' : ''}`}
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="NY"
                />
                {errors.state && <span className="error-message">{errors.state}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">ZIP Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  className={`form-input ${errors.zipCode ? 'error' : ''}`}
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="10001"
                />
                {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h3 className="step-title">Contact & Operations</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="branch@carrental.com"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Opening Hours *</label>
                <input
                  type="text"
                  name="openingHours"
                  className={`form-input ${errors.openingHours ? 'error' : ''}`}
                  value={formData.openingHours}
                  onChange={handleChange}
                  placeholder="9:00 AM - 6:00 PM"
                />
                {errors.openingHours && <span className="error-message">{errors.openingHours}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h3 className="step-title">Branch Manager</h3>
            
            <div className="form-group">
              <label className="form-label">Manager Name *</label>
              <input
                type="text"
                name="manager.name"
                className={`form-input ${errors['manager.name'] ? 'error' : ''}`}
                value={formData.manager.name}
                onChange={handleChange}
                placeholder="John Smith"
              />
              {errors['manager.name'] && <span className="error-message">{errors['manager.name']}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Manager Phone *</label>
                <input
                  type="tel"
                  name="manager.phone"
                  className={`form-input ${errors['manager.phone'] ? 'error' : ''}`}
                  value={formData.manager.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4568"
                />
                {errors['manager.phone'] && <span className="error-message">{errors['manager.phone']}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Manager Email *</label>
                <input
                  type="email"
                  name="manager.email"
                  className={`form-input ${errors['manager.email'] ? 'error' : ''}`}
                  value={formData.manager.email}
                  onChange={handleChange}
                  placeholder="john.smith@carrental.com"
                />
                {errors['manager.email'] && <span className="error-message">{errors['manager.email']}</span>}
              </div>
            </div>

            {formData.manager.name && (
              <div className="manager-preview">
                <div className="preview-avatar">
                  {formData.manager.avatar}
                </div>
                <div className="preview-info">
                  <h4>{formData.manager.name}</h4>
                  <p>{formData.manager.email}</p>
                  <p>{formData.manager.phone}</p>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal branch-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {branch ? 'Edit Branch' : 'Add New Branch'}
          </h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator">
          {[1, 2, 3].map(step => (
            <div key={step} className={`step ${currentStep >= step ? 'active' : ''}`}>
              <div className="step-number">{step}</div>
              <div className="step-label">
                {step === 1 && 'Basic Info'}
                {step === 2 && 'Contact'}
                {step === 3 && 'Manager'}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="branch-form">
          {renderStepContent()}

          <div className="form-actions">
            {currentStep > 1 && (
              <button type="button" className="btn btn-secondary" onClick={handlePrevious}>
                Previous
              </button>
            )}
            
            <div className="actions-right">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              
              {currentStep < totalSteps ? (
                <button type="button" className="btn btn-primary" onClick={handleNext}>
                  Next
                </button>
              ) : (
                <button type="submit" className="btn btn-primary">
                  {branch ? 'Update Branch' : 'Create Branch'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BranchModal;