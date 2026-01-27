import React from 'react';
import BarChart from '../charts/Barcharts';
import LineChart from '../charts/Linecharts';
import PieChart from '../charts/Piechart';
import ViolationsPieChart from '../charts/PiechartViolation';
import './HomePage.css';

// Sample data
const dailySummaryData = {
  categories: ['01/06', '02/06', '03/06', '04/06', '05/06', '06/06', '07/06', '08/06', '09/06'],
  quality: [95, 88, 92, 85, 90, 93, 89, 94, 91],
  compliance: [92, 85, 90, 88, 86, 91, 87, 92, 89]
};

const monthlySummaryData = {
  categories: ['07/2024', '08/2024', '09/2024', '10/2024', '11/2024', '12/2024', '01/2025', '02/2025', '03/2025', '04/2025', '05/2025', '06/2025'],
  quality: [88, 90, 92, 78, 85, 88, 91, 93, 89, 87, 90, 95],
  compliance: [85, 88, 90, 82, 87, 86, 89, 91, 88, 85, 88, 92]
};

const HomePage = ({ user = { email: 'user@example.com' }, onLogout }) => {
  return (
    <div className="homepage-container">
      <nav className="homepage-navbar">
        <h1 className="homepage-navbar-title">Dashboard</h1>
        <button onClick={onLogout} className="homepage-logout-button">
          Logout
        </button>
      </nav>

      <div className="homepage-content">
        <div className="homepage-welcome">
          <h2 className="homepage-welcome-title">Welcome, {user.email}!</h2>
          <p className="homepage-welcome-subtitle">
            Here's your analytics dashboard overview
          </p>
        </div>

        {/*Bar Chart + 4 Donuts Horizontally */}
        <div className="homepage-charts-grid">
          {/* Bar Chart */}
          <BarChart data={dailySummaryData} title="Daily Summary" />

          {/* Four Donut Charts */}
          <PieChart percentage={89.86} label="Monthly Plan Compliance" color="#4ade80" />
          <PieChart percentage={93.8} label="MTD Plant Quality Rating" color="#4ade80" />
          <PieChart percentage={92.9} label="YTD Plant Quality Rating" color="#4ade80" />
          <ViolationsPieChart />
        </div>

        {/* Line Chart */}
        <div className="homepage-monthly-section">
          <LineChart data={monthlySummaryData} title="Monthly Summary" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;