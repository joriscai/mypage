var scrollFixed = require('./scrollFixed');

(function () {
    var myChart = echarts.init(document.getElementById('charts'));

    //     Javascript: 80,
    //     React: 50,
    //     Grunt: 50,
    //     Git: 90,
    //     Node: 50,
    //     PHP: 50
    var data = [80,50,85,90,50,50],
        radius = [55, 65],
        centerX = ['20%','50%','80%'],
        centerY = ['30%','75%'],
        center = [
            [centerX[0], centerY[0]], [centerX[1], centerY[0]], [centerX[2], centerY[0]],
            [centerX[0], centerY[1]], [centerX[1], centerY[1]], [centerX[2], centerY[1]]
        ],
        fontSize = 18;
    var labelFromatter = {
            normal : {
                label : {
                    formatter : function (params) {
                        return 100 - params.value + '%';
                    },
                    textStyle: {
                        fontSize: fontSize - 1,
                        baseline : 'bottom'
                    }
                }
            }
        },
        labelTop = {
            normal : {
                label : {
                    show : true,
                    formatter : '{b}',
                    position : 'center',
                    textStyle: {
                        fontSize: fontSize,
                        baseline : 'bottom'
                    }
                },
                labelLine : {
                    show : false
                }
            }
        },
        labelBottom = {
            normal : {
                label : {
                    show : true,
                    position : 'center',
                    textStyle: {
                        baseline : 'top'
                    }
                }
            }
        };

    // 指定图表的配置项和数据
    var option = {
        series: [
            {
                name: "Javascript",
                type: "pie",
                radius: radius,
                center : center[0],
                hoverAnimation: false,
                itemStyle: labelFromatter,
                legendHoverLink: false,
                label: {
                    normal: {
                        show: true,
                        position: 'bottom'
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [
                    {value: data[0], name: "Javascript", itemStyle: labelTop},
                    {value: 100 - data[0], name: " ", itemStyle: labelBottom}
                ]
            },{
                name: "React",
                type: "pie",
                radius: radius,
                center : center[1],
                hoverAnimation: false,
                itemStyle: labelFromatter,
                label: {
                    normal: {
                        show: true,
                        position: 'bottom'
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [
                    {value: data[1], name: "React", itemStyle: labelTop},
                    {value: 100 - data[1], name: " ", itemStyle: labelBottom}
                ]
            },{
                name: "Grunt/Gulp",
                type: "pie",
                radius: radius,
                center : center[2],
                hoverAnimation: false,
                itemStyle: labelFromatter,
                label: {
                    normal: {
                        show: true,
                        position: 'bottom'
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [
                    {value: data[2], name: "Gulp", itemStyle: labelTop},
                    {value: 100 - data[2], name: " ", itemStyle: labelBottom}
                ]
            },{
                name: "Git",
                type: "pie",
                radius: radius,
                center : center[3],
                hoverAnimation: false,
                itemStyle: labelFromatter,
                label: {
                    normal: {
                        show: true,
                        position: 'bottom'
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [
                    {value: data[3], name: "Git", itemStyle: labelTop},
                    {value: 100 - data[3], name: " ", itemStyle: labelBottom}
                ]
            },{
                name: "Node.js",
                type: "pie",
                radius: radius,
                center : center[4],
                hoverAnimation: false,
                itemStyle: labelFromatter,
                label: {
                    normal: {
                        show: true,
                        position: 'bottom'
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [
                    {value: data[4], name: "Node.js", itemStyle: labelTop},
                    {value: 100 - data[4], name: " ", itemStyle: labelBottom}
                ]
            },{
                name: "PHP",
                type: "pie",
                radius: radius,
                center : center[5],
                hoverAnimation: false,
                itemStyle: labelFromatter,
                label: {
                    normal: {
                        show: true,
                        position: 'bottom'
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [
                    {value: data[5], name: "PHP", itemStyle: labelTop},
                    {value: 100 - data[5], name: " ", itemStyle: labelBottom}
                ]
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

})();
