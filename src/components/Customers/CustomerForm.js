import React, { useState } from 'react';
import { customerAPI } from '../../services/api';
import './CustomerForm.css';

const CustomerForm = ({ onCustomerCreated, onClose, editCustomer = null }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        firstName: editCustomer?.firstName || '',
        lastName: editCustomer?.lastName || '',
        email: editCustomer?.email || '',
        phoneNumber: editCustomer?.phoneNumber || '',
        driverLicense: editCustomer?.driverLicense || '',
        address: editCustomer?.address || ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.firstName || !formData.lastName || !formData.email ||
            !formData.phoneNumber || !formData.driverLicense) {
            setError('Please fill in all required fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            let customer;
            if (editCustomer) {
                customer = await customerAPI.updateCustomer(editCustomer.id, formData);
            } else {
                customer = await customerAPI.createCustomer(formData);
            }

            if (onCustomerCreated) {
                onCustomerCreated(customer);
            }

            // Reset form if creating new customer
            if (!editCustomer) {
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phoneNumber: '',
                    driverLicense: '',
                    address: ''
                });
            }

            alert(editCustomer ? 'Customer updated successfully!' : 'Customer registered successfully!');

            if (onClose) {
                onClose();
            }

        } catch (err) {
            setError('Failed to save customer: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="customer-form-container">
            <div className="customer-form">
                <div className="customer-form-header">
                    <h2>{editCustomer ? 'Edit Customer' : 'Register New Customer'}</h2>
                    {onClose && (
                        <button onClick={onClose} className="close-btn">
                            <i className="fas fa-times"></i>
                        </button>
                    )}
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName">First Name *</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">Last Name *</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="email">Email Address *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phoneNumber">Phone Number *</label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="driverLicense">Driver License Number *</label>
                        <input
                            type="text"
                            id="driverLicense"
                            name="driverLicense"
                            value={formData.driverLicense}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Address (Optional)</label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            rows="3"
                            placeholder="Street address, city, state, zip code..."
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            disabled={loading}
                            className="submit-btn"
                        >
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i> Saving...
                                </>
                            ) : editCustomer ? (
                                <>
                                    <i className="fas fa-user-edit"></i> Update Customer
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-user-plus"></i> Register Customer
                                </>
                            )}
                        </button>
                        {onClose && (
                            <button type="button" onClick={onClose} className="cancel-btn">
                                <i className="fas fa-times"></i> Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerForm;