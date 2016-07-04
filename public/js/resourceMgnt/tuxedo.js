/**
 * Created by wbb on 16/5/26.
 */
/**
 * Created by wbb on 16/4/26.
 */
$(function() {
    var global = {
        hostID: $('.j-host-id').val()
    },
        INTERVAL = 30;

    (function init(){
        global.tableService = $('.service-table').bootstrapTable({
            striped:true,
            columns: [{
                title: '应用服务名',
                field: 'ServiceName',
                align: 'center',
                valign: 'middle'
            }, {
                title: '应用名',
                field: 'RoutineName',
                align: 'center',
                valign: 'middle'
            }, {
                field: 'GrpName',
                title: '组名',
                align: 'center'
            }, {
                field: 'ID',
                title: 'ID',
                align: 'center'
            }, {
                field: 'Done',
                title: '处理请求数',
                align: 'center'
            }, {
                field: 'Status',
                title: '当前状态',
                align: 'center'
            }]
        });

        global.tableQueue = $('.queue-table').bootstrapTable({
            striped:true,
            columns: [{
                title: '应用名',
                field: 'ProgName',
                align: 'center',
                valign: 'middle'
            }, {
                title: '队列名',
                field: 'QueueName',
                align: 'center',
                valign: 'middle'
            }, {
                field: 'Machine',
                title: '逻辑机器名',
                align: 'center'
            }, {
                field: 'WkQueued',
                title: '连接服务数',
                align: 'center'
            }, {
                field: 'Queued',
                title: '队列请求数',
                align: 'center'
            }, {
                field: 'AveLen',
                title: '队列平均长度',
                align: 'center'
            }]
        });

        refresh();

        setInterval(refresh, INTERVAL * 1000);
    })();

    function getData(fn){
        $.ajax({
            url: '/TuxedoInfo',
            data:{
                hostId: global.hostID
            },
            success: function (data) {
                fn && fn(data);
            }
        })
    }

    function fetchBasicData(data){
        var basicTable = $('.table-basic');

        basicTable.find('.version').text(data.bit + ' ' + data.version)
            .end().find('.maxService').text(data.server)
            .end().find('.maxAccess').text(data.access)
            .end().find('.maxProg').text(data.services);
    }

    function fetchData(data){
        global.tableService.bootstrapTable('load',data.serviceinfo);
        global.tableQueue.bootstrapTable('load',data.queueinfo);
        fetchBasicData(data);
    }

    function refresh(){
        getData(fetchData);
    }
});