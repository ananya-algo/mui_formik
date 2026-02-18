import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './PiechartViolation.css';

const ViolationsPieChart = ({ data }) => {
  // ✅ Always cast to Number — never pass null/undefined to Highcharts
  const closed     = Number(data?.closed     ?? 0);
  const open       = Number(data?.open       ?? 0);
  const total      = Number(data?.total      ?? 0);
  const percentage = Number(data?.percentage ?? 0);

  // ✅ Don't render if no data has loaded yet
  if (!total) return null;

  const chartOptions = {
    chart: {
      type: 'pie',
      height: 145,
      width: 145,
      backgroundColor: 'transparent',
      spacing: [0, 0, 0, 0],
      margin: [0, 0, 0, 0],
    },
    title: {
      text: `${percentage}%`,
      align: 'center',
      verticalAlign: 'middle',
      style: { fontSize: '11px', fontWeight: 'bold', color: '#34A853' },
      y: 2,
    },
    tooltip: { pointFormat: '{series.name}: <b>{point.y}</b>' },
    plotOptions: {
      pie: {
        innerSize: '75%',
        dataLabels: { enabled: false },
        enableMouseTracking: false,
        states: { hover: { enabled: false } },
        borderWidth: 0,
        center: ['50%', '50%'],
      },
    },
    series: [{
      name: 'Violations',
      // ✅ y values are guaranteed Numbers
      data: [
        { name: 'Closed', y: closed, color: '#4ade80' },
        { name: 'Open',   y: open,   color: '#ef4444' },
      ],
    }],
    credits: { enabled: false },
  };

  return (
    <div className="violations-chart-container">
      <h3 className="violations-chart-title">Violations Closure Summary</h3>
      <div className="violations-content">
        <div className="violations-chart-wrapper">
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
        <div className="violations-stats">
          <div>
            <div className="violations-total-label">Total Violations</div>
            <div className="violations-total-value">{total}</div>
          </div>
          <div className="violations-breakdown">
            <div>
              <div className="violations-stat-item-label">
                <span className="violations-stat-dot closed"></span>Closed
              </div>
              <div className="violations-stat-value">{closed}</div>
            </div>
            <div>
              <div className="violations-stat-item-label">
                <span className="violations-stat-dot open"></span>Open
              </div>
              <div className="violations-stat-value">{open}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViolationsPieChart;