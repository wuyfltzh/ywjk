/**
 * Created by wbb on 16/4/26.
 */
$(function() {
    var global = {};
    (function init(){
        global.table = $('table').bootstrapTable({
            url:'/UserInfoApi',
            method:'get',
            dataType:'json',
            clickToSelect:true,
            responseHandler:function(data){
                var departMap = data.departs,
                    rollnameMap = data.rolls;

                function getId(list, item){
                    for(var i in list){
                        if(list[i] === item){
                            return i;
                        }
                    }
                    return -1;
                }

                $(data.users).each(function(k,v){
                    v.departId = getId(departMap, v.depart);
                    v.rollnameId = getId(rollnameMap, v.rollname);
                });
                return data.users;
            },
            height: getHeight(),
            striped:true,
            columns: [
                {
                    checkbox:true
                },{
                    field: 'id',
                    title:'ID',
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: '登录名',
                    field: 'loginname',
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: '用户名',
                    field: 'name',
                    align: 'center',
                    valign: 'middle'
                }, {
                    field: 'tel',
                    title: '联系电话',
                    align: 'center',
                    valign: 'middle'
                },
                {
                    field: 'depart',
                    title: '部门',
                    align: 'center',
                    valign: 'middle'
                }, {
                    field: 'rollname',
                    title: '角色',
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: '操作',
                    align: 'center',
                    formatter: function(value,row){
                        return "<button class='btn btn-xs btn-primary' onclick='invoke($(\"#newUserModal\"), " + JSON.stringify(row) + ")'>修改</button>";
                    }
                }
            ],
        });

        $('.datepicker').datetimepicker({
            step: 60
        });
    })();

    (function bingEvents(){
        $(window).on('resize', function() {
            global.table.bootstrapTable('resetView',{height: getHeight()});
        });

        $('.j-search-user').click(function () {
            global.table.bootstrapTable('refresh');
        });

        $('.j-delete-user').click(function(){
            var data = global.table.bootstrapTable('getSelections');
            if(!data.length){
                alert('请选择要删除的用户！');
            }
            $.ajax({
                url: '/UserDel',
                type: 'post',
                data: {
                    users: data
                },
                success: function(){
                    global.table.bootstrapTable('refresh');
                }
            });
        });

        $('.j-add-user').click(function(){
            var data = {
                loginName: $.trim($('#newUserModal').find('.j-loginname').val()),
                userName: $.trim($('#newUserModal').find('.j-name').val()),
                password: $.trim($('#newUserModal').find('.j-password').val()),
                repPassword: $.trim($('#newUserModal').find('.j-rep-password').val()),
                depart: $('#newUserModal').find('.j-depart').val(),
                rollID: $('#newUserModal').find('.j-role').val(),
                tel: $.trim($('#newUserModal').find('.j-tel').val())
            };

            if(!data.loginName){
                alert('登录名不能为空');
                return;
            }
            if(data.userName.length > 20){
                alert('用户名不能大于20个字符');
                return;
            }
            if(!data.password){
                alert('密码不能为空');
                return;
            }
            if(data.password !== data.repPassword){
                alert('两次密码输入有区别');
                return;
            }if(data.depart === '-1'){
                alert('部门不能为空');
                return;
            }if(data.rollID === '-1'){
                alert('角色不能为空');
                return;
            }if(data.tel.length > 20){
                alert('联系方式不能大于20个字符');
                return;
            }

            $.ajax({
                url: '/UserAdd',
                type: 'post',
                data:{
                    user: data,
                },
                success: function(data){
                    var res = data.result;
                    if(res === 1){
                        $('#newUserModal').modal('hide');
                        global.table.bootstrapTable('refresh');
                    }else if(res === 0){
                        alert('失败');
                    }else if(res === -1){
                        alert('登录名已存在');
                    }
                }
            });
        });

        $('#newUserModal').on('show.bs.modal', function () {
            $(this).find('.modal-title').text('新增用户');
            $(this).find('.j-loginname').val('');
            $(this).find('.j-name').val('');
            $(this).find('.j-password').val('');
            $(this).find('.j-rep-password').val('').closest('.row').show();
            $(this).find('.j-depart').val('-1');
            $(this).find('.j-roll').val('-1');
            $(this).find('.j-tel').val('');
        });
    })();

    function getHeight(){
        return $('.j-main').height()-40;
    }

    window.invoke = function($modal, data){
        $modal.modal('show').find('.modal-title').text('修改用户');
        $modal.find('.j-loginname').val(data.loginname);
        $modal.find('.j-name').val(data.name);
        $modal.find('.j-password').val(data.password);
        $modal.find('.j-rep-password').closest('.row').hide();
        $modal.find('.j-depart').val(data.departId);
        $modal.find('.j-roll').val(data.rollnameId);
        $modal.find('.j-tel').val(data.tel);
    }
});