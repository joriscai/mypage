var scrollFixed = require('./scrollFixed');
var scrollTo = require('./scrollTo');
var addEvent = require('./EventListener');

(function () {
    var charts = document.getElementsByClassName('skill-charts');

    var myChart = [];
    for (var i = 0; i < charts.length; i++) {
        myChart[i] = echarts.init(charts[i]);
    }
    //     Javascript: 80,
    //     React: 50,
    //     Grunt: 50,
    //     Git: 90,
    //     Node: 50,
    //     PHP: 50
    var data = [80,50,85,90,50,50],
        radius = [55, 65],
        name = ["Javascript", "React", "Grunt", "Git", "Node", "PHP"],
        color = ['#c23531', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
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

    function getOption(name, data, color) {
        // 指定图表的配置项和数据
        var option = {
            baseOption: {
                series: [
                    {
                        name: name,
                        type: "pie",
                        radius: radius,
                        center : 'center',
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
                            {value: data, name: name, itemStyle: labelTop},
                            {value: 100 - data, name: " ", itemStyle: labelBottom}
                        ]
                    }
                ],
                color: [color, '#2f4554']
            },
            media: [
                {
                    query: {
                        minWidth: 768
                    },
                    option: {
                        series: [
                            {
                                radius: [radius[0] - 20, radius[1] - 20],
                                center : 'center'
                            }
                        ]
                    }
                },
                {
                    option: {
                        series: [
                            {
                                radius: radius,
                                center : 'center'
                            }
                        ]
                    }
                }
            ]
        };
        return option;
    }

    // 使用刚指定的配置项和数据显示图表。
    for (var i = 0; i < myChart.length; i++) {
        myChart[i].setOption(getOption(name[i], data[i], color[i]));
    }
    addEvent(window, 'resize', function () {
        myChart[1].resize();
        console.log('resize');
    })

})();
