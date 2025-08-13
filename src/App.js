import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Cars from './pages/Cars/Cars';
import Bookings from './pages/Bookings/Bookings';
import Customers from './pages/Customers/Customers';
import Branches from './pages/Branches/Branches';
import Reports from './pages/Reports/Reports';
import CurrencyExchange from './pages/CurrencyExchange/CurrencyExchange';
import Payments from './pages/Payments/Payments';
import Transactions from './pages/Transactions/Transactions';
import CarReports from './pages/CarReports/CarReports';
import CarList from './components/Cars/CarList';
import CustomerList from './components/Customers/CustomerList';
import RentalList from './components/Rentals/RentalList';
import './App.css';
import './styles/icons.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cars" element={<CarList />} />
            <Route path="/bookings" element={<RentalList />} />
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/currency-exchange" element={<CurrencyExchange />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/car-reports" element={<CarReports />} />
            <Route path="/admin/cars" element={<Cars />} />
            <Route path="/admin/bookings" element={<Bookings />} />
            <Route path="/admin/customers" element={<Customers />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;