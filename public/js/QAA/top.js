/**
 * Created by wbb on 16/4/26.
 */
$(function() {
    //柱状图
    var ChartColumn = function(options){
        options = $.extend(true, {
            chart:{
                renderTo:$('.j-chart-database')[0],
                type: 'column',
                backgroundColor: 'transparent'
            },
            title: {
                text: '',
                style: {
                    fontSize:'12px'
                }
            },
            xAxis: {
                categories: []
            },
            yAxis: [{
                title: {
                    text: ''
                }
            }],
            legend:{
                enabled: false
            },
            tooltip: {
                shared:true
            },
            plotOptions: {
                series: {
                    colorByPoint: true
                }
            },
            series: [{
                name: '表空间',
                data: []
            }]
        },options);
        this.chart = new Highcharts.Chart(options);
    };

    ChartColumn.prototype.update = function(data, arr){
        var self = this;

        self.chart.series[0].setData(data[arr[0]]);
        self.chart.xAxis[0].setCategories(data[arr[1]]);
    };

    var ChartWarnBar = function(){
        this.chart = new Highcharts.Chart({
            chart: {
                type:'bar',
                renderTo: $('.j-chart-warn-bar')[0],
                backgroundColor:'transparent'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: ['致命', '严重', '警告', '主要'],
                tickWidth: 0,
                lineWidth:0
            },
            yAxis:{
                title:{
                    text:''
                },
                labels:{
                    enabled: false
                },
                gridLineWidth: 0
            },
            legend: {
                enabled: false
            },
            tooltip:{
                enabled:false
            },
            plotOptions:{
                bar:{
                    pointWidth: 14,
                    borderRadius: 7,
                    colorByPoint:true,
                    colors:['#ed4d4d','#ee963c','#edcb45','#3c7cba']
                }
            },
            series: [{
                name: '告警数',
                data: [],
                dataLabels:{
                    enabled: true
                }
            }]
        });
    };

    ChartWarnBar.prototype.update = function(data){
        this.chart.series[0].setData(data.count);
        this.chart.xAxis[0].setCategories(data.name);
    };

    var ChartWarnPie = function(){
        this.chart = new Highcharts.Chart({
            chart: {
                type:'pie',
                renderTo: $('.j-chart-warn-pie')[0],
                backgroundColor:'transparent'
            },
            title: {
                floating:true,
                text: '9个',
                y:145
            },
            xAxis: {
                categories: ['致命', '严重', '警告', '主要'],
            },
            yAxis:{
                title:{
                    text:''
                },
            },
            legend: {
                enabled: false
            },
            tooltip:{
                enabled:false
            },
            plotOptions:{
                pie:{
                    colorByPoint:true,
                    colors:['#ed4d4d','#ee963c','#edcb45','#3c7cba'],
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        format: '{point.percentage:.1f}%',
                        distance:0,
                    },
                }
            },
            series: [{
                name: '告警数',
                data: [],
                dataLabels:{
                    enabled: true
                },
                size:150,
                innerSize:100,
                center:['50%', '50%']
            }]
        });
    };

    ChartWarnPie.prototype.update = function(data){
        this.chart.series[0].setData(data.count);
        this.chart.xAxis[0].setCategories(data.name);
    };

    var ChartWarn = function(){
        this.bar = new ChartWarnBar();
        this.pie = new ChartWarnPie();
    };

    ChartWarn.prototype ={
        update: function(data){
            var self = this;
            $.ajax({
                url: '/HostsProblemCount',
                success: function(data){
                    self.bar.update(data);
                    self.pie.update(data);
                }
            });
        }
    };

    (function main(){

        var chartWarn = new ChartWarn();

        var chartMonitorResource = new ChartColumn({
            chart:{
                renderTo: $('.j-chart-monitor-resource')[0]
            },
            title:{
                text:'单位（个）'
            },
            series: [{
                name: '监控资源数目',
                data: [],
                dataLabels:{
                    enabled: true
                }
            }]
        });

        var chartWarnTop = new ChartColumn({
            chart:{
                renderTo: $('.j-chart-warn-top')[0]
            },
            title:{
                text:'单位（个）'
            },
            series: [{
                name: '告警数',
                data: [],
                dataLabels:{
                    enabled: true
                }
            }]
        });

        var chartCpuTop = new ChartColumn({
            chart:{
                renderTo: $('.j-chart-cpu-top')[0]
            },
            title:{
                text:'单位（%）'
            },
            series: [{
                name: 'CPU占用率',
                data: [],
                dataLabels:{
                    enabled: true
                }
            }]
        });

        setInterval(updateAllData,10000);

        updateAllData();

        function updateAllData(){
            $.ajax({
                url:'/HostCPUTOP',
                success: function(data){
                    chartCpuTop.update(data,['cpuusedP', 'name']);
                }
            });

            $.ajax({
                url:'/HostProblemTOP',
                success: function(data){
                    chartWarnTop.update(data,['count', 'name']);
                }
            });

            $.ajax({
                url:'/MonitorResources',
                success: function(data){
                    chartMonitorResource.update(data,['count', 'name']);
                }
            });
            chartWarn.update();
        }

    })();

});