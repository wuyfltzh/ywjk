/**
 * Created by wbb on 16/4/26.
 */
$(function() {
    var global = {};
    (function init(){
        global.tableCompany = $('.table-company').bootstrapTable({
            url:'/alarmMgnt/alarmInfor',
            method:'post',
            dataType:'json',
            clickToSelect:true,
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
            columns: [
                {
                    checkbox:true
                },{
                    field: 'id',
                    title:'序号',
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: '单位名称',
                    field: 'id',
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: '联系人',
                    field: 'id',
                    align: 'center',
                    valign: 'middle',
                }, {
                    title: '联系电话',
                    align: 'center'
                }, {
                    title: '电子邮箱',
                    align: 'center'
                }, {
                    title: '备注',
                    align: 'center'
                }
            ],
            data:[]
        });

        global.tableFactory = $('.table-factory').bootstrapTable({
            url:'/alarmMgnt/alarmInfor',
            method:'post',
            dataType:'json',
            clickToSelect:true,
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
            columns: [
                {
                    checkbox:true
                },{
                    field: 'id',
                    title:'序号',
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: '厂商名称',
                    field: 'id',
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: '联系人',
                    field: 'id',
                    align: 'center',
                    valign: 'middle',
                }, {
                    title: '联系电话',
                    align: 'center'
                }, {
                    field: '机柜说明',
                    title: '电子邮箱',
                    align: 'center'
                }, {
                    field: '机柜说明',
                    title: '备注',
                    align: 'center'
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
            global.tableRoom.bootstrapTable('resetView',{height: getHeight()});
            global.tableCab.bootstrapTable('resetView',{height: getHeight()});
        });

        $('.j-search-alarm').click(function () {
            global.table.bootstrapTable('refresh');
        });
    })();
    function getHeight(){
        return ($('.j-main').height()-80)/2;
    }
});