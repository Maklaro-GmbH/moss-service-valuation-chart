const payload = {
  data: {
    datasets: [
      {
        borderColor: '#0e74b6',
        borderWidth: 4,
        data: [
          {
            date: '06.2018',
            y: 636000
          },
          {
            date: '09.2018',
            y: 649000
          },
          {
            date: '12.2018',
            y: 661000
          },
          {
            date: '03.2019',
            y: 673000
          },
          {
            date: '06.2019',
            y: 680000
          },
          {
            date: '09.2019',
            y: 720000
          },
          {
            date: '12.2019',
            y: 725000
          },
          {
            date: '03.2020',
            y: 728000
          },
          {
            date: '09.2014',
            y: 511000
          },
          {
            date: '12.2014',
            y: 519000
          },
          {
            date: '03.2015',
            y: 540000
          },
          {
            date: '06.2015',
            y: 534000
          },
          {
            date: '09.2015',
            y: 540000
          },
          {
            date: '12.2015',
            y: 561000
          },
          {
            date: '03.2016',
            y: 566000
          },
          {
            date: '06.2016',
            y: 570000
          },
          {
            date: '09.2016',
            y: 579000
          },
          {
            date: '12.2016',
            y: 595000
          },
          {
            date: '03.2017',
            y: 599000
          },
          {
            date: '06.2017',
            y: 606000
          },
          {
            date: '09.2017',
            y: 604000
          },
          {
            date: '12.2017',
            y: 616000
          },
          {
            date: '03.2018',
            y: 637000
          },
          {
            date: '06.2018',
            y: 636000
          },
          {
            date: '09.2018',
            y: 649000
          },
          {
            date: '12.2018',
            y: 661000
          },
          {
            date: '03.2019',
            y: 673000
          },
          {
            date: '06.2019',
            y: 680000
          },
          {
            date: '09.2019',
            y: 720000
          },
          {
            date: '12.2019',
            y: 725000
          },
          {
            date: '03.2020',
            y: 728000
          }
        ],
        fill: false,
        label: 'Kaufpreisentwicklung',
        pointRadius: 0,
        pointStyle: 'line',
        xAxisID: 'x-axis',
        yAxisID: 'y-axis-0'
      },
      {
        bezierCurve: false,
        borderCapStyle: 'round',
        borderColor: '#0e74b6',
        borderDash: [0, 10],
        borderDashOffset: [0, 5],
        borderWidth: 4,
        data: [
          {
            date: '06.2018',
            y: 3.73
          },
          {
            date: '09.2018',
            y: 4.13
          },
          {
            date: '12.2018',
            y: 4.17
          },
          {
            date: '03.2019',
            y: 4.2
          },
          {
            date: '06.2019',
            y: 4.33
          },
          {
            date: '09.2019',
            y: 4.3
          },
          {
            date: '12.2019',
            y: 4.44
          }
        ],
        fill: false,
        label: 'Mietpreisentwicklung',
        lineTension: 0,
        pointRadius: 0,
        pointStyle: 'line',
        xAxisID: 'x-axis',
        yAxisID: 'y-axis-1'
      }
    ],
    labels: [
      '06.2018',
      '09.2018',
      '12.2018',
      '03.2019',
      '06.2019',
      '09.2019',
      '12.2019',
      '03.2020',
      '09.2014',
      '12.2014',
      '03.2015',
      '06.2015',
      '09.2015',
      '12.2015',
      '03.2016',
      '06.2016',
      '09.2016',
      '12.2016',
      '03.2017',
      '06.2017',
      '09.2017',
      '12.2017',
      '03.2018',
      '06.2018',
      '09.2018',
      '12.2018',
      '03.2019',
      '06.2019',
      '09.2019',
      '12.2019',
      '03.2020'
    ]
  },
  options: {
    elements: {
      point: {
        radius: 0
      }
    },
    legend: {
      align: 'end',
      display: true,
      labels: {
        boxWidth: 50,
        fontColor: '#000',
        padding: 10,
        paddingRight: 0,
        usePointStyle: true
      },
      position: 'bottom'
    },
    scales: {
      xAxes: [
        {
          display: true,
          gridLines: {
            color: '#000',
            display: false,
            drawBorder: false,
            drawOnChartArea: false,
            lineWidth: 1,
            tickMarkLength: 10
          },
          id: 'x-axis',
          position: 'bottom',
          scaleLabel: {
            display: true,
            fontColor: '#000'
          },
          ticks: {
            maxRotation: 0,
            maxTicksLimit: 8,
            minRotation: 0,
            padding: 0
          }
        }
      ],
      yAxes: [
        {
          color: 'rgba(150, 150, 150, 1)',
          display: true,
          id: 'y-axis-0',
          position: 'left',
          scaleLabel: {
            align: 'end',
            display: true,
            labelString: 'Kaufpreis in €'
          },
          ticks: {
            beginAtZero: false,
            callback: expect.any(Function),
            max: 800000,
            maxTicksLimit: 5,
            min: 600000
          },
          type: 'linear'
        },
        {
          color: 'rgba(150, 150, 150, 1)',
          display: true,
          id: 'y-axis-1',
          position: 'right',
          scaleLabel: {
            align: 'end',
            display: true,
            labelString: 'Mietpreis pro m² in €'
          },
          ticks: {
            beginAtZero: false,
            callback: expect.any(Function),
            max: 6,
            maxTicksLimit: 5,
            min: 2
          },
          type: 'linear'
        }
      ]
    }
  },
  type: 'line'
}

module.exports = payload
