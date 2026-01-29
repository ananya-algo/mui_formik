import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import BarChart from '../charts/Barcharts';
import LineChart from '../charts/Linecharts';
import DoughnutChart from '../charts/Piechart';
import ViolationDoughnutChart from '../charts/PiechartViolation';
import './HomePage.css';

const dailySummaryData = {
  categories: ['01/06', '02/06', '03/06', '04/06', '05/06', '06/06', '07/06', '08/06', '09/06'],
  quality: [95, 88, 92, 85, 90, 93, 89, 94, 91],
  compliance: [92, 85, 90, 88, 86, 91, 87, 92, 89]
};

const monthlySummaryData = {
  categories: ['07/2024', '08/2024', '09/2024', '10/2024', '11/2024', '12/2024', '01/2025', '02/2025', '03/2025', '04/2025', '05/2025', '06/2025'],
  quality: [88, 90, 92, 94, 85, 88, 91, 93, 89, 87, 90, 95],
  compliance: [85, 88, 90, 82, 87, 86, 89, 91, 88, 85, 88, 92]
};

const HomePage = ({ user = { sapId: 'Unknown' }, onLogout }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    console.log('Back button clicked');
    navigate('/');
  };

  const handleMonthClick = () => {
    console.log('This Month button clicked');

  };

  const handleDateRangeChange = (event) => {
    console.log('Date range changed:', event.target.value);
  
  };

  const handleDownload = () => {
    console.log('Download button clicked');
   
  };

  const handleLogoutClick = () => {
    
    onLogout();
    navigate('/');
  };

  return (
    <div className="homepage-container">
      {/* Top Navbar */}
      <div className="homepage-navbar">
        <div className="homepage-navbar-left">
          <h2 className="homepage-navbar-title">Project INFINITI - Digital Plant</h2>
        </div>
        <div className="homepage-navbar-right">
          {user && (
            <span className="homepage-user-info">
              Welcome, <strong>{user.sapId}</strong>
            </span>
          )}
          <button 
            onClick={handleLogoutClick}
            className="homepage-logout-button"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="homepage-content">
        {/* Dashboard Header */}
        <DashboardHeader 
          onBack={handleBack}
          onMonthClick={handleMonthClick}
          onDateRangeChange={handleDateRangeChange}
          onDownload={handleDownload}
        />

        <div className="homepage-first-row">
          <div className="homepage-bar-chart-card">
            <BarChart data={dailySummaryData} title="Daily Summary" />
          </div>
          
          <div className="homepage-doughnut-card">
            <DoughnutChart percentage={89.86} label="Monthly Plan Compliance" color="#4ade80" />
          </div>
          
          <div className="homepage-doughnut-card">
            <DoughnutChart percentage={93.8} label="MTD Plant Quality Rating" color="#4ade80" />
          </div>
          
          <div className="homepage-doughnut-card">
            <DoughnutChart percentage={92.9} label="YTD Plant Quality Rating" color="#4ade80" />
          </div>
          
          <div className="homepage-violation-card">
            <ViolationDoughnutChart />
          </div>
        </div>

        <div className="homepage-second-row">
          <div className="homepage-line-chart-card">
            <LineChart data={monthlySummaryData} title="Monthly Summary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;