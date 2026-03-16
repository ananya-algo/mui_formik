import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardHeader from '../components/DashboardHeader';
import BarChart from '../charts/Barcharts';
import LineChart from '../charts/Linecharts';
import DoughnutChart from '../charts/Piechart';
import ViolationDoughnutChart from '../charts/PiechartViolation';
import './HomePage.css';

const HomePage = ({ user = { sapId: 'Unknown' }, onLogout }) => {
  const navigate = useNavigate();

  const [dailyData,   setDailyData]   = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [kpis,        setKpis]        = useState([]);
  const [violations,  setViolations]  = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const [dailyRes, monthlyRes, kpisRes, violationsRes] = await Promise.all([
          axios.get('http://localhost:4000/api/dashboard/summary', {
            params: { type: 'daily' },
            headers: { 'Content-Type': 'application/json' }
          }),
          axios.get('http://localhost:4000/api/dashboard/summary', {
            params: { type: 'monthly' },
            headers: { 'Content-Type': 'application/json' }
          }),
          axios.get('http://localhost:4000/api/dashboard/kpis', {
            headers: { 'Content-Type': 'application/json' }
          }),
          axios.get('http://localhost:4000/api/dashboard/violations', {
            headers: { 'Content-Type': 'application/json' }
          }),
        ]);

        if (dailyRes.data?.success)      setDailyData(dailyRes.data.data);
        if (monthlyRes.data?.success)    setMonthlyData(monthlyRes.data.data);
        if (kpisRes.data?.success)       setKpis(kpisRes.data.data);
        if (violationsRes.data?.success) setViolations(violationsRes.data.data);

      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to load dashboard data.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleLogoutClick     = () => { onLogout(); navigate('/'); };
  const handleBack            = () => navigate('/');
  const handleMonthClick      = () => console.log('This Month clicked');
  const handleDownload        = () => console.log('Download clicked');
  const handleDateRangeChange = (e) => console.log('Date range:', e.target.value);

  // ── Loading ──────────────────────────────────
  if (loading) {
    return (
      <div className="homepage-container">
        <div className="homepage-navbar">
          <div className="homepage-navbar-left">
            <h2 className="homepage-navbar-title">Project INFINITI - Digital Plant</h2>
          </div>
        </div>
        <div className="homepage-loading">
          <div className="homepage-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────
  if (error) {
    return (
      <div className="homepage-container">
        <div className="homepage-navbar">
          <div className="homepage-navbar-left">
            <h2 className="homepage-navbar-title">Project INFINITI - Digital Plant</h2>
          </div>
          <div className="homepage-navbar-right">
            <button onClick={handleLogoutClick} className="homepage-logout-button">Logout</button>
          </div>
        </div>
        <div className="homepage-error">
          <p>⚠️ {error}</p>
          <button onClick={() => window.location.reload()} className="homepage-retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Main ─────────────────────────────────────
  return (
    <div className="homepage-container">
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
          <button onClick={handleLogoutClick} className="homepage-logout-button">
            Logout
          </button>
        </div>
      </div>

      <div className="homepage-content">
        <DashboardHeader
          onBack={handleBack}
          onMonthClick={handleMonthClick}
          onDateRangeChange={handleDateRangeChange}
          onDownload={handleDownload}
        />

        <div className="homepage-first-row">
          <div className="homepage-bar-chart-card">
            {dailyData && <BarChart data={dailyData} title="Daily Summary" />}
          </div>

          {kpis.map((kpi) => (
            <div className="homepage-doughnut-card" key={kpi.kpi_key}>
              <DoughnutChart
                percentage={kpi.kpi_value}
                label={kpi.kpi_label}
                color={kpi.color}
              />
            </div>
          ))}

          <div className="homepage-violation-card">
            {violations && <ViolationDoughnutChart data={violations} />}
          </div>
        </div>

        <div className="homepage-second-row">
          <div className="homepage-line-chart-card">
            {monthlyData && <LineChart data={monthlyData} title="Monthly Summary" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;