/**
 * Created by wbb on 16/4/26.
 */
$(function() {
    var global = {
        hostId: $('.j-hostId').val()
    };
    (function init(){
        global.table = $('table').bootstrapTable({
            url:'/itemsAPI',
            method:'get',
            contentType:'application/x-www-form-urlencoded',
            queryParams: function(params){
                var data =  {
                    rows:params.limit,
                    page:Math.ceil(params.offset/params.limit) + 1,
                    hostID: global.hostId
                };
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
            columns: [
                {
                    title: '序号',
                    formatter: function(v,r,index){
                        return index+1;
                    },
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: '监控项',
                    field: 'name',
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: '类别',
                    field: 'assetclass',
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: '当前值',
                    field: 'nowvalue',
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: '采集间隔(秒)',
                    field: 'delay',
                    align: 'center'
                },
                {
                    field: 'trigger',
                    title: '触发器',
                    align: 'center'
                }, {
                    field: 'triggerstatus',
                    title: '当前状态',
                    align: 'center',
                    formatter: function(v){
                        var cls = '';
                        switch (v){
                            case '正常':cls = 'status-common';break;
                            case '告警':cls = 'status-error';break;
                            default :cls = 'status-unknown';
                        }
                        return '<span class="'+cls+'">'+v+'</span>'
                    }
                }
            ]
        });
    })();

    (function bingEvents(){
        $(window).on('resize', function() {
            global.table.bootstrapTable('resetView',{height: getHeight()});
        });
    })();
    function getHeight(){
        return $('.j-main').height();
    }
});