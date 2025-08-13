import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MdDashboard, 
  MdDirectionsCar, 
  MdCalendarToday, 
  MdPeople,
  MdBusiness,
  MdAssessment,
  MdPayment,
  MdAccountBalanceWallet,
  MdDescription,
  MdCurrencyExchange,
  MdLogout
} from 'react-icons/md';
import { FaCar } from 'react-icons/fa';
import './Sidebar.css';

/**
 * Sidebar Navigation Component
 * Contains navigation links and branding
 */
const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigationItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: MdDashboard
    },
    {
      path: '/cars',
      name: 'Cars',
      icon: MdDirectionsCar
    },
    {
      path: '/bookings',
      name: 'Bookings',
      icon: MdCalendarToday
    },
    {
      path: '/customers',
      name: 'Customers',
      icon: MdPeople
    },
    {
      path: '/branches',
      name: 'Branches',
      icon: MdBusiness
    }
  ];

  const isActive = (path) => {
    return location.pathname === path || (path === '/dashboard' && location.pathname === '/');
  };

  const isFooterActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Logo Section */}
        <div className="sidebar-header">
          <div className="logo">
            <FaCar className="logo-icon" />
            <span className="logo-text">CAR RENT</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive(item.path) ? 'nav-item-active' : ''}`}
                onClick={onClose}
              >
                <IconComponent className="nav-icon" />
                <span className="nav-text">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="sidebar-footer">
          <Link 
            to="/reports" 
            className={`nav-item ${isFooterActive('/reports') ? 'nav-item-active' : ''}`} 
            onClick={onClose}
          >
            <MdAssessment className="nav-icon" />
            <span className="nav-text">Report</span>
          </Link>
          <Link 
            to="/currency-exchange" 
            className={`nav-item ${isFooterActive('/currency-exchange') ? 'nav-item-active' : ''}`} 
            onClick={onClose}
          >
            <MdCurrencyExchange className="nav-icon" />
            <span className="nav-text">Currency Exchange</span>
          </Link>
          <Link 
            to="/payments" 
            className={`nav-item ${isFooterActive('/payments') ? 'nav-item-active' : ''}`} 
            onClick={onClose}
          >
            <MdPayment className="nav-icon" />
            <span className="nav-text">Payment Details</span>
          </Link>
          <Link 
            to="/transactions" 
            className={`nav-item ${isFooterActive('/transactions') ? 'nav-item-active' : ''}`} 
            onClick={onClose}
          >
            <MdAccountBalanceWallet className="nav-icon" />
            <span className="nav-text">Transactions</span>
          </Link>
          <Link 
            to="/car-reports" 
            className={`nav-item ${isFooterActive('/car-reports') ? 'nav-item-active' : ''}`} 
            onClick={onClose}
          >
            <MdDescription className="nav-icon" />
            <span className="nav-text">Car Report</span>
          </Link>
          
          <div className="logout-section">
            <button className="logout-btn" onClick={() => {
              if (window.confirm('Are you sure you want to logout?')) {
                // In real app, this would handle logout logic
                console.log('Logging out...');
              }
            }}>
              <MdLogout className="nav-icon" />
              <span className="nav-text">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;