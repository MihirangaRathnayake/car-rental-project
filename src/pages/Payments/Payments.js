import React, { useState, useEffect } from 'react';
import { 
  MdAdd, 
  MdEdit, 
  MdDelete,
  MdPayment,
  MdCreditCard,
  MdAccountBalance,
  MdSearch,
  MdFilterList,
  MdRefresh,
  MdStar,
  MdStarBorder
} from 'react-icons/md';
import PaymentModal from '../../components/Payments/PaymentModal';
import './Payments.css';

/**
 * Payments Page Component
 * Manages payment methods and payment history
 */
const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('history');

  // Mock data
  const mockPayments = [
    {
      id: 1,
      bookingId: 'BK001',
      customerName: 'John Smith',
      amount: 225.00,
      method: 'Credit Card',
      cardLast4: '4532',
      status: 'completed',
      date: '2024-02-15T10:30:00Z',
      transactionId: 'TXN001234'
    },
    {
      id: 2,
      bookingId: 'BK002',
      customerName: 'Sarah Johnson',
      amount: 350.00,
      method: 'Debit Card',
      cardLast4: '8765',
      status: 'pending',
      date: '2024-02-14T14:15:00Z',
      transactionId: 'TXN001235'
    },
    {
      id: 3,
      bookingId: 'BK003',
      customerName: 'Mike Wilson',
      amount: 340.00,
      method: 'Bank Transfer',
      cardLast4: null,
      status: 'failed',
      date: '2024-02-13T09:20:00Z',
      transactionId: 'TXN001236'
    }
  ];

  const mockPaymentMethods = [
    {
      id: 1,
      type: 'Credit Card',
      provider: 'Visa',
      last4: '4532',
      expiryMonth: '12',
      expiryYear: '2025',
      isDefault: true,
      status: 'active'
    },
    {
      id: 2,
      type: 'Credit Card',
      provider: 'Mastercard',
      last4: '8765',
      expiryMonth: '08',
      expiryYear: '2026',
      isDefault: false,
      status: 'active'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPayments(mockPayments);
        setPaymentMethods(mockPaymentMethods);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payment data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddPaymentMethod = () => {
    setEditingPayment(null);
    setShowModal(true);
  };

  const handleEditPaymentMethod = (method) => {
    setEditingPayment(method);
    setShowModal(true);
  };

  const handleDeletePaymentMethod = (methodId) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      setPaymentMethods(paymentMethods.filter(method => method.id !== methodId));
    }
  };

  const handleSetDefault = (methodId) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === methodId
    })));
  };

  const handleRefreshPayments = () => {
    setLoading(true);
    setTimeout(() => {
      // Simulate refresh with slightly different data
      setPayments(prev => prev.map(payment => ({
        ...payment,
        amount: payment.amount + (Math.random() - 0.5) * 10
      })));
      setLoading(false);
    }, 1500);
  };

  const handleSavePaymentMethod = (methodData) => {
    if (editingPayment) {
      setPaymentMethods(paymentMethods.map(method => 
        method.id === editingPayment.id 
          ? { ...method, ...methodData }
          : method
      ));
    } else {
      const newMethod = {
        id: Date.now(),
        ...methodData,
        status: 'active'
      };
      setPaymentMethods([...paymentMethods, newMethod]);
    }
    setShowModal(false);
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusClasses = {
      completed: 'status-completed',
      pending: 'status-pending',
      failed: 'status-cancelled'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status]}`}>
        {status}
      </span>
    );
  };

  const getPaymentIcon = (method) => {
    switch (method.toLowerCase()) {
      case 'credit card':
      case 'debit card':
        return <MdCreditCard />;
      case 'bank transfer':
        return <MdAccountBalance />;
      default:
        return <MdPayment />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="payments-loading">
        <div className="loading-spinner"></div>
        <p>Loading payment data...</p>
      </div>
    );
  }

  return (
    <div className="payments-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Payment Management</h1>
          <p className="page-subtitle">Manage payment methods and transaction history</p>
        </div>
      </div>

      <div className="payments-tabs">
        <button 
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Payment History
        </button>
        <button 
          className={`tab-btn ${activeTab === 'methods' ? 'active' : ''}`}
          onClick={() => setActiveTab('methods')}
        >
          Payment Methods
        </button>
      </div>

      {activeTab === 'history' && (
        <div className="payment-history">
          <div className="payments-filters">
            <div className="search-container">
              <MdSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search payments..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            
            <button 
              className="btn btn-secondary"
              onClick={handleRefreshPayments}
              disabled={loading}
            >
              <MdRefresh />
              Refresh
            </button>
          </div>

          <div className="payments-table-container">
            <table className="payments-table table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Booking</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map(payment => (
                  <tr key={payment.id}>
                    <td>
                      <span className="transaction-id">{payment.transactionId}</span>
                    </td>
                    <td>
                      <span className="booking-id">{payment.bookingId}</span>
                    </td>
                    <td>
                      <span className="customer-name">{payment.customerName}</span>
                    </td>
                    <td>
                      <span className="payment-amount">${payment.amount.toFixed(2)}</span>
                    </td>
                    <td>
                      <div className="payment-method">
                        {getPaymentIcon(payment.method)}
                        <span>{payment.method}</span>
                        {payment.cardLast4 && (
                          <span className="card-last4">****{payment.cardLast4}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="payment-date">{formatDate(payment.date)}</span>
                    </td>
                    <td>
                      {getStatusBadge(payment.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="no-payments">
              <p>No payments found matching your criteria.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'methods' && (
        <div className="payment-methods">
          <div className="methods-header">
            <h2 className="methods-title">Saved Payment Methods</h2>
            <button className="btn btn-primary" onClick={handleAddPaymentMethod}>
              <MdAdd />
              Add Payment Method
            </button>
          </div>

          <div className="methods-grid">
            {paymentMethods.map(method => (
              <div key={method.id} className="method-card">
                <div className="method-header">
                  <div className="method-icon">
                    {getPaymentIcon(method.type)}
                  </div>
                  <div className="method-info">
                    <h3 className="method-type">{method.provider} {method.type}</h3>
                    <p className="method-number">**** **** **** {method.last4}</p>
                    <p className="method-expiry">Expires {method.expiryMonth}/{method.expiryYear}</p>
                  </div>
                  {method.isDefault && (
                    <span className="default-badge">Default</span>
                  )}
                </div>
                
                <div className="method-actions">
                  {!method.isDefault && (
                    <button 
                      className="btn btn-success"
                      onClick={() => handleSetDefault(method.id)}
                    >
                      <MdStar /> Set Default
                    </button>
                  )}
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleEditPaymentMethod(method)}
                  >
                    <MdEdit /> Edit
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDeletePaymentMethod(method.id)}
                    disabled={method.isDefault}
                  >
                    <MdDelete /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {paymentMethods.length === 0 && (
            <div className="no-methods">
              <p>No payment methods saved yet.</p>
              <button className="btn btn-primary" onClick={handleAddPaymentMethod}>
                <MdAdd />
                Add Your First Payment Method
              </button>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <PaymentModal
          paymentMethod={editingPayment}
          onSave={handleSavePaymentMethod}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Payments;