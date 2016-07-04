/**
 * Created by wbb on 16/4/26.
 */
$(function() {
    var global = {};
    (function init(){
        global.table = $('table').bootstrapTable({
            url:'/alarmMgnt/AlarmInfor',
            method:'post',
            contentType:'application/x-www-form-urlencoded',
            dataType:'json',
            queryParams: function(params){
                var data =  {
                    rows:params.limit,
                    page:Math.ceil(params.offset/params.limit) + 1,
                    level: $('.j-level').val(),
                    assetclass: $('.j-sourceType').val()
                };
                var start = $.trim($('.j-start').val());
                if(start){
                    data.starttime = new Date(start).toISOString();
                }
                var end = $.trim($('.j-end').val());
                if(end){
                    data.stoptime = new Date(end).toISOString();
                }
                var hostname = $.trim($('.j-sourceName').val());
                if(hostname){
                    data.hostname = hostname;
                }
                return data;
            },
            responseHandler:function(data){
              return data;
            },
            height: getHeight(),
            pagination:true,
            sidePagination: 'server',
            pageSize: 20,
            striped:true,
            columns: [{
                    title: '告警等级',
                    field: 'levent',
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: '告警资源',
                    field: 'name',
                    align: 'center',
                    valign: 'middle',
                }, {
                    field:'ip',
                    title: 'IP地址',
                    align: 'center'
                },
                {
                    field: 'info',
                    title: '告警内容',
                    align: 'center'
                }, {
                    field: 'time',
                    title: '告警时间',
                    align: 'center'
                }, {
                    field: 'type',
                    title: '告警类型',
                    align: 'center'
                },{
                    field: 'inform',
                    title: '告知',
                    align: 'center'
                }
            ]
        });

        $('.datepicker').datetimepicker({
            step: 60
        });
    })();

    (function bingEvents(){
        $(window).on('resize', function() {
            global.table.bootstrapTable('resetView',{height: getHeight()});
        });

        $('.j-search-alarm').click(function () {
            global.table.bootstrapTable('refresh');
        });
    })();
    function getHeight(){
        return $('.j-main').height()-40;
    }
});