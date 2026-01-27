import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './Linecharts.css';

const LineChart = ({ data, title }) => {
  const chartOptions = {
    chart: {
      type: 'line',
      height: 280,
      backgroundColor: 'transparent'
    },
    title: {
      text: null
    },
    xAxis: {
      categories: data.categories,
      lineColor: '#e5e7eb',
      tickColor: '#e5e7eb'
    },
    yAxis: {
      title: {
        text: null
      },
      min: 0,
      max: 100,
      gridLineColor: '#e5e7eb'
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      line: {
        marker: {
          enabled: true,
          radius: 4
        }
      }
    },
    series: [
      {
        name: 'Plant Quality Rating',
        data: data.quality,
        color: '#3b82f6',
        lineWidth: 2
      },
      {
        name: 'Plan Compliance',
        data: data.compliance,
        color: '#f59e0b',
        lineWidth: 2
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
    <div className="line-chart-container">
      <h3 className="line-chart-header">
        {title}
        <span className="line-chart-legend">
          <span className="line-chart-legend-item">
            <span className="line-chart-legend-color quality"></span>
            Plant Quality Rating
          </span>
          <span className="line-chart-legend-item">
            <span className="line-chart-legend-color compliance"></span>
            Plan Compliance
          </span>
        </span>
      </h3>
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
      />
    </div>
  );
};

export default LineChart;