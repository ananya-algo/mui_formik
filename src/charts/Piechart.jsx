import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './Piechart.css';

const PieChart = ({ percentage, label, color = '#4ade80' }) => {
  const chartOptions = {
    chart: {
      type: 'pie',
      height: 200,
      backgroundColor: 'transparent'
    },
    title: {
      text: `${percentage}%`,
      align: 'center',
      verticalAlign: 'middle',
      style: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#1f2937'
      },
      y: 5
    },
    tooltip: {
      enabled: false
    },
    plotOptions: {
      pie: {
        innerSize: '75%',
        dataLabels: {
          enabled: false
        },
        enableMouseTracking: false,
        states: {
          hover: {
            enabled: false
          }
        }
      }
    },
    series: [{
      name: 'Percentage',
      data: [
        { y: percentage, color: color },
        { y: 100 - percentage, color: '#e5e7eb' }
      ]
    }],
    credits: {
      enabled: false
    }
  };

  return (
    <div className="pie-chart-container">
      <h3 className="pie-chart-title">{label}</h3>
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
        containerProps={{ className: 'pie-chart-wrapper' }}
      />
    </div>
  );
};

export default PieChart;