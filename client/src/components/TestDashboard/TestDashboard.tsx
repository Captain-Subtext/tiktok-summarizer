import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TestDashboardNav } from './TestDashboardNav';
import { Navbar } from '../Navbar';
import './TestDashboard.css';

export const TestDashboard: React.FC = () => {
  const location = useLocation();

  return (
    <div className="app-container">
      <Navbar isLoggedIn={false} />
      <div className="dashboard-container">
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}; 