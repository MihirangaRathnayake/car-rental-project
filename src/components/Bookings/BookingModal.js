import React, { useState, useEffect } from 'react';
import './BookingModal.css';

/**
 * Booking Modal Component
 * Form for adding/editing booking information
 */
const BookingModal = ({ booking, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        carMake: '',
        carModel: '',
        licensePlate: '',
        startDate: '',
        endDate: '',
        dailyRate: '',
        status: 'pending'
    });

    const [errors, setErrors] = useState({});
    const [totalDays, setTotalDays] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    // Mock available cars - in real app, this would come from API
    const availableCars = [
        { id: 1, make: 'Toyota', model: 'Camry', licensePlate: 'ABC-123', dailyRate: 45.00 },
        { id: 2, make: 'Honda', model: 'Accord', licensePlate: 'XYZ-789', dailyRate: 50.00 },
        { id: 3, make: 'BMW', model: 'X5', licensePlate: 'BMW-001', dailyRate: 85.00 },
        { id: 4, make: 'Mercedes', model: 'C-Class', licensePlate: 'MER-456', dailyRate: 75.00 }
    ];

    useEffect(() => {
        if (booking) {
            setFormData({
                customerName: booking.customerName,
                customerEmail: booking.customerEmail,
                customerPhone: booking.customerPhone,
                carMake: booking.carMake,
                carModel: booking.carModel,
                licensePlate: booking.licensePlate,
                startDate: booking.startDate,
                endDate: booking.endDate,
                dailyRate: booking.dailyRate,
                status: booking.status
            });
        }
    }, [booking]);

    useEffect(() => {
        // Calculate total days and amount when dates or rate change
        if (formData.startDate && formData.endDate && formData.dailyRate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 0) {
                setTotalDays(diffDays);
                setTotalAmount(diffDays * parseFloat(formData.dailyRate));
            } else {
                setTotalDays(0);
                setTotalAmount(0);
            }
        }
    }, [formData.startDate, formData.endDate, formData.dailyRate]);

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

    const handleCarSelect = (e) => {
        const selectedCarId = parseInt(e.target.value);
        const selectedCar = availableCars.find(car => car.id === selectedCarId);

        if (selectedCar) {
            setFormData(prev => ({
                ...prev,
                carMake: selectedCar.make,
                carModel: selectedCar.model,
                licensePlate: selectedCar.licensePlate,
                dailyRate: selectedCar.dailyRate
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                carMake: '',
                carModel: '',
                licensePlate: '',
                dailyRate: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.customerName.trim()) {
            newErrors.customerName = 'Customer name is required';
        }

        if (!formData.customerEmail.trim()) {
            newErrors.customerEmail = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
            newErrors.customerEmail = 'Email is invalid';
        }

        if (!formData.customerPhone.trim()) {
            newErrors.customerPhone = 'Phone number is required';
        }

        if (!formData.carMake.trim()) {
            newErrors.car = 'Please select a car';
        }

        if (!formData.startDate) {
            newErrors.startDate = 'Start date is required';
        }

        if (!formData.endDate) {
            newErrors.endDate = 'End date is required';
        }

        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);

            if (start >= end) {
                newErrors.endDate = 'End date must be after start date';
            }

            if (start < new Date().setHours(0, 0, 0, 0)) {
                newErrors.startDate = 'Start date cannot be in the past';
            }
        }

        if (!formData.dailyRate || formData.dailyRate <= 0) {
            newErrors.dailyRate = 'Daily rate must be greater than 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            onSave({
                ...formData,
                dailyRate: parseFloat(formData.dailyRate),
                totalDays,
                totalAmount
            });
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal booking-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        {booking ? 'Edit Booking' : 'New Booking'}
                    </h2>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="booking-form">
                    {/* Customer Information */}
                    <div className="form-section">
                        <h3 className="section-title">Customer Information</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Customer Name *</label>
                                <input
                                    type="text"
                                    name="customerName"
                                    className={`form-input ${errors.customerName ? 'error' : ''}`}
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    placeholder="John Smith"
                                />
                                {errors.customerName && <span className="error-message">{errors.customerName}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email *</label>
                                <input
                                    type="email"
                                    name="customerEmail"
                                    className={`form-input ${errors.customerEmail ? 'error' : ''}`}
                                    value={formData.customerEmail}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                />
                                {errors.customerEmail && <span className="error-message">{errors.customerEmail}</span>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Phone Number *</label>
                            <input
                                type="tel"
                                name="customerPhone"
                                className={`form-input ${errors.customerPhone ? 'error' : ''}`}
                                value={formData.customerPhone}
                                onChange={handleChange}
                                placeholder="+1 234-567-8900"
                            />
                            {errors.customerPhone && <span className="error-message">{errors.customerPhone}</span>}
                        </div>
                    </div>

                    {/* Car Selection */}
                    <div className="form-section">
                        <h3 className="section-title">Car Selection</h3>

                        <div className="form-group">
                            <label className="form-label">Select Car *</label>
                            <select
                                className={`form-select ${errors.car ? 'error' : ''}`}
                                onChange={handleCarSelect}
                                value={availableCars.find(car => car.licensePlate === formData.licensePlate)?.id || ''}
                            >
                                <option value="">Choose a car...</option>
                                {availableCars.map(car => (
                                    <option key={car.id} value={car.id}>
                                        {car.make} {car.model} ({car.licensePlate}) - ${car.dailyRate}/day
                                    </option>
                                ))}
                            </select>
                            {errors.car && <span className="error-message">{errors.car}</span>}
                        </div>

                        {formData.carMake && (
                            <div className="selected-car-info">
                                <div className="car-details">
                                    <span className="car-name">{formData.carMake} {formData.carModel}</span>
                                    <span className="car-plate">{formData.licensePlate}</span>
                                    <span className="car-rate">${formData.dailyRate}/day</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Booking Details */}
                    <div className="form-section">
                        <h3 className="section-title">Booking Details</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Start Date *</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    className={`form-input ${errors.startDate ? 'error' : ''}`}
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                                {errors.startDate && <span className="error-message">{errors.startDate}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">End Date *</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    className={`form-input ${errors.endDate ? 'error' : ''}`}
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                                />
                                {errors.endDate && <span className="error-message">{errors.endDate}</span>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select
                                name="status"
                                className="form-select"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {/* Booking Summary */}
                    {totalDays > 0 && (
                        <div className="booking-summary">
                            <h3 className="section-title">Booking Summary</h3>
                            <div className="summary-details">
                                <div className="summary-row">
                                    <span>Duration:</span>
                                    <span>{totalDays} days</span>
                                </div>
                                <div className="summary-row">
                                    <span>Daily Rate:</span>
                                    <span>${formData.dailyRate}/day</span>
                                </div>
                                <div className="summary-row total">
                                    <span>Total Amount:</span>
                                    <span>${totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {booking ? 'Update Booking' : 'Create Booking'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;