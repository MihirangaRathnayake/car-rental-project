import React from 'react';

const IconTest = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
      <h3>Font Awesome Icon Test</h3>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
        
        {/* Dashboard Icons */}
        <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '8px' }}>
          <h4>Dashboard Icons</h4>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <i className="fas fa-car" style={{ fontSize: '24px', color: '#333' }}></i>
            <i className="fas fa-users" style={{ fontSize: '24px', color: '#333' }}></i>
            <i className="fas fa-clipboard-list" style={{ fontSize: '24px', color: '#333' }}></i>
            <i className="fas fa-dollar-sign" style={{ fontSize: '24px', color: '#333' }}></i>
          </div>
        </div>

        {/* Action Icons */}
        <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '8px' }}>
          <h4>Action Icons</h4>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <i className="fas fa-plus" style={{ fontSize: '18px', color: '#333' }}></i>
            <i className="fas fa-edit" style={{ fontSize: '18px', color: '#333' }}></i>
            <i className="fas fa-trash" style={{ fontSize: '18px', color: '#333' }}></i>
            <i className="fas fa-search" style={{ fontSize: '18px', color: '#333' }}></i>
          </div>
        </div>

        {/* Status Icons */}
        <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '8px' }}>
          <h4>Status Icons</h4>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <i className="fas fa-check-circle" style={{ fontSize: '18px', color: '#28a745' }}></i>
            <i className="fas fa-times-circle" style={{ fontSize: '18px', color: '#dc3545' }}></i>
            <i className="fas fa-wrench" style={{ fontSize: '18px', color: '#ffc107' }}></i>
            <i className="fas fa-exclamation-triangle" style={{ fontSize: '18px', color: '#ff6b35' }}></i>
          </div>
        </div>

        {/* Loading Icon */}
        <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '8px' }}>
          <h4>Loading Icon</h4>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '18px', color: '#333' }}></i>
        </div>

      </div>
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: 'white', borderRadius: '8px' }}>
        <h4>Button Examples</h4>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
            <i className="fas fa-plus"></i> Add Item
          </button>
          <button style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
            <i className="fas fa-save"></i> Save
          </button>
          <button style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
            <i className="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default IconTest;