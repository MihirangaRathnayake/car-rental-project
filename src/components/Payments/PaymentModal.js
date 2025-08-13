import React, { useState, useEffect } from 'react';
import './PaymentModal.css';

/**
 * Payment Modal Component
 * Form for adding/editing payment methods
 */
const PaymentModal = ({ paymentMethod, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    type: 'Credit Card',
    provider: 'Visa',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    isDefault: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (paymentMethod) {
      setFormData({
        type: paymentMethod.type,
        provider: paymentMethod.provider,
        cardNumber: `****${paymentMethod.last4}`,
        expiryMonth: paymentMethod.expiryMonth,
        expiryYear: paymentMethod.expiryYear,
        cvv: '',
        cardholderName: paymentMethod.cardholderName || '',
        isDefault: paymentMethod.isDefault
      });
    }
  }, [paymentMethod]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    if (!paymentMethod) { // Only validate card number for new cards
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (formData.cardNumber.replace(/\s/g, '').length < 13) {
        newErrors.cardNumber = 'Card number must be at least 13 digits';
      }
    }

    if (!formData.expiryMonth) {
      newErrors.expiryMonth = 'Expiry month is required';
    }

    if (!formData.expiryYear) {
      newErrors.expiryYear = 'Expiry year is required';
    }

    if (!paymentMethod && !formData.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (!paymentMethod && formData.cvv.length < 3) {
      newErrors.cvv = 'CVV must be at least 3 digits';
    }

    // Check if expiry date is in the future
    if (formData.expiryMonth && formData.expiryYear) {
      const currentDate = new Date();
      const expiryDate = new Date(parseInt(formData.expiryYear), parseInt(formData.expiryMonth) - 1);
      
      if (expiryDate <= currentDate) {
        newErrors.expiryMonth = 'Card has expired';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const saveData = {
        ...formData,
        last4: paymentMethod ? paymentMethod.last4 : formData.cardNumber.slice(-4)
      };
      
      // Remove sensitive data before saving
      delete saveData.cardNumber;
      delete saveData.cvv;
      
      onSave(saveData);
    }
  };

  const formatCardNumber = (value) => {
    // Remove all non-digit characters
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      cardNumber: formatted
    }));
    
    // Auto-detect card provider
    const firstDigit = formatted.charAt(0);
    let provider = 'Visa';
    if (firstDigit === '4') provider = 'Visa';
    else if (firstDigit === '5') provider = 'Mastercard';
    else if (firstDigit === '3') provider = 'American Express';
    
    setFormData(prev => ({
      ...prev,
      provider
    }));
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return { value: month.toString().padStart(2, '0'), label: month.toString().padStart(2, '0') };
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {paymentMethod ? 'Edit Payment Method' : 'Add Payment Method'}
          </h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-section">
            <h3 className="section-title">Card Information</h3>
            
            <div className="form-group">
              <label className="form-label">Cardholder Name *</label>
              <input
                type="text"
                name="cardholderName"
                className={`form-input ${errors.cardholderName ? 'error' : ''}`}
                value={formData.cardholderName}
                onChange={handleChange}
                placeholder="John Smith"
              />
              {errors.cardholderName && <span className="error-message">{errors.cardholderName}</span>}
            </div>

            {!paymentMethod && (
              <div className="form-group">
                <label className="form-label">Card Number *</label>
                <input
                  type="text"
                  name="cardNumber"
                  className={`form-input ${errors.cardNumber ? 'error' : ''}`}
                  value={formData.cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                />
                {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Expiry Month *</label>
                <select
                  name="expiryMonth"
                  className={`form-select ${errors.expiryMonth ? 'error' : ''}`}
                  value={formData.expiryMonth}
                  onChange={handleChange}
                >
                  <option value="">Month</option>
                  {months.map(month => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
                {errors.expiryMonth && <span className="error-message">{errors.expiryMonth}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Expiry Year *</label>
                <select
                  name="expiryYear"
                  className={`form-select ${errors.expiryYear ? 'error' : ''}`}
                  value={formData.expiryYear}
                  onChange={handleChange}
                >
                  <option value="">Year</option>
                  {years.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.expiryYear && <span className="error-message">{errors.expiryYear}</span>}
              </div>
            </div>

            {!paymentMethod && (
              <div className="form-group">
                <label className="form-label">CVV *</label>
                <input
                  type="text"
                  name="cvv"
                  className={`form-input ${errors.cvv ? 'error' : ''}`}
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  maxLength="4"
                />
                {errors.cvv && <span className="error-message">{errors.cvv}</span>}
              </div>
            )}
          </div>

          <div className="form-section">
            <h3 className="section-title">Card Type</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Card Type</label>
                <select
                  name="type"
                  className="form-select"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Provider</label>
                <select
                  name="provider"
                  className="form-select"
                  value={formData.provider}
                  onChange={handleChange}
                >
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="American Express">American Express</option>
                  <option value="Discover">Discover</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                />
                <span className="checkbox-text">Set as default payment method</span>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {paymentMethod ? 'Update Payment Method' : 'Add Payment Method'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;