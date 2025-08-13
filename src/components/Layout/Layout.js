import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

/**
 * Main Layout Component
 * Provides the overall structure with sidebar and header
 */
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Header onMenuClick={toggleSidebar} />
        <main className="content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;