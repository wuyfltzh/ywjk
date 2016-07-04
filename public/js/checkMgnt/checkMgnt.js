/**
 * Created by wbb on 16/4/26.
 */
$(function() {
    var global = {};
    (function init(){
        global.modal = (function(){
            this.container = $('.new-check-modal');
            this.resultTable = this.container.find('.modal-table tbody');

            var self = this;

            this.container.on('click', '.j-add-line', function(){
                self.resultTable.append('<tr>'+
                    '<th>'+
                    '<select class="j-InspectClass">'+
                    '<option value="0">主机</option>'+
                    '<option value="1">数据库</option>'+
                    '<option value="2">网络</option>'+
                    '</select>'+
                    '</th>'+
                    '<th>'+
                    '<select class="j-InspectResult">'+
                    '<option value="0">正常</option>'+
                    '<option value="1">故障</option>'+
                    '</select>'+
                    '</th>'+
                    '<th>'+
                    '<input class="j-InspectProb" type="text"/>'+
                    '</th>'+
                    '<th>'+
                    '<input class="j-solution" type="text"/>'+
                    '</th>'+
                    '<th>'+
                    '<input class="j-pic" type="file"/>'+
                    '</th>'+
                    '<th>'+
                    '<input class="j-finishedPic" type="file"/>'+
                    '</th>'+
                    '<th>'+
                    '<a href="javascript:;" class="btn btn-xs btn-danger j-remove-line">删除</a>'+
                    '</th>'+
                    '</tr>');
            });

            this.resultTable.on('click', '.j-remove-line', function(){
                $(this).closest('tr').remove();
            });

            return {
                invoke: function(id){
                    self.container.find('.j-modal-checkNo').val(id);
                }
            }
        })();

        global.table = $('.j-check-table').bootstrapTable({
            url:'/InspectInfoAPI',
            method:'post',
            contentType:'application/x-www-form-urlencoded',
            queryParams: function(params){
                var data =  {
                    limit:params.limit,
                    offset:params.offset
                };
                var start = $.trim($('.j-start').val());
                if(start){
                    data.start = new Date(start).toISOString();
                }
                var end = $.trim($('.j-end').val());
                if(end){
                    data.stop = new Date(end).toISOString();
                }
                if($.trim($('.j-checkNo').val())){
                    data.InspectID = $.trim($('.j-checkNo').val());
                }
                if($.trim($('.j-checker').val())){
                    data.Inspecter = $.trim($('.j-checker').val());
                }
                return data;
            },
            responseHandler:function(data){
                return data;
            },
            height: getHeight(),
            pagination:true,
            clickToSelect:true,
            sidePagination: 'server',
            pageSize: 20,
            striped:true,
            columns: [
                {
                    checkbox:true,
                    align: 'center',
                    valign: 'middle'
                },
                {
                    field: 'InspectID',
                    title:'巡检单号',
                    align: 'center',
                    valign: 'middle'
                },
                {
                    title: '巡检日期',
                    field: 'InspectDate',
                    align: 'center',
                    valign: 'middle'
                },
                {
                    title: '巡检名称',
                    field: 'InspectName',
                    align: 'center',
                    valign: 'middle'
                },
                {
                    field:'InspectClass',
                    title: '巡检地区',
                    align: 'center',
                    valign: 'middle'
                },
                {
                    field: 'Inspecter',
                    title: '巡检负责人',
                    align: 'center',
                    valign: 'middle'
                },
                {
                    field: 'inspectResult',
                    title: '巡检结果',
                    align: 'center',
                    valign: 'middle'
                },
                {
                    field: 'InspectProb',
                    title: '问题综述',
                    align: 'center',
                    valign: 'middle'
                },
                {
                    field: 'solution',
                    title: '处理综述',
                    align: 'center',
                    valign: 'middle'
                },
                {
                    field: 'InspectID',
                    title: '详情',
                    align: 'center',
                    valign: 'middle',
                    formatter: function(value){
                        return '<a class="btn btn-xs btn-primary" target="_blank" href="/checkMgnt/check/detail?InspectID=' + value + '">详情</a>'
                    }
                }
            ]
        });

        $('.datepicker').datetimepicker({
            timepicker: false,
            format: 'Y-m-d'
        });
    })();

    (function bindEvents(){
        $(window).on('resize', function() {
            global.table.bootstrapTable('resetView',{height: getHeight()});
        });

        $('#newCheckModal').on('show.bs.modal', function(){
            $(this).find('input').val('');
            $(this).find('select').val('-1');
            $(this).find('textarea').val('');
            $('.InspectDetail').empty();
        }).on('hidden.bs.modal', function(){
            $('.xdsoft_datetimepicker').hide();
        });

        $('.j-search-check').click(function () {
            global.table.bootstrapTable('refresh');
        });

        $('.j-add-check').click(function(){
            if(!validate()){
                return;
            }
            getFormData(function(formData){
                $.ajax({
                    url:'/AddInspectInfoAPI',
                    type:'post',
                    data:formData,
                    success:function(data){
                        $('#newCheckModal').modal('hide');
                        global.table.bootstrapTable('refresh');
                    }
                })
            });
        });
    })();

    function getHeight(){
        return $('.j-main').height()-40;
    }

    function getFormData(fn){
        var InspectDetail = {rows:[]},
            $trs = $('.InspectDetail').find('tr'),
            len = $trs.length;
        var data = {
            'InspectName': $.trim($('.InspectName').val()),
            'InspectDate': new Date($('.InspectDate').val()).toISOString(),
            'Inspecter': $.trim($('.Inspecter').val()),
            'InspectTel': $.trim($('.InspectTel').val()),
            'confirmer': $.trim($('.confirmer').val()),
            'confirmerTel': $.trim($('.confirmerTel').val()),
            'InspectProb': $.trim($('.InspectProb').val()),
            'solution': $.trim($('.solution').val()),
            'suggest': $.trim($('.suggest').val()),
            'partChanged': $('input[name="partChanged"]').val(),
            'suggestDoc': '',
            'confirmpic': '',
            'inspectDetail': InspectDetail
        };
        uploadFile($('.suggestDoc')[0],function(suggestDoc){
            data.suggestDoc = suggestDoc;
            uploadFile($('.confirmpic')[0],function(confirmpic){
                data.confirmpic = confirmpic;
                if(len > 0){
                    (function getInspectDetailItem(l){
                        var $tr = $trs.eq(l-1);
                        if(l !== 1){
                            uploadFile($tr.find('.j-pic')[0],function(pic) {
                                uploadFile($tr.find('.j-finishedPic')[0],function(finishedPic) {
                                    InspectDetail.rows.push({
                                        'InspectClass':$tr.find('.j-InspectClass').val(),
                                        'InspectResult':$tr.find('.j-InspectResult').val(),
                                        'InspectProb': $.trim($tr.find('.j-InspectProb').val()),
                                        'solution':$.trim($tr.find('.j-solution').val()),
                                        'pic':pic,
                                        'finishedPic':finishedPic
                                    });
                                    getInspectDetailItem(l-1);
                                });
                            });
                        }
                        else{
                            uploadFile($tr.find('.j-pic')[0],function(pic) {
                                uploadFile($tr.find('.j-finishedPic')[0],function(finishedPic) {
                                    InspectDetail.rows.push({
                                        'InspectClass':$tr.find('.j-InspectClass').val(),
                                        'InspectResult':$tr.find('.j-InspectResult').val(),
                                        'InspectProb': $.trim($tr.find('.j-InspectProb').val()),
                                        'solution':$.trim($tr.find('.j-solution').val()),
                                        'pic':pic,
                                        'finishedPic':finishedPic
                                    });
                                    data.inspectDetail = InspectDetail;
                                    fn && fn(data);
                                });
                            });
                        }
                    })(len);
                }else{
                    fn && fn(data);
                }
            });
        });
    }

    function validate(){
        if(!$.trim($('.InspectDate').val())){
            alert('请填写巡检时间');
            return false;
        }
        return true;
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

});