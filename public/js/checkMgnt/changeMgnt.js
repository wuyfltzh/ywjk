/**
 * Created by wbb on 16/4/26.
 */
$(function() {
    var global = {};
    (function init(){
        global.modal = (function(){
            this.container = $('.new-change-modal');

            var self = this;

            return {
                invoke: function(id){
                    this.container.find('.j-modal-checkNo').val(id);
                }
            }
        })();

        global.table = $('.j-check-table').bootstrapTable({
            url:'/ChangeInfoAPI',
            contentType:'application/x-www-form-urlencoded',
            method:'post',
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
                if($.trim($('.j-partID').val())){
                    data.partID = $.trim($('.j-partID').val());
                }
                if($('.j-partType').val() !== '-1'){
                    data.partType = $.trim($('.j-partType').val());
                }
                return data;
            },
            responseHandler:function(data){
                if(!global.partTypeDIC){
                    global.partTypeDIC = data.partTypeDIC;
                    global.cabinetinfodic = data.cabinetinfodic;

                    var str = '<option value="-1">请选择配件类型</option>';
                    $.each(global.partTypeDIC, function(k, v){
                        str += '<option value="' + k + '">' + v + '</option>';
                    });
                    $('.j-partType').html(str);
                }

                return {
                    rows:data.rows,
                    total:data.total
                };
            },
            height: getHeight(),
            pagination:true,
            clickToSelect:true,
            sidePagination: 'server',
            pageSize: 20,
            striped:true,
            columns: [
                {
                    checkbox:true
                },
                {
                    field: 'partID',
                    title:'配件编号',
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: '配件名称',
                    field: 'partName',
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: '配件类型',
                    field: 'partType',
                    align: 'center',
                    valign: 'middle',
                    formatter:function(v){
                        return global.partTypeDIC[v];
                    }
                }, {
                    title: '所在位置',
                    align: 'center',
                    valign: 'middle',
                    formatter:function(v, r){
                        var room = global.cabinetinfodic[r.roomID];
                        return room.name + room.cabinet[r.cabinetID];
                    }
                },
                {
                    field: 'beforeSerial',
                    title: '原配件序号',
                    align: 'center',
                    valign: 'middle'
                }, {
                    field: 'partSerial',
                    title: '现配件序号',
                    align: 'center',
                    valign: 'middle'
                }, {
                    field: 'changer',
                    title: '更换人',
                    align: 'center',
                    valign: 'middle'
                },{
                    field: 'tel',
                    title: '联系电话',
                    align: 'center'
                },{
                    field: 'changeDate',
                    title: '更换日期',
                    align: 'center',
                    valign: 'middle'
                },{
                    field: 'whychange',
                    title: '更换原因',
                    align: 'center',
                    valign: 'middle'
                }
            ]
        });

        $('.datepicker').datetimepicker({
            timepicker: false,
            format: 'Y-m-d'
        });
    })();

    (function bingEvents(){
        $(window).on('resize', function() {
            global.table.bootstrapTable('resetView',{height: getHeight()});
        });

        $('#newChangeModal').on('show.bs.modal', function(){
            $(this).find('input').val('');
            $(this).find('select').val('-1');
            $(this).find('textarea').val('');
            $('.InspectDetail').empty();
        }).on('hidden.bs.modal', function(){
            $('.xdsoft_datetimepicker').hide();
        });

        $('.j-search-change').click(function () {
            global.table.bootstrapTable('refresh');
        });

        $('.j-add-change').click(function () {
            getFormData(function(formData){
                $.ajax({
                    url:'/AddChangeInfoAPI',
                    type:'post',
                    success:function(data){
                        $('#newChangeModal').modal('hide');
                        global.table.bootstrapTable('refresh');
                    }
                });
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

    function getFormData(fn){
        uploadFile($('.beforePic')[0],function(beforePic) {
            uploadFile($('.finishedPic')[0],function(finishedPic) {
                var data = {
                    'partName': $.trim($('.partName').val()),
                    'partType':$.trim($('.partType').val()),
                    'beforeSerial':$.trim($('.beforeSerial').val()),
                    'partSerial':$.trim($('.partSerial').val()),
                    'beforePic':beforePic,
                    'finishedPic':finishedPic,
                    'whychange':$.trim($('.whychange').val()),
                    'changeDate':new Date($.trim($('.changeDate').val())).toISOString(),
                    'changer':$.trim($('.changer').val()),
                    'tel':$.trim($('.tel').val()),
                    'memo':$.trim($('.memo').val()),
                    'roomID':$('.roomID').val(),
                    'cabinetID':$('.cabinetID').val(),
                    'rackNumber':$('.rackNumber').val()
                };
                console.log(data);
                fn && fn(data);
            });
        });
    }
});