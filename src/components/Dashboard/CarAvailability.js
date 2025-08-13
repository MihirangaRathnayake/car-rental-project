import React, { useState } from 'react';
import './CarAvailability.css';

/**
 * Car Availability Widget Component
 * Shows car availability checker with date/time selection
 */
const CarAvailability = () => {
  const [selectedCar, setSelectedCar] = useState('');
  const [selectedDate, setSelectedDate] = useState('2022-11-20');
  const [selectedTime, setSelectedTime] = useState('10 AM');

  const handleCheck = () => {
    // In real app, this would make an API call
    console.log('Checking availability for:', {
      car: selectedCar,
      date: selectedDate,
      time: selectedTime
    });
  };

  return (
    <div className="car-availability card">
      <h3 className="widget-title">Car Availability</h3>
      
      <div className="availability-form">
        <div className="form-group">
          <label className="form-label">Car number</label>
          <select 
            className="form-select"
            value={selectedCar}
            onChange={(e) => setSelectedCar(e.target.value)}
          >
            <option value="">Select car number</option>
            <option value="CAR001">CAR001 - Toyota Camry</option>
            <option value="CAR002">CAR002 - Honda Accord</option>
            <option value="CAR003">CAR003 - BMW X5</option>
            <option value="CAR004">CAR004 - Mercedes C-Class</option>
            <option value="CAR005">CAR005 - Audi A4</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Time</label>
            <select 
              className="form-select"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              <option value="8 AM">8 AM</option>
              <option value="9 AM">9 AM</option>
              <option value="10 AM">10 AM</option>
              <option value="11 AM">11 AM</option>
              <option value="12 PM">12 PM</option>
              <option value="1 PM">1 PM</option>
              <option value="2 PM">2 PM</option>
              <option value="3 PM">3 PM</option>
              <option value="4 PM">4 PM</option>
              <option value="5 PM">5 PM</option>
            </select>
          </div>
        </div>

        <button 
          className="btn btn-primary check-btn"
          onClick={handleCheck}
          disabled={!selectedCar}
        >
          Check
        </button>
      </div>
    </div>
  );
};

export default CarAvailability;