import React from 'react';
import { MdMenu, MdSearch, MdNotifications } from 'react-icons/md';
import { IoChevronDown } from 'react-icons/io5';
import './Header.css';

/**
 * Header Component
 * Contains search bar, notifications, and user profile
 */
const Header = ({ onMenuClick }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-btn" onClick={onMenuClick}>
          <MdMenu className="menu-icon" />
        </button>
        <div className="header-title">
          <h1>Today's Statistics</h1>
          <p className="header-date">{currentDate}</p>
        </div>
      </div>

      <div className="header-center">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search here..."
            className="search-input"
          />
          <button className="search-btn">
            <MdSearch />
          </button>
        </div>
      </div>

      <div className="header-right">
        <button className="notification-btn">
          <MdNotifications className="notification-icon" />
          <span className="notification-badge">3</span>
        </button>

        <div className="user-profile">
          <div className="user-avatar">
            <span>AD</span>
          </div>
          <div className="user-info">
            <span className="user-name">Admin</span>
            <IoChevronDown className="user-dropdown" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;