import React, { useState, useEffect } from 'react';
import BookingModal from '../../components/Bookings/BookingModal';
import './Bookings.css';

// Icon component for CDN-based icons
const Icon = ({ type, className = "", style = "fontawesome" }) => {
  const fontAwesomeMap = {
    add: "fas fa-plus",
    edit: "fas fa-edit",
    confirm: "fas fa-check-circle",
    complete: "fas fa-tasks",
    delete: "fas fa-trash",
    search: "fas fa-search"
  };

  const materialIconsMap = {
    add: "add",
    edit: "edit",
    confirm: "check_circle",
    complete: "task_alt",
    delete: "delete",
    search: "search"
  };

  if (style === "material") {
    return <span className={`material-icons ${className}`}>{materialIconsMap[type]}</span>;
  }

  return <i className={`${fontAwesomeMap[type]} ${className}`}></i>;
};

/**
 * Bookings Management Page
 * Handles listing and managing car rental bookings
 */
const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - in real app, this would come from API
  const mockBookings = [
    {
      id: 1,
      bookingId: 'BK001',
      customerName: 'John Smith',
      customerEmail: 'john@example.com',
      customerPhone: '+1 234-567-8900',
      carMake: 'Toyota',
      carModel: 'Camry',
      licensePlate: 'ABC-123',
      startDate: '2024-02-15',
      endDate: '2024-02-20',
      totalDays: 5,
      dailyRate: 45.00,
      totalAmount: 225.00,
      status: 'confirmed',
      createdAt: '2024-02-10T10:30:00Z'
    },
    {
      id: 2,
      bookingId: 'BK002',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah@example.com',
      customerPhone: '+1 234-567-8901',
      carMake: 'Honda',
      carModel: 'Accord',
      licensePlate: 'XYZ-789',
      startDate: '2024-02-18',
      endDate: '2024-02-25',
      totalDays: 7,
      dailyRate: 50.00,
      totalAmount: 350.00,
      status: 'pending',
      createdAt: '2024-02-12T14:15:00Z'
    },
    {
      id: 3,
      bookingId: 'BK003',
      customerName: 'Mike Wilson',
      customerEmail: 'mike@example.com',
      customerPhone: '+1 234-567-8902',
      carMake: 'BMW',
      carModel: 'X5',
      licensePlate: 'BMW-001',
      startDate: '2024-02-10',
      endDate: '2024-02-14',
      totalDays: 4,
      dailyRate: 85.00,
      totalAmount: 340.00,
      status: 'completed',
      createdAt: '2024-02-08T09:20:00Z'
    },
    {
      id: 4,
      bookingId: 'BK004',
      customerName: 'Emily Davis',
      customerEmail: 'emily@example.com',
      customerPhone: '+1 234-567-8903',
      carMake: 'Mercedes',
      carModel: 'C-Class',
      licensePlate: 'MER-456',
      startDate: '2024-02-22',
      endDate: '2024-02-28',
      totalDays: 6,
      dailyRate: 75.00,
      totalAmount: 450.00,
      status: 'cancelled',
      createdAt: '2024-02-14T16:45:00Z'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchBookings = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBookings(mockBookings);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleAddBooking = () => {
    setEditingBooking(null);
    setShowModal(true);
  };

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setShowModal(true);
  };

  const handleUpdateStatus = (bookingId, newStatus) => {
    setBookings(bookings.map(booking =>
      booking.id === bookingId
        ? { ...booking, status: newStatus }
        : booking
    ));
  };

  const handleDeleteBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      setBookings(bookings.filter(booking => booking.id !== bookingId));
    }
  };

  const handleSaveBooking = (bookingData) => {
    if (editingBooking) {
      // Update existing booking
      setBookings(bookings.map(booking =>
        booking.id === editingBooking.id
          ? { ...booking, ...bookingData }
          : booking
      ));
    } else {
      // Add new booking
      const newBooking = {
        id: Date.now(),
        bookingId: `BK${String(Date.now()).slice(-3)}`,
        ...bookingData,
        createdAt: new Date().toISOString()
      };
      setBookings([...bookings, newBooking]);
    }
    setShowModal(false);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.carMake.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.carModel.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusClasses = {
      confirmed: 'status-confirmed',
      pending: 'status-pending',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };

    return (
      <span className={`status-badge ${statusClasses[status]}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bookings-loading">
        <div className="loading-spinner"></div>
        <p>Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="bookings-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Bookings Management</h1>
          <p className="page-subtitle">Manage car rental bookings and reservations</p>
        </div>
        <button className="btn btn-primary" onClick={handleAddBooking}>
          <Icon type="add" style="material" />
          New Booking
        </button>
      </div>

      <div className="bookings-filters">
        <div className="search-container">
          <div className="search-input-wrapper">
            <Icon type="search" className="search-icon" style="material" />
            <input
              type="text"
              placeholder="Search bookings..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <select
          className="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bookings-table-container">
        <table className="bookings-table table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Car</th>
              <th>Duration</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map(booking => (
              <tr key={booking.id}>
                <td>
                  <span className="booking-id">{booking.bookingId}</span>
                </td>
                <td>
                  <div className="customer-info">
                    <div className="customer-name">{booking.customerName}</div>
                  </div>
                </td>
                <td>
                  <div className="car-info">
                    <div className="car-name">{booking.carMake} {booking.carModel}</div>
                    <div className="license-plate">{booking.licensePlate}</div>
                  </div>
                </td>

                <td>
                  <span className="duration">{booking.totalDays} days</span>
                </td>
                <td>
                  <div className="amount-info">
                    <div className="total-amount">${booking.totalAmount.toFixed(2)}</div>
                    <div className="daily-rate">${booking.dailyRate}/day</div>
                  </div>
                </td>
                <td>
                  {getStatusBadge(booking.status)}
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-secondary action-btn"
                      onClick={() => handleEditBooking(booking)}
                      title="Edit booking"
                    >
                      <Icon type="edit" style="material" />
                    </button>
                    {booking.status === 'pending' && (
                      <button
                        className="btn btn-success action-btn"
                        onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                        title="Confirm booking"
                      >
                        <Icon type="confirm" style="material" />
                      </button>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        className="btn btn-warning action-btn"
                        onClick={() => handleUpdateStatus(booking.id, 'completed')}
                        title="Mark as completed"
                      >
                        <Icon type="complete" style="material" />
                      </button>
                    )}
                    <button
                      className="btn btn-danger action-btn"
                      onClick={() => handleDeleteBooking(booking.id)}
                      title="Delete booking"
                    >
                      <Icon type="delete" style="material" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredBookings.length === 0 && (
        <div className="no-bookings">
          <p>No bookings found matching your criteria.</p>
        </div>
      )}

      {showModal && (
        <BookingModal
          booking={editingBooking}
          onSave={handleSaveBooking}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Bookings;