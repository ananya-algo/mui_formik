import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './Piechart.css';

const PieChart = ({ percentage, label, color = '#34A853' }) => {
  const chartOptions = {
    chart: {
      type: 'pie',
      height: 145,
      width: 145,
      backgroundColor: 'transparent',
      spacing: [0, 0, 0, 0],
      margin: [0, 0, 0, 0]
    },
    title: {
      text: `${percentage}%`,
      align: 'center',
      verticalAlign: 'middle',
      style: {
        fontSize: '11px',
        fontWeight: 'bold',
        color: '#34A853',
        lineHeight: '11px'
      },
      y: 2,
      x: 0
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
        },
        borderWidth: 0,
        center: ['50%', '50%']
      }
    },
    series: [{
      name: 'Percentage',
      data: [
        { y: percentage, color: color },
        { y: 100 - percentage, color: '#E5E7EB' }
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