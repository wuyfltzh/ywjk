/**
 * Created by wbb on 16/4/26.
 */
$(function() {
    var global = {},
        readFlagMap = {
            0: '未读',
            1: '已读'
        };
    (function init(){
        global.table = $('table').bootstrapTable({
            url:'/RemindInfo',
            method:'post',
            contentType:'application/x-www-form-urlencoded',
            dataType:'json',
            queryParams: function(params){
                var data =  {
                    rows:params.limit,
                    page:Math.ceil(params.offset/params.limit) + 1
                };
                var start = $.trim($('.j-start').val());
                if(start){
                    data.start = new Date(start).toISOString();
                }
                var end = $.trim($('.j-end').val());
                if(end){
                    data.stop = new Date(end).toISOString();
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
                    title: '序号',
                    field: 'id',
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: '通知标题',
                    field: 'title',
                    align: 'center',
                    valign: 'middle',
                }, {
                    field:'message',
                    title: '通知内容',
                    align: 'center',
                    valign: 'middle'
                },
                {
                    field: 'date',
                    title: '通知日期',
                    align: 'center',
                    valign: 'middle'
                }, {
                    field: 'readflag',
                    title: '阅读标志',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (v) {
                        return readFlagMap[v];
                    }
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

        $('.j-search-message').click(function () {
            global.table.bootstrapTable('refresh');
        });
    })();
    function getHeight(){
        return $('.j-main').height()-40;
    }
});