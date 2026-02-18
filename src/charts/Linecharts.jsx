import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './Linecharts.css';

const toNumberArray = (arr) =>
  Array.isArray(arr) ? arr.map(v => (isFinite(Number(v)) ? Number(v) : 0)) : [];

const LineChart = ({ data, title }) => {
  const categories = Array.isArray(data?.categories) ? data.categories : [];
  const quality    = toNumberArray(data?.quality);
  const compliance = toNumberArray(data?.compliance);

  // ✅ Don't render at all if no data
  if (!categories.length) return null;

  const chartOptions = {
    chart: {
      type: 'line',
      height: 140,
      backgroundColor: 'transparent',
      spacing: [10, 10, 10, 10],
    },
    title: { text: null },
    xAxis: {
      categories,
      lineColor: '#D1D5DB',
      lineWidth: 1,
      tickColor: '#D1D5DB',
      tickWidth: 1,
      labels: { style: { fontSize: '9px', color: '#6B7280' } },
    },
    yAxis: {
      title: { text: null },
      min: 80,
      max: 100,
      tickInterval: 5,
      gridLineColor: '#E5E7EB',
      gridLineWidth: 1,
      labels: {
        style: { fontSize: '9px', color: '#6B7280' },
        format: '{value}%',
      },
      tickPositions: [80, 85, 90, 95, 100],
    },
    legend: { enabled: false },
    plotOptions: {
      line: {
        marker: { radius: 4, enabled: true, symbol: 'circle' },
        lineWidth: 2,
        dataLabels: {
          enabled: true,
          style: { fontSize: '9px', fontWeight: 'normal', textOutline: 'none' },
          format: '{y}%',
        },
      },
    },
    series: [
      {
        name: 'Plant Quality Rating',
        data: quality,
        color: '#0077B6',
        dataLabels: { color: '#0077B6' },
      },
      {
        name: 'Plan Compliance',
        data: compliance,
        color: '#EA8600',
        dataLabels: { color: '#EA8600' },
      },
    ],
    credits: { enabled: false },
    tooltip: { shared: true, valueSuffix: '%' },
  };

  return (
    <div className="line-chart-container">
      <div className="line-chart-header">
        {title}
        <div className="line-chart-legend">
          <span className="line-chart-legend-item">
            <span className="line-chart-legend-color quality"></span>
            Plant Quality Rating
          </span>
          <span className="line-chart-legend-item">
            <span className="line-chart-legend-color compliance"></span>
            Plan Compliance
          </span>
        </div>
      </div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default LineChart;