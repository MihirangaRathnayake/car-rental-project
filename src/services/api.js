const API_BASE_URL = 'http://localhost:8080/api';

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Handle empty responses (like DELETE operations)
    if (response.status === 204) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Car API functions
export const carAPI = {
  // Get all cars
  getAllCars: () => apiCall('/cars'),
  
  // Get car by ID
  getCarById: (id) => apiCall(`/cars/${id}`),
  
  // Create new car
  createCar: (carData) => apiCall('/cars', {
    method: 'POST',
    body: JSON.stringify(carData),
  }),
  
  // Update car
  updateCar: (id, carData) => apiCall(`/cars/${id}`, {
    method: 'PUT',
    body: JSON.stringify(carData),
  }),
  
  // Delete car
  deleteCar: (id) => apiCall(`/cars/${id}`, {
    method: 'DELETE',
  }),
  
  // Get available cars
  getAvailableCars: () => apiCall('/cars/available'),
  
  // Search cars
  searchCars: (keyword) => apiCall(`/cars/search?keyword=${encodeURIComponent(keyword)}`),
  
  // Filter cars by price range
  filterCarsByPrice: (minRate, maxRate) => 
    apiCall(`/cars/filter?minRate=${minRate}&maxRate=${maxRate}`),
  
  // Update car status
  updateCarStatus: (id, status) => apiCall(`/cars/${id}/status?status=${status}`, {
    method: 'PATCH',
  }),
};

// Customer API functions
export const customerAPI = {
  // Get all customers
  getAllCustomers: () => apiCall('/customers'),
  
  // Get customer by ID
  getCustomerById: (id) => apiCall(`/customers/${id}`),
  
  // Create new customer
  createCustomer: (customerData) => apiCall('/customers', {
    method: 'POST',
    body: JSON.stringify(customerData),
  }),
  
  // Update customer
  updateCustomer: (id, customerData) => apiCall(`/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(customerData),
  }),
  
  // Delete customer
  deleteCustomer: (id) => apiCall(`/customers/${id}`, {
    method: 'DELETE',
  }),
  
  // Get customer by email
  getCustomerByEmail: (email) => apiCall(`/customers/email/${encodeURIComponent(email)}`),
  
  // Search customers
  searchCustomers: (keyword) => apiCall(`/customers/search?keyword=${encodeURIComponent(keyword)}`),
};

// Rental API functions
export const rentalAPI = {
  // Get all rentals
  getAllRentals: () => apiCall('/rentals'),
  
  // Get rental by ID
  getRentalById: (id) => apiCall(`/rentals/${id}`),
  
  // Create new rental
  createRental: (rentalData) => apiCall('/rentals', {
    method: 'POST',
    body: JSON.stringify(rentalData),
  }),
  
  // Update rental
  updateRental: (id, rentalData) => apiCall(`/rentals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(rentalData),
  }),
  
  // Delete rental
  deleteRental: (id) => apiCall(`/rentals/${id}`, {
    method: 'DELETE',
  }),
  
  // Complete rental
  completeRental: (id, actualReturnDate) => 
    apiCall(`/rentals/${id}/complete?actualReturnDate=${actualReturnDate}`, {
      method: 'PATCH',
    }),
  
  // Get rentals by customer
  getRentalsByCustomer: (customerId) => apiCall(`/rentals/customer/${customerId}`),
  
  // Get rentals by car
  getRentalsByCar: (carId) => apiCall(`/rentals/car/${carId}`),
  
  // Get rentals by status
  getRentalsByStatus: (status) => apiCall(`/rentals/status/${status}`),
  
  // Get overdue rentals
  getOverdueRentals: () => apiCall('/rentals/overdue'),
  
  // Get rentals by date range
  getRentalsByDateRange: (startDate, endDate) => 
    apiCall(`/rentals/date-range?startDate=${startDate}&endDate=${endDate}`),
  
  // Calculate rental cost
  calculateRentalCost: (carId, startDate, endDate) => 
    apiCall(`/rentals/calculate-cost?carId=${carId}&startDate=${startDate}&endDate=${endDate}`),
};

// Export default API object
const api = {
  cars: carAPI,
  customers: customerAPI,
  rentals: rentalAPI,
};

export default api;