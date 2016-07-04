/**
 * Created by wbb on 16/5/26.
 */
/**
 * Created by wbb on 16/4/26.
 */
$(function() {
    var global = {
        hostId: $('.j-host-id').val()
    };

    var GaugeChart = function(options){
        this.options = $.extend(true,{
                chart: {
                    type: 'gauge',
                    plotBackgroundColor: null,
                    plotBackgroundImage: null,
                    plotBorderWidth: 0,
                    plotShadow: false
                },

                title: {
                    text: '',
                    y:30
                },

                pane: {
                    center:['50%', '70%'],
                    background: null,
                    borderWidth:0,
                    startAngle: -120,
                    endAngle: 120,
                    size:'100%'
                },

                tooltip:{
                    enabled: false
                },

                // the value axis
                yAxis: {
                    min: 0,
                    max: 100,

                    minorTickInterval: 'auto',
                    minorTickWidth: 1,
                    minorTickLength: 10,
                    minorTickPosition: 'inside',
                    minorTickColor: '#666',

                    tickPixelInterval: 30,
                    tickWidth: 2,
                    tickPosition: 'inside',
                    tickLength: 10,
                    tickColor: '#666',
                    labels: {
                        step: 2,
                        rotation: 'auto'
                    },
                    title: {
                        text: ''
                    },
                    plotBands: [{
                        from: 0,
                        to: 60,
                        thickness:10,
                        color: '#88e35d' // green
                    },{
                        from: 60,
                        to: 80,
                        thickness:10,
                        color: '#f9bd76' // orange
                    },{
                        from: 80,
                        to: 100,
                        thickness:10,
                        color: '#DF5353' // red
                    }]
                },

                plotOptions:{
                    gauge:{
                        dataLabels:{
                            borderWidth: 0,
                            style:{
                                fontSize: 25,
                                color:'#666',
                                textShadow: null
                            },
                            format:'{y}%'
                        }
                    }
                },

                series: [{
                    data: [80]
                }]

            }, options || {});

        this.chart = new Highcharts.Chart(this.options);
    };

    GaugeChart.prototype = {
        update: function(d){
            this.chart.series[0].setData([d]);
        }
    };

    var PercentChart = function(options){
        this.options = $.extend(true, {
            chart: {
                spacingRight: 20
            },
            title: {
                text: '过去12个小时使用率'
            },
            xAxis: {
                type: 'datetime',
                title: {
                    text: null
                }
            },
            yAxis: {
                min:0,
                max:100,
                gridLineWidth:0,

                labels:{
                    enabled: false,
                },
                plotLines: [{
                    width:1,
                    value:60,
                    label:{
                        text:'60%'
                    },
                    color: '#f9bd76', // orange
                    zIndex:10
                },{
                    width:1,
                    value:80,
                    label:{
                        text:'80%'
                    },
                    color: '#DF5353', // red
                    zIndex:10
                }],
                title: {
                    text: ''
                }
            },
            tooltip: {
                shared: true
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    lineWidth: 1,
                    marker: {
                        enabled: false
                    },
                    shadow: false,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },

            series: [{
                type: 'area',
                name:'使用率',
                data: []
            }]
        }, options || {});

        this.chart = new Highcharts.Chart(this.options);
    };

    PercentChart.prototype = {
        update: function(data){
            this.chart.series[0].setData(data);
        }
    };



    (function init(){

        global.table = $('.table-file').bootstrapTable({
            url: '/HostFilesystem',
            method: 'get',
            queryParams: function(){
                return {
                    hostid: global.hostId
                };
            },
            striped:true,
            columns: [
                {
                    title: '文件系统',
                    field: 'name',
                    align: 'center',
                    valign: 'middle'
                }, {
                    field:'value',
                    title: '使用率',
                    align: 'center'
                },
                {
                    field: 'AlarmValue',
                    title: '告警阈值',
                    align: 'center'
                }, {
                    field: 'status',
                    title: '状态',
                    align: 'center'
                }
            ],
            data:[{},{},{},{},{}]
        });

        global.chartCPU = new GaugeChart({
            chart:{
                renderTo: $('.j-chart-cpu')[0]
            },
            title:{
                text:'CPU使用率'
            }
        });

        global.chartPIM = new GaugeChart({
            chart:{
                renderTo: $('.j-chart-pim')[0]
            },
            title:{
                text:'物理内存使用率'
            }
        });

        global.chartVIM = new GaugeChart({
            chart:{
                renderTo: $('.j-chart-vim')[0]
            },
            title:{
                text:'虚拟内存使用率'
            }
        });

        global.chartCpuHis = new PercentChart({
            chart:{
                renderTo: $('.j-cpu-his')[0]
            },
            title: {
                text:'过去12个小时CPU使用率'
            }
        });

        global.chartImHis = new PercentChart({
            chart:{
                renderTo: $('.j-im-his')[0]
            },
            title: {
                text:'过去12个小时内存使用率'
            }
        });

        setInterval(function(){
            refresh()
        },30000);

        refresh();


    })();

    function refresh(){
        getBasicInfo(global.hostId);
        $.ajax({
            url: '/HostCPU',
            data: {
                hostid: global.hostId
            },
            success: function(data){
                global.chartCPU.update(data.new);
                var arr = [];
                $.each(data.AllData, function(k,v){
                    arr.push([new Date(data.AllTime[k]).getTime() + 8 * 3600 *1000, v]);
                });
                global.chartCpuHis.update(arr);
            }
        });

        $.ajax({
            url: '/HostMEM',
            data: {
                hostid: global.hostId
            },
            success: function(data){
                global.chartPIM.update(data.new);
                var arr = [];
                $.each(data.AllData, function(k,v){
                    arr.push([new Date(data.AllTime[k]).getTime() + 8*3600*1000, v]);
                });
                global.chartImHis.update(arr);
            }
        });

        $.ajax({
            url: '/HostVMMEM',
            data: {
                hostid: global.hostId
            },
            success: function(data){
                global.chartVIM.update(data.new);
            }
        });

        global.table.bootstrapTable('refresh');
    }

    (function bingEvents(){
        $(window).on('resize', function() {
            global.table.bootstrapTable('resetView');
        });
    })();

    function updateBasicInfo(data){
        $('.basic-name').text(data.name);
        $('.basic-os').text(data.os);
        $('.basic-ip').text(data.ip);
        $('.basic-version').text(data.version);
        $('.basic-band').text(data.band);
        $('.basic-starttime').text(data.starttime);
        $('.basic-srctype').text(data.srctype);
        $('.basic-runtime').text(data.runtime);
        $('.basic-status').text(data.status);
    }

    function getBasicInfo(hostId){
        $.ajax({
            url: '/HostBase',
            data: {
                hostid: hostId
            },
            success: function(data){
                updateBasicInfo(data);
            }
        });
    }
});