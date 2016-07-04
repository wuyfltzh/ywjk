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
            url: '/JossTabAPI',
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

        basicTable.find('.oldUsed').text(data.jbossgc_OU)
            .end().find('.secUsed').text(data.jbossgc_S1U)
            .end().find('.ydyUsed').text(data.jbossgc_EU)
            .end().find('.newTime').text(data.jbossgc_YGCT)
            .end().find('.dir').text(data.jbossjavapath)
            .end().find('.totalTime').text(data.jbossgc_GCT)
            .end().find('.version').text(data.jbossversion)
            .end().find('.firstStorage').text(data.jbossgc_S0C)
            .end().find('.jdk').text(data.jbossjavaversion)
            .end().find('.available').text(statusMap[data.jbossjavastatus])
            .end().find('.newCount').text(data.jbossgc_YGC)
            .end().find('.secStorage').text(data.jbossgc_S1C)
            .end().find('.oldCount').text(data.jbossgc_FGC)
            .end().find('.oldTime').text(data.jbossgc_FGCT)
            .end().find('.ydyStorage').text(data.jbossgc_EC)
            .end().find('.oldStorage').text(data.jbossgc_OC)
            .end().find('.name').text(data.jbossname)
            .end().find('.firstUsed').text(data.jbossgc_S0U);
    }

    function fetchData(data){
        global.tableService.bootstrapTable('load',data.urlslist);
        fetchBasicData(data);
    }

    function refresh(){
        getData(fetchData);
    }
});