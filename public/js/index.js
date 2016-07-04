/**
 * Created by wbb on 16/4/26.
 */
$(function() {
    //数据库一览
    var ChartDatabase = function(){
        this.color = ['#4ab86e', '#3c7cba'];
        this.chart = new Highcharts.Chart({
            chart:{
                renderTo:$('.j-chart-database')[0],
                type: 'column',
                backgroundColor: 'transparent'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: []
            },
            yAxis: [{
                title: {
                    text: '单位：%'
                },
                min:0,
                max:100,
                plotLines: [{
                    value: 80,
                    dashStyle:'ShortDashDot',
                    width: 1,
                    color: '#ee963c',
                    label:{
                        text:'80% 预警'
                    },
                    zIndex:5
                },{
                    value: 90,
                    dashStyle:'ShortDashDot',
                    width: 1,
                    color: '#f00',
                    label:{
                        text:'90% 告警'
                    },
                    zIndex:5
                }]
            }],
            tooltip: {
                valueSuffix: '%',
                shared:true
            },
            series: [{
                name: '表空间',
                color:this.color[0],
                data: []
            },{
                name: '繁忙程度',
                color:this.color[1],
                data: []
            }]
        });
    };

    ChartDatabase.prototype.update = function(){
        var self = this;
        $.ajax({
            url:'/DbSummary',
            success: function(data){
                self.chart.xAxis[0].setCategories(data.dbname);
                $.each(data.tablespace, function(k, v){
                    var point = self.chart.series[0].points[k];
                    if(!point){
                        self.chart.series[0].addPoint(10);
                        self.chart.series[1].addPoint(10);
                    }
                    self.chart.series[0].points[k].update({
                        y: v,
                        color: getColor(v, 0)
                    });
                    self.chart.series[1].points[k].update({
                        y: data.busyp[k],
                        color: getColor(data.busyp[k], 1)
                    });
                });
            }
        });

        function getColor(d,sIndex){
            if(d < 80){
                return self.color[sIndex];
            }else if(d < 90){
                return '#ee963c';
            }else{
                return '#f00';
            }
        }
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
        this.chart.series[0].setData(data);
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
        this.chart.series[0].setData(data);
    };

    var ChartWarn = function(){
        this.bar = new ChartWarnBar().chart;
        this.pie = new ChartWarnPie().chart;
        this.cat = 'all';
        this.data = {};
    };

    ChartWarn.prototype ={
        update: function(data){
            var self = this;
            $.ajax({
                url: '/HostsProblemCount',
                success: function(data){
                    self.data = data;
                    self.changeTo(self.cat);
                }
            });
        },
        changeTo: function(cat){
            var d = this.data[cat],
                sum = d.reduce(function(v,pre){return v+pre;},0);
            this.cat = cat,
            this.bar.series[0].setData(d);
            this.pie.series[0].setData(d);
            this.pie.setTitle({
                text: sum + '个'
            });
        }
    };

    var ChartTrade = function(){
        this.chart = new Highcharts.Chart({
            chart:{
                renderTo:$('.j-chart-trade')[0],
                backgroundColor: 'transparent'
            },
            title: {
                text: '',
            },
            xAxis: {
                type:'datetime'
            },
            yAxis: {
                title: {
                    text: '单位：秒'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            legend:{
                enabled:false
            },
            tooltip: {
                valueSuffix: '秒'
            },
            series: [{
                name: '交易时间',
                data: []
            }]
        });
    };

    ChartTrade.prototype.update = function(){
        var self = this;
        $.ajax({
            url: '/MWTransaction',
            success: function(data){
                var date = data.date,
                    data = data.data,
                    fData = data.map(function(v,k){
                        return [new Date(date[k]).getTime()+8*3600000, v];
                    });
                self.chart.series[0].setData(fData);
            }
        });
    };

    var ChartMachine = function(){
        this.chart = new Highcharts.Chart({
            chart: {
                type: 'bar',
                renderTo: $('.j-chart-machine')[0],
                backgroundColor: 'rgba(0,0,0,0)'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: ['主机', '网络', '数据库', '中间件'],
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
                backgroundColor: '#FFFFFF',
                reversed: true
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                },
                bar:{
                    pointWidth:16,
                    dataLabels:{
                        enabled:true,
                        y:-15,
                        style:{
                            color:'#333'
                        },
                        formatter:function(){
                            return this.y !== 0? this.y : '';
                        }
                    }
                }
            },
            series: [{
                name: '告警',
                data: [],
                color:'#ed4d4d'
            }, {
                name: '正常',
                data: [],
                color: '#4ab86e'
            }]
        });
    };

    ChartMachine.prototype.update = function(data){
        var self = this;
        $.ajax({
            url: '/HostsProblemList',
            success: function(data){
                var //data = JSON.parse(data),
                    nomal = [data.host[0], data.net[0], data.db[0], data.mw[0]],
                    error = [data.host[1], data.net[1], data.db[1], data.mw[1]];
                self.chart.series[1].setData(nomal);
                self.chart.series[0].setData(error);
            }
        });
    };

    (function(){
        $('.j-warn-title').on('click', 'a', function(){
            var $this = $(this),
                cat = $this.data('cat');
            chartWarn.changeTo(cat);
        });

        var chartWarn = new ChartWarn(),
            chartTrade = new ChartTrade(),
            chartMachine = new ChartMachine(),
            chartDatabase = new ChartDatabase();
        setInterval(updateAllData,10000);
        updateAllData();
        function updateAllData(){
            chartTrade.update();
            chartWarn.update();
            chartMachine.update();
            chartDatabase.update();
        }

        $('.refresh').click(function(){
            var type = $(this).data('type'),
                chart = null;
            switch (type){
                case 'warn':chart = chartWarn;break;
                case 'trade':chart = chartTrade;break;
                case 'machine':chart = chartMachine;break;
                case 'database':chart = chartDatabase;break;
            }
            chart.update();
        });
    })();
});