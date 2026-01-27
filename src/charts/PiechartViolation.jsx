import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './PiechartViolation.css';

const ViolationsPieChart = () => {
  const chartOptions = {
    chart: {
      type: 'pie',
      height: 200,
      backgroundColor: 'transparent'
    },
    title: {
      text: '87.5%',
      align: 'center',
      verticalAlign: 'middle',
      style: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#1f2937'
      },
      y: 0
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y}</b>'
    },
    plotOptions: {
      pie: {
        innerSize: '70%',
        dataLabels: {
          enabled: false
        },
        states: {
          hover: {
            brightness: 0.1
          }
        }
      }
    },
    series: [{
      name: 'Violations',
      data: [
        { name: 'Closed', y: 14, color: '#4ade80' },
        { name: 'Open', y: 2, color: '#ef4444' }
      ]
    }],
    credits: {
      enabled: false
    }
  };

  return (
    <div className="violations-chart-container">
      <h3 className="violations-chart-title">Violations Closure Summary</h3>
      
      <div className="violations-content">
        <div className="violations-chart-wrapper">
          <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
          />
        </div>
        
        <div className="violations-stats">
          <div>
            <div className="violations-total-label">Total Violations</div>
            <div className="violations-total-value">16</div>
          </div>
          <div className="violations-breakdown">
            <div>
              <div className="violations-stat-item-label">
                <span className="violations-stat-dot closed"></span>
                Closed
              </div>
              <div className="violations-stat-value">14</div>
            </div>
            <div>
              <div className="violations-stat-item-label">
                <span className="violations-stat-dot open"></span>
                Open
              </div>
              <div className="violations-stat-value">2</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViolationsPieChart;