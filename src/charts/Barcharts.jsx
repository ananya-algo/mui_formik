import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './Barcharts.css';

// ✅ Ensures every value is a finite number — guards against null/string/undefined
const toNumberArray = (arr) =>
  Array.isArray(arr) ? arr.map(v => (isFinite(Number(v)) ? Number(v) : 0)) : [];

const BarChart = ({ data, title }) => {
  const categories = Array.isArray(data?.categories) ? data.categories : [];
  const quality    = toNumberArray(data?.quality);
  const compliance = toNumberArray(data?.compliance);

  // ✅ Don't render at all if no data
  if (!categories.length) return null;

  const chartOptions = {
    chart: {
      type: 'column',
      height: 140,
      backgroundColor: 'transparent',
      spacing: [10, 10, 10, 10],
    },
    title: { text: null },
    xAxis: {
      categories,
      lineColor: '#e5e7eb',
      tickColor: '#e5e7eb',
      labels: { style: { fontSize: '10px', color: '#6B7280' } },
    },
    yAxis: {
      title: { text: null },
      min: 0,
      max: 100,
      gridLineColor: '#f3f4f6',
      labels: { style: { fontSize: '10px', color: '#6B7280' } },
    },
    legend: { enabled: false },
    plotOptions: {
      column: { borderRadius: 3, pointPadding: 0.15, groupPadding: 0.15 },
    },
    series: [
      { name: 'Plant Quality Rating', data: quality,    color: '#0077B6' },
      { name: 'Plan Compliance',      data: compliance, color: '#EA8600' },
    ],
    credits: { enabled: false },
    tooltip: { shared: true, valueSuffix: '%' },
  };

  return (
    <div className="bar-chart-container">
      <h3 className="bar-chart-title">{title}</h3>
      <div className="bar-chart-legend">
        <span className="bar-chart-legend-item">
          <span className="bar-chart-legend-color quality"></span>
          Plant Quality Rating
        </span>
        <span className="bar-chart-legend-item">
          <span className="bar-chart-legend-color compliance"></span>
          Plan Compliance
        </span>
      </div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default BarChart;