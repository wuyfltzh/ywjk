/**
 * Created by wbb on 16/4/26.
 */
$(function() {
    var global = {};
    (function init(){
        global.table = $('table').bootstrapTable({
            url:'/dealAPI',
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
                    data.stopt = new Date(end).toISOString();
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
                    title: '交易类型',
                    field: 'jylx',
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: '交易结果',
                    field: 'jyjg',
                    align: 'center',
                    valign: 'middle',
                }, {
                    field:'jyhs',
                    title: '交易耗时',
                    align: 'center',
                    valign: 'middle'
                },
                {
                    field: 'yybh',
                    title: '医院编号',
                    align: 'center',
                    valign: 'middle'
                }, {
                    field: 'ip',
                    title: '应用服务器',
                    align: 'center',
                    valign: 'middle'
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

        $('.j-search-trade').click(function () {
            global.table.bootstrapTable('refresh');
        });
    })();

    function getHeight(){
        return $('.j-main').height()-40;
    }
});