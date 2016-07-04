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
        INTERVAL = 30,
        statusMap = {
            0: '异常',
            1: '正常'
        };

    (function init(){
        global.tableService = $('.service-table').bootstrapTable({
            striped:true,
            columns: [{
                title: '应用名称',
                field: 'name',
                align: 'center',
                valign: 'middle'
            }, {
                title: 'url',
                field: 'url',
                align: 'center',
                valign: 'middle'
            }, {
                field: 'status',
                title: '状态',
                align: 'center',
                formatter: function(v){
                    return statusMap[v];
                }
            }]
        });

        refresh();

        setInterval(refresh, INTERVAL * 1000);
    })();

    function getData(fn){
        $.ajax({
            url: '/WeblogicTabAPI',
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

        basicTable.find('.oldUsed').text(data.weblogicgc_OU)
            .end().find('.secUsed').text(data.weblogicgc_S1U)
            .end().find('.ydyUsed').text(data.weblogicgc_EU)
            .end().find('.newTime').text(data.weblogicgc_YGCT)
            .end().find('.dir').text(data.weblogicjavapath)
            .end().find('.totalTime').text(data.weblogicgc_GCT)
            .end().find('.version').text(data.weblogicversion)
            .end().find('.firstStorage').text(data.weblogicgc_S0C)
            .end().find('.jdk').text(data.weblogicjavaversion)
            .end().find('.available').text(statusMap[data.weblogicjavastatus])
            .end().find('.newCount').text(data.weblogicgc_YGC)
            .end().find('.secStorage').text(data.weblogicgc_S1C)
            .end().find('.oldCount').text(data.weblogicgc_FGC)
            .end().find('.oldTime').text(data.weblogicgc_FGCT)
            .end().find('.ydyStorage').text(data.weblogicgc_EC)
            .end().find('.oldStorage').text(data.weblogicgc_OC)
            .end().find('.name').text(data.weblogicname)
            .end().find('.firstUsed').text(data.weblogicgc_S0U);
    }

    function fetchData(data){
        global.tableService.bootstrapTable('load',data.urlslist);
        fetchBasicData(data);
    }

    function refresh(){
        getData(fetchData);
    }
});