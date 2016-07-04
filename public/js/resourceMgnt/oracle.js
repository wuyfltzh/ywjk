/**
 * Created by wbb on 16/5/26.
 */
/**
 * Created by wbb on 16/4/26.
 */
$(function() {
    var global = {
        hostId: $('.j-host-id').val()
    },
        statusMap = {
            0: '异常',
            1: '正常'
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
                title: {
                    text: ''
                }
            },
            tooltip: {
                shared: true
            },
            legend: {
                enabled: true,
                floating: true,
                verticalAlign: 'top',
                y: 15
            },

            series: [{
                type: 'spline',
                name: '数据库缓冲区命中率',
                data: []
            },{
                type: 'spline',
                name: '共享池命中率',
                data: []
            }]
        }, options || {});

        this.chart = new Highcharts.Chart(this.options);
    };

    PercentChart.prototype = {
        update: function(data){
            this.chart.series[0].setData(data[0]);
            this.chart.series[1].setData(data[1]);
        }
    };

    var BarChart = function(options){
        this.options = $.extend(true, {
            chart: {
                spacingRight: 20
            },
            title: {
                text: '会话数'
            },
            xAxis: {
                type: 'datetime',
                categories:['最大会话数', '总会话数', '正在等待', '正在执行', '系统会话'],
                title: {
                    text: null
                }
            },
            yAxis: {
                min:0,
                gridLineWidth:0,

                labels:{
                    enabled: false
                },
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

            series: [{
                type: 'column',
                name: '会话数',
                data: []
            }]
        }, options || {});

        this.chart = new Highcharts.Chart(this.options);
    };

    BarChart.prototype = {
        update: function(data){
            this.chart.series[0].setData(data);
        }
    };

    (function init(){
        global.table = $('.table-file').bootstrapTable({
            url: '/oracleTableSpace',
            method:'get',
            contentType:'application/x-www-form-urlencoded',
            queryParams: function(){
                return {
                    hostid: global.hostId
                };
            },
            responseHandler: function(data){
                return data.rows;
            },
            striped:true,
            columns: [
                {
                    title: '序号',
                    align: 'center',
                    formatter: function(val,row,index){
                        return index + 1;
                    }
                }, {
                    title: '表空间名称',
                    field: 'name',
                    align: 'center',
                    valign: 'middle'
                }, {
                    field: 'total',
                    title: '总容量(M)',
                    align: 'center'
                },
                {
                    field: 'free',
                    title: '可用容量(M)',
                    align: 'center'
                }, {
                    field: 'usedP',
                    title: '使用率(%)',
                    align: 'center'
                }
            ]
        });

        global.chartRate = new PercentChart({
            chart:{
                renderTo: $('.j-cpu-his')[0]
            },
            title: {
                text:'数据库缓冲区命中率和共享池命中率'
            }
        });

        global.chartSession = new BarChart({
            chart:{
                renderTo: $('.j-current-com')[0]
            },
            title: {
                text:'会话分布'
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
            url: '/oracleSession',
            data: {
                hostid: global.hostId
            },
            success: function(data){
                global.chartSession.update([
                    data.maxsession,
                    data.allsession,
                    data.waitsession,
                    data.runsession,
                    data.syssession
                ]);
            }
        });

        $.ajax({
            url: '/oracleHitratio',
            data: {
                hostid: global.hostId
            },
            success: function(data){
                var arr = [[],[]];
                $.each(data.all_db_cache, function(k,v){
                    var x = new Date(data.alltime[k]).getTime() + 8*3600*1000;
                    arr[0].push([x, v]);
                    arr[1].push([x, data.all_shared_pool[k]]);
                });
                global.chartRate.update(arr);
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
        $('.basic-start').text(data.starttime);
        $('.basic-version').text(data.dbversion);
        $('.basic-run').text(data.runtime);
        $('.basic-connections').text(data.nowuser);
        $('.basic-logsize').text(data.runtime);
        $('.basic-os').text(data.os);
        $('.basic-max-prgrs').text(data.maxpro);
        $('.basic-current-prgrs').text(data.nowpro);
        $('.basic-usable').text(statusMap[data.status]);
    }

    function getBasicInfo(hostId){
        $.ajax({
            url: '/oracleBaseinfo',
            data: {
                hostid: hostId
            },
            success: function(data){
                updateBasicInfo(data);
            }
        });
    }
});