import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './Barcharts.css';

const BarChart = ({ data, title }) => {
  const chartOptions = {
    chart: {
      type: 'column',
      height: 170,
      backgroundColor: 'transparent'
    },
    title: {
      text: null
    },
    xAxis: {
      categories: data.categories,
      lineColor: '#e5e7eb',
      tickColor: '#e5e7eb',
      labels: {
        style: {
          fontSize: '11px'
        }
      }
    },
    yAxis: {
      title: {
        text: null
      },
      min: 0,
      max: 100,
      gridLineColor: '#e5e7eb',
      labels: {
        style: {
          fontSize: '11px'
        }
      }
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      column: {
        borderRadius: 3,
        pointPadding: 0.15,
        groupPadding: 0.15
      }
    },
    series: [
      {
        name: 'Plant Quality Rating',
        data: data.quality,
        color: '#3b82f6'
      },
      {
        name: 'Plan Compliance',
        data: data.compliance,
        color: '#f59e0b'
      }
    ],
    credits: {
      enabled: false
    },
    tooltip: {
      shared: true,
      valueSuffix: '%'
    }
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
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
      />
    </div>
  );
};

export default BarChart;