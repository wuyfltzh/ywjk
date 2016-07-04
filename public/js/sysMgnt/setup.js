/**
 * Created by wbb on 16/4/26.
 */
$(function() {
    var global = {};
    (function init(){
        global.table = $('table').bootstrapTable({
            url:'/alarmMgnt/alarmInfor',
            method:'post',
            dataType:'json',
            queryParams: function(params){
                var data =  {
                    limit:params.limit,
                    offset:params.offset
                };
                if($('.j-status').val() !== '-1'){
                    data.status = $('.j-status').val();
                }
                if($('.j-level').val() !== '-1'){
                    data.level = $('.j-level').val();
                }
                var start = $.trim($('.j-start').val());
                if(start){
                    data.start = new Date(start).toISOString();
                }
                var end = $.trim($('.j-end').val());
                if(end){
                    data.end = new Date(end).toISOString();
                }
                if($('.j-sourceType').val() !== '-1'){
                    data.sourceType = $('.j-sourceType').val();
                }
                if($.trim($('.j-ip').val())){
                    data.ip = $('.j-ip').val();
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
            clickToSelect:true,
            onEditableSave:function(field, row, oldValue, $el){
                global.table.bootstrapTable('resetView');
                return false;
            },
            columns: [
                {
                    checkbox:true
                },{
                    field: 'id',
                    title:'设置项',
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: '值',
                    field: 'id',
                    align: 'center',
                    editable:{
                        validate: function (value) {
                            value = $.trim(value);
                            if(value === ''){
                                return '不能为空！';
                            }
                            return '';
                        }
                    },
                    valign: 'middle'
                }
            ],
            data:[]
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