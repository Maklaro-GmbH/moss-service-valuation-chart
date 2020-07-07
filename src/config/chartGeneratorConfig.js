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
                fontFamily: "Value"
            }
        },
        scales: {
            xAxes: [
                {
                    id: "x-axis",
                    display: true,
                    position: "bottom",
                    color: "rgba(150, 150, 150, 1)",
                    scaleLabel: {
                        display: true,
                        fontColor: "rgba(0, 0, 0, 1)",
                        fontFamily: "Value"
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false,
                        drawOnChartArea: false,
                        lineWidth: 1,
                        tickMarkLength: 10,
                        zeroLineWidth: 1,
                        zeroLineColor: "rgba(150, 150, 150, 1)",
                        color: "rgba(150, 150, 150, 1)"
                    },
                    ticks: {
                        maxTicksLimit: 8,
                        maxRotation: 0,
                        minRotation: 0,
                        fontColor: "rgba(0, 0, 0, 1)",
                        fontFamily: "Value",
                        padding: 0
                    }
                }
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
                        fontFamily: "Value",
                        lineWidth: 1
                    },
                    gridLines: {
                        display: true,
                        drawBorder: false,
                        color: "rgba(150, 150, 150, 0.5)",
                        offsetGridLines: false
                    },
                    ticks: {
                        beginAtZero: false,
                        maxTicksLimit: 5,
                        min: 600000,
                        max: 800000,
                        padding: 10,
                        fontColor: "rgba(0, 0, 0, 1)",
                        fontFamily: "Value"
                    }
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
                        fontFamily: "Value"
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false,
                        lineWidth: 1
                    },
                    ticks: {
                        beginAtZero: false,
                        maxTicksLimit: 5,
                        min: 2,
                        max: 10,
                        fontColor: "rgba(0, 0, 0, 1)",
                        fontFamily: "Value"
                    }
                }
            ]
        },
        elements: {
            point: {
                radius: 0
            }
        }
    }
}

module.exports = chartGeneratorConfig;