const chartGeneratorConfig = {
  type: "line",
  options: {
    legend: {
      display: true,
      position: "bottom",
      align: "end",
      labels: {
        usePointStyle: true,
        boxWidth: 50,
        padding: 10,
        paddingRight: 0,
        fontColor: "rgba(0, 0, 0, 1)",
      },
    },
    scales: {
      xAxes: [
        {
          id: "x-axis",
          position: "bottom",
        },
      ],
      yAxes: [
        {
          id: "left-y-axis",
          display: true,
          position: "left",
          color: "rgba(150, 150, 150, 1)",
          type: "linear",
          scaleLabel: {
            display: true,
            labelString: "Kaufpreis in \u20ac",
            align: "end",
            fontColor: "rgba(0, 0, 0, 1)",
            lineWidth: 1,
          },
          gridLines: {
            display: true,
            drawBorder: false,
            color: "rgba(150, 150, 150, 0.5)",
            offsetGridLines: false,
          },
          ticks: {
            beginAtZero: false,
            maxTicksLimit: 5,
            min: 400000,
            max: 800000,
            padding: 10,
            fontColor: "rgba(0, 0, 0, 1)",
          },
        },
        {
          id: "right-y-axis",
          display: true,
          position: "right",
          color: "rgba(150, 150, 150, 1)",
          type: "linear",
          scaleLabel: {
            display: true,
            labelString: "Mietpreis pro m\u00b2 in \u20ac",
            align: "end",
            fontColor: "rgba(0, 0, 0, 1)",
          },
          gridLines: {
            display: false,
            drawBorder: false,
            lineWidth: 1,
          },
          ticks: {
            beginAtZero: false,
            maxTicksLimit: 5,
            min: 2,
            max: 10,
            fontColor: "rgba(0, 0, 0, 1)",
          },
        },
      ],
    },
    elements: {
      point: {
        radius: 0,
      },
    },
  },
};

module.exports = chartGeneratorConfig;
