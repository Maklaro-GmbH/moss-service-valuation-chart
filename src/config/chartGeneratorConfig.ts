import type { ChartConfiguration } from 'chart.js'

const configuration: ChartConfiguration = {
  type: 'line',
  options: {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        align: 'end',
        labels: {
          usePointStyle: true,
          boxWidth: 50,
          padding: 10
        }
      }
    },
    scales: {
      'x-axis': {
        display: true,
        position: 'bottom',
        grid: {
          display: false,
          drawBorder: false,
          drawOnChartArea: false,
          lineWidth: 1,
          tickLength: 10
        },
        ticks: {
          maxRotation: 0,
          minRotation: 0,
          padding: 0
        }
      }
    },
    elements: {
      point: {
        radius: 0
      }
    }
  },
  data: {
    datasets: []
  }
}

export default configuration
