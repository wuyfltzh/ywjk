/**
 * Created by wbb on 16/4/26.
 */
$(function() {
    var global = {
        resourceModal: $('#newResourceModal')
    };
    (function init(){
        global.table = $('table').bootstrapTable({
            url:'/assetlistAPI',
            method:'post',
            contentType:'application/x-www-form-urlencoded',
            queryParams: function(params){
                var data =  {
                    rows:params.limit,
                    page:Math.ceil(params.offset/params.limit) + 1,
                    moniter: $('input[name="monitor"]').val(),
                    assetClassID: $('.j-resouceType').val()
                };
                var start = $.trim($('.j-start').val());
                if(start){
                    data.starttime = new Date(start).toISOString();
                }
                var end = $.trim($('.j-end').val());
                if(end){
                    data.stoptime = new Date(end).toISOString();
                }
                var hostname = $.trim($('.j-resourceName').val());
                if(hostname){
                    data.assetName = hostname;
                }
                var ip = $.trim($('.j-ip').val());
                if(ip){
                    data.iPAddr = ip;
                }
                return data;
            },
            responseHandler:function(data){
                if(!global.assetsonclassdic){
                    global = $.extend(global,{
                        assetsonclassdic: data.assetsonclassdic,
                        cabinetinfodic: data.cabinetinfodic,
                        factoryinfodic: data.factoryinfodic,
                        moniterStatusDic: data.moniterStatusDic
                    },true);
                    renderSelect($('.j-room'),data.cabinetinfodic);
                    renderSelect($('.j-parentType'),data.assetsonclassdic);
                    renderSelect($('.j-factory'),data.factoryinfodic);
                }
                return data;
            },
            height: getHeight(),
            pagination:true,
            sidePagination: 'server',
            pageSize: 20,
            striped:true,
            clickToSelect:true,
            columns: [
                {
                    checkbox: true
                }, {
                    title: '资源状态',
                    field: 'moniterStatus',
                    align: 'center',
                    valign: 'middle',
                    formatter:function(v){
                        return global.moniterStatusDic[v];
                    }
                }, {
                    title: '资源名称',
                    field: 'assetName',
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: '品牌型号',
                    field: 'factoryType',
                    align: 'center',
                    valign: 'middle',
                    formatter:function(v){
                        return global.factoryinfodic[v];
                    }
                }, {
                    title: '资源类型',
                    field: 'assetClassID',
                    align: 'center',
                    valign: 'middle',
                    formatter:function(v){
                        var info = global.assetsonclassdic[v];
                        return info?info.name:'';
                    }
                },
                {
                    field: 'iPAddr',
                    title: 'IP地址',
                    align: 'center',
                    valign: 'middle'
                }, {
                    field: 'factoryOS',
                    title: '操作系统',
                    align: 'center',
                    valign: 'middle'
                }, {
                    field: 'osVersion',
                    title: '版本',
                    align: 'center',
                    valign: 'middle'
                }, {
                    field: 'operate',
                    title: '监控组件',
                    align: 'center',
                    valign: 'middle',
                    formatter: function(v,r,i){
                        return (v?v + '&nbsp;&nbsp;':'&nbsp;&nbsp;') + '<button class="btn btn-xs btn-default"  data-toggle="modal" data-target="#addMonitorModal"><span class="glyphicon glyphicon-edit"></span></button>';
                    }
                },{
                    title: '操作',
                    align: 'center',
                    valign: 'middle',
                    formatter: function(val, row, index){
                        return '<div class="btn-group" role="group" aria-label="操作">' +
                                '<a href="/resourceMgnt/rscDetail?assetID=' + row.assetID + '" target="_blank" class="btn btn-xs btn-default">详情</a>' +
                                '<button class="btn btn-xs btn-primary" onclick="invokeResource('+index+')">修改</button>' +
                                '<a href="/resourceMgnt/monitorItem?assetID=' + row.assetID + '" target="_blank" class="btn btn-xs btn-default">监控项</a>' +
                            '</div>'
                    }
                }
            ]
        });
    })();

    (function bingEvents(){
        $(window).on('resize', function() {
            global.table.bootstrapTable('resetView',{height: getHeight()});
        });

        global.resourceModal.on('show.bs.modal', function(){
            global.resourceModal.find('.modal-title').text('新增资源');
            $(this).find('input').val('');
            $(this).find('select').val('-1');
            $(this).find('textarea').val('');
        });

        $('.j-room').on('change', function(e, fn){
            renderSelect($('.j-cabinet'), global.cabinetinfodic[$(this).val()].cabinet);
            if(fn && typeof fn === 'function'){
                fn();
            }
        });

        $('.j-parentType').on('change', function(e, fn){
            renderSelect($('.j-subType'), global.assetsonclassdic[$(this).val()].sonclass);
            if(fn && typeof fn === 'function'){
                fn();
            }
        });

        $('.j-query-resoure').click(function(){
            global.table.bootstrapTable('refresh');
        });

        $('.j-add-resource').on('click', function(){
            var resource = {
                assetName: $.trim($('.j-name').val()),
                assetClassID:$('.j-parentType').val(),
                assetClassID2:$('.j-subType').val(),
                factoryID:$('.j-factory').val(),
                iPAddr:$.trim($('.j-ip').val()),
                iPAddr2:$.trim($('.j-ip-backup').val()),
                iPManage:$.trim($('.j-ip-mgnt').val()),
                factoryOS:$('.j-os').val(),
                osVersion:$.trim($('.j-os-version').val()),
                factoryType:$.trim($('.j-factory-type').val()),
                factorySerial:$.trim($('.j-serial').val()),
                buyDate:$.trim($('.j-buy-date').val()),
                expireDate:$.trim($('.j-out-date').val()),
                roomID:$('.j-room').val(),
                cabinetID:$('.j-cabinet').val(),
                rackNumber:$('.j-rack').val(),
                useStatus:$('.j-use-status').val(),
                usedDept:$('.j-use-depart').val(),
                usedFor:$.trim($('.j-use-person').val()),
                maintainStaus:$('.j-main-status').val(),
                maintainID:$('.j-main-com').val(),
                assetDetail:$.trim($('.j-detail').val()),
                asseMemo:$.trim($('.j-desc').val()),
                macAddr:$.trim($('.j-MAC').val()),
                maintainName:$.trim($('.j-main-com').val()),
                maintaincontacts:$.trim($('.j-main-person').val()),
                maintaintel:$.trim($('.j-main-tel').val()),
                maintainemail:$.trim($('.j-main-mail').val()),
                factoryName:$.trim($('.j-factory').val()),
                factorycontacts:$.trim($('.j-factory-person').val()),
                factorytel:$.trim($('.j-factory-tel').val()),
                factoryemai:$.trim($('.j-factory-mail').val())
            },
                assetID = $('.j-assetID').val();
            if(!resource.assetName){
                alert('请填写资源名称！');return;
            }if(resource.roomID === '-1'){
                alert('请选择所在机房！');return;
            }if(resource.cabinetID === '-1'){
                alert('请选择所在机柜！');return;
            }if(!resource.factoryOS === '-1'){
                alert('请选择操作系统！');return;
            }if(!resource.osVersion){
                alert('请填写系统版本！');return;
            }if(resource.assetClassID === '-1'){
                alert('请选择资源父类！');return;
            }if(resource.assetClassID2 === '-1'){
                alert('请选择资源子类！');return;
            }if(resource.factoryID === '-1'){
                alert('请选择设备厂商！');return;
            }

            $('.file').each(function(k,v){
               uploadFile(v,function(url){
                   resource['pic'+ (k+1)] = url;
                   if(k == 1){
                       if(assetID){
                           modifyResource(resource,assetID);
                       }else{
                           newResource(resource)
                       }
                   }
               });
            });
        });

        $('.j-remove-resource').click(function(){
            $.ajax({
                url: '/',
                type: 'post',
                data: {
                    resource: global.table.bootstrapTable('getSelections')
                },
                success: function(){
                    global.table.bootstrapTable('refresh');
                }
            })
        });

        $('.j-add-monitor').click(function(){
            var selection = getSelectedMonitorOpts();

            $.ajax({
                url: '/AddToHos',
                type: 'post',
                contentType: 'application/x-www-form-urlencoded',
                data:{
                    assetid: $('#addMonitorModal').data('id'),
                    templates: selection
                },
                success: function(data){
                    if(data.result){
                        alert('编辑成功');
                        $('#addMonitorModal').modal('hide');
                        global.table.bootstrapTable('refresh');
                    }
                    else{
                        alert('服务器出错');
                    }
                }
            });
        });

    })();


    function getHeight(){
        return $('.j-main').height()-40;
    }

    function uploadFile(file, fn) {
        var file = file.files[0],
            formData = new FormData();
        formData.append("UploadFile",file);
        $.ajax({
            url: '/upload',
            type: 'post',
            data: formData,
            processData: false,
            contentType: false,
            mimeType: 'multipart/form-data',
            success: function (data) {
                fn && fn(data);
            }
        });
    }

    function renderSelect($el, data){
        var str = '<option value="-1">请选择</option>';
        $.each(data, function(k, v){
            if(v.name){
                str += '<option value="' + k + '">' + v.name + '</option>';
            }else{
                str += '<option value="' + k + '">' + v + '</option>';
            }
        });
        $el.html(str);
    }

    window.invokeResource = function(index){
        global.resourceModal.modal('show')
            .find('.modal-title').text('修改资源');

        var row = global.table.bootstrapTable('getData')[index];
        $('.j-assetID').val(row.assetID);

        $('.j-parentType').val(row.assetClassID).trigger('change',function(){
            $('.j-subType').val(row.assetClassID2);
        });

        $('.j-room').val(row.roomID).trigger('change',function(){
            $('.j-cabinet').val(row.cabinetID);
        });

        $('.j-factory').val(row.factoryID);

        $('.j-name').val(row.assetName);
        $('.j-os').val(row);
        $('.j-os-version').val(row.osVersion);
        $('.j-rack').val(row.rackNumber || '');
        $('.j-ip').val(row.iPAddr);
        $('.j-buy-date').val(row.buyDate  || '');
        $('.j-ip-backup').val(row.iPAddr2 || '');
        $('.j-out-date').val(row.expireDate || '');
        $('.j-ip-mgnt').val(row.iPManage || '');
        $('.j-main-status').val(row.maintainStaus || '');
        $('.j-MAC').val(row || '');
        $('.j-main-com').val(row.maintainID || '');
        $('.j-main-person').val(row || '');
        $('.j-main-tel').val(row || '');
        $('.j-main-mail').val(row || '');
        $('.j-factory-type').val(row.factoryType || '');
        $('.j-manager').val(row || '');
        $('.j-serial').val(row.factorySerial || '');
        $('.j-use-status').val(row.useStatus || '');
        $('.j-factory-tel').val(row || '');
        $('.j-use-depart').val(row.usedDept || '');
        $('.j-factory-person').val(row || '');
        $('.j-use-person').val(row.usedFor || '');
        $('.j-factory-mail').val(row || '');
        $('.j-detail').val(row.assetDetail || '');
        $('.j-desc').val(row.asseMemo || '');
    }

    function newResource(resource){
        $.ajax({
            url: '/addasset',
            type: 'post',
            data: resource,
            success: function (data) {
                alert('新增成功！');
                global.table.bootstrapTable('refresh');
            },
            error:function(){
                alert('新增失败！');
            }
        });
    }

    function modifyResource(resource, assetID){
        resource.assetID = assetID
        $.ajax({
            url: '/addasset',
            type: 'post',
            data: resource,
            success: function (data) {
                alert('修改成功！');
                global.table.bootstrapTable('refresh');
            },
            error:function(){
                alert('修改失败！');
            }
        });
    }

    function getSelectedMonitorOpts(){
        var slcted = $('#addMonitorModal').find('input[type="checkbox"]:checked'),
            arr = [];

        $.each(slcted, function(k, v){
            arr.push($(v).val());
        });

        return arr.join(',');
    }
});