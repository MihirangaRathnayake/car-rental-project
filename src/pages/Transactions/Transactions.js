import React, { useState, useEffect } from 'react';
import {
  MdSearch,
  MdFilterList,
  MdDownload,
  MdTrendingUp,
  MdTrendingDown,
  MdAttachMoney,
  MdAccountBalance,
  MdVisibility,
  MdRefresh
} from 'react-icons/md';
import './Transactions.css';

/**
 * Transactions Page Component
 * Displays financial transactions and analytics
 */
const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateRange, setDateRange] = useState('thisMonth');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Mock data
  const mockTransactions = [
    {
      id: 1,
      type: 'income',
      category: 'Rental Payment',
      description: 'Booking BK001 - Toyota Camry',
      amount: 225.00,
      date: '2024-02-15T10:30:00Z',
      status: 'completed',
      reference: 'TXN001234'
    },
    {
      id: 2,
      type: 'income',
      category: 'Rental Payment',
      description: 'Booking BK002 - Honda Accord',
      amount: 350.00,
      date: '2024-02-14T14:15:00Z',
      status: 'completed',
      reference: 'TXN001235'
    },
    {
      id: 3,
      type: 'expense',
      category: 'Maintenance',
      description: 'BMW X5 - Oil Change & Service',
      amount: -150.00,
      date: '2024-02-13T09:20:00Z',
      status: 'completed',
      reference: 'TXN001236'
    },
    {
      id: 4,
      type: 'expense',
      category: 'Insurance',
      description: 'Monthly Insurance Premium',
      amount: -450.00,
      date: '2024-02-12T16:45:00Z',
      status: 'completed',
      reference: 'TXN001237'
    },
    {
      id: 5,
      type: 'income',
      category: 'Rental Payment',
      description: 'Booking BK003 - Mercedes C-Class',
      amount: 340.00,
      date: '2024-02-11T11:30:00Z',
      status: 'pending',
      reference: 'TXN001238'
    },
    {
      id: 6,
      type: 'expense',
      category: 'Fuel',
      description: 'Fuel for Toyota Camry',
      amount: -65.00,
      date: '2024-02-10T08:15:00Z',
      status: 'completed',
      reference: 'TXN001239'
    }
  ];

  const [summary, setSummary] = useState({
    totalIncome: 915.00,
    totalExpenses: -665.00,
    netProfit: 250.00,
    transactionCount: 6
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTransactions(mockTransactions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [dateRange]);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const handleExport = () => {
    console.log('Exporting transactions...');
    // Simulate export process
    const exportBtn = document.querySelector('.btn-primary');
    const originalText = exportBtn.innerHTML;
    exportBtn.innerHTML = '<div class="loading-spinner-small"></div> Exporting...';
    exportBtn.disabled = true;

    setTimeout(() => {
      exportBtn.innerHTML = originalText;
      exportBtn.disabled = false;
      alert('Transactions exported successfully!');
    }, 2000);
  };

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetails(true);
  };

  const handleRetryTransaction = (transactionId) => {
    console.log(`Retrying transaction ${transactionId}`);
    // Update transaction status to pending
    setTransactions(transactions.map(t =>
      t.id === transactionId
        ? { ...t, status: 'pending' }
        : t
    ));
  };

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

  const getTransactionIcon = (type) => {
    return type === 'income' ? <MdTrendingUp /> : <MdTrendingDown />;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
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
      <div className="transactions-loading">
        <div className="loading-spinner"></div>
        <p>Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="transactions-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">Track all financial transactions and cash flow</p>
        </div>
        <div className="header-actions">
          <select
            className="date-range-select"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="thisQuarter">This Quarter</option>
            <option value="thisYear">This Year</option>
          </select>
          <button className="btn btn-primary" onClick={handleExport}>
            <MdDownload />
            Export
          </button>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="financial-summary">
        <div className="summary-card income">
          <div className="summary-icon">
            <MdTrendingUp />
          </div>
          <div className="summary-content">
            <h3 className="summary-title">Total Income</h3>
            <p className="summary-amount">{formatCurrency(summary.totalIncome)}</p>
            <span className="summary-change positive">
              <MdTrendingUp /> +12.5% from last period
            </span>
          </div>
        </div>

        <div className="summary-card expense">
          <div className="summary-icon">
            <MdTrendingDown />
          </div>
          <div className="summary-content">
            <h3 className="summary-title">Total Expenses</h3>
            <p className="summary-amount">{formatCurrency(summary.totalExpenses)}</p>
            <span className="summary-change negative">
              <MdTrendingUp /> +8.3% from last period
            </span>
          </div>
        </div>

        <div className="summary-card profit">
          <div className="summary-icon">
            <MdAttachMoney />
          </div>
          <div className="summary-content">
            <h3 className="summary-title">Net Profit</h3>
            <p className="summary-amount">{formatCurrency(summary.netProfit)}</p>
            <span className="summary-change positive">
              <MdTrendingUp /> +15.2% from last period
            </span>
          </div>
        </div>

        <div className="summary-card transactions">
          <div className="summary-icon">
            <MdAccountBalance />
          </div>
          <div className="summary-content">
            <h3 className="summary-title">Transactions</h3>
            <p className="summary-amount">{summary.transactionCount}</p>
            <span className="summary-change positive">
              <MdTrendingUp /> +5.1% from last period
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="transactions-filters">
        <div className="search-container">
          <MdSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="type-filter"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expenses</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="transactions-table-container">
        <table className="transactions-table table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Type</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(transaction => (
              <tr key={transaction.id}>
                <td>
                  <span className="transaction-reference">{transaction.reference}</span>
                </td>
                <td>
                  <div className={`transaction-type ${transaction.type}`}>
                    {getTransactionIcon(transaction.type)}
                    <span>{transaction.type}</span>
                  </div>
                </td>
                <td>
                  <span className="transaction-category">{transaction.category}</span>
                </td>
                <td>
                  <span className="transaction-description">{transaction.description}</span>
                </td>
                <td>
                  <span className={`transaction-amount ${transaction.type}`}>
                    {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
                  </span>
                </td>
                <td>
                  <span className="transaction-date">{formatDate(transaction.date)}</span>
                </td>
                <td>
                  {getStatusBadge(transaction.status)}
                </td>
                <td>
                  <div className="transaction-actions">
                    <button
                      className="btn btn-secondary action-btn"
                      onClick={() => handleViewDetails(transaction)}
                      title="View details"
                    >
                      <MdVisibility />
                    </button>
                    {transaction.status === 'failed' && (
                      <button
                        className="btn btn-warning action-btn"
                        onClick={() => handleRetryTransaction(transaction.id)}
                        title="Retry transaction"
                      >
                        <MdRefresh />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTransactions.length === 0 && (
        <div className="no-transactions">
          <p>No transactions found matching your criteria.</p>
        </div>
      )}

      {/* Transaction Details Modal */}
      {showDetails && selectedTransaction && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Transaction Details</h2>
              <button className="modal-close" onClick={() => setShowDetails(false)}>
                ×
              </button>
            </div>
            <div className="transaction-details">
              <div className="detail-row">
                <span className="detail-label">Reference ID:</span>
                <span className="detail-value">{selectedTransaction.reference}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Type:</span>
                <span className={`detail-value transaction-type ${selectedTransaction.type}`}>
                  {getTransactionIcon(selectedTransaction.type)}
                  {selectedTransaction.type}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Category:</span>
                <span className="detail-value">{selectedTransaction.category}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Description:</span>
                <span className="detail-value">{selectedTransaction.description}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Amount:</span>
                <span className={`detail-value transaction-amount ${selectedTransaction.type}`}>
                  {selectedTransaction.type === 'expense' ? '-' : '+'}{formatCurrency(selectedTransaction.amount)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date:</span>
                <span className="detail-value">{formatDate(selectedTransaction.date)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className="detail-value">{getStatusBadge(selectedTransaction.status)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;