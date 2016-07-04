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
                maxZoom: 14 * 24 * 3600000, // fourteen days
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
                    color: '#f9bd76' // orange
                },{
                    width:1,
                    value:80,
                    label:{
                        text:'80%'
                    },
                    color: '#DF5353' // red
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

    (function bingEvents(){})();
    function refresh(){
        getBasicInfo(global.hostId);
        $.ajax({
            url: '/HostCPU',
            data: {
                hostid: global.hostId
            },
            success: function(data){
                var arr = [];
                $.each(data.AllData, function(k,v){
                    arr.push([new Date(data.AllTime[k]).getTime(), v]);
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
                var arr = [];
                $.each(data.AllData, function(k,v){
                    arr.push([new Date(data.AllTime[k]).getTime(), v]);
                });
                global.chartImHis.update(arr);
            }
        });
    }

    function updateBasicInfo(data){
        $('.j-name').text(data.name);
        $('.j-os').text(data.os);
        $('.j-ip').text(data.ip);
        $('.j-os-version').text(data.version);
        $('.j-band').text(data.band);
        $('.j-starttime').text(data.starttime);
        $('.j-type').text(data.srctype);
        $('.j-runtime').text(data.runtime);
        $('.j-status').text(data.status);
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