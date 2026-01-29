import React from 'react';
import { IoArrowBack, IoChevronDown } from 'react-icons/io5';
import { HiDownload } from 'react-icons/hi';
import './DashboardHeader.css';

const DashboardHeader = ({ onBack, onMonthClick, onDateRangeChange, onDownload }) => {
  return (
    <div className="dashboard-header">
      {/* Left Section */}
      <div className="dashboard-header-left">
        <button className="back-arrow-button" onClick={onBack} aria-label="Go back">
          <IoArrowBack className="back-arrow-icon" />
        </button>
        <h1 className="dashboard-header-title">Process Audit Dashboard</h1>
      </div>

      {/* Right Section */}
      <div className="dashboard-header-right">
        {/* This Month Pill Button */}
        <button className="month-pill-button" onClick={onMonthClick}>
          This Month
        </button>

        {/* Date Range Dropdown */}
        <div className="date-range-dropdown">
          <select 
            className="date-range-select"
            onChange={onDateRangeChange}
            defaultValue=""
          >
            <option value="" disabled>Date Range</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="custom">Custom Range</option>
          </select>
          <IoChevronDown className="dropdown-arrow" />
        </div>

        {/* Download Button */}
        <button className="download-button" onClick={onDownload} aria-label="Download">
          <HiDownload className="download-icon" />
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;