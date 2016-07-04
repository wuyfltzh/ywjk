/**
 * Created by wbb on 16/4/26.
 */
$(function() {
    var header = $('header'),
        block = $('.block-body'),
        footer = $('footer');

    (function bindEvents() {
        $(window).on('resize', function() {
            block.height($('body').height()-header.height()-footer.height());
        });

        $('.j-change-password').click(function(){
            var data = {
                password: $.trim($('.j-old-password').val()),
                newpassword: $.trim($('.j-new-password').val()),
                confirmPassword: $.trim($('.j-confirm-password').val()),
            }
            if(!data.password){
                alert('请输入原密码！');
                return;
            }
            if(!data.newpassword){
                alert('请输入新密码！');
                return;
            }
            if(data.newpassword !== data.confirmPassword){
                alert('确认密码与输入密码不一致！');
                return;
            }

            $.ajax({
                url: '/changepasswd',
                type:'post',
                data:data,
                contentType:'application/x-www-form-urlencoded',
                success: function(data){
                    alert('data.result');
                    $('#passwordModal').modal('hide');
                }
            });

        });
    })();

    (function init() {
        $(window).trigger('resize');

        $.ajax({
            url: '/GetRemindCount',
            success: function(data){
                $('.message-count').text(data.num > 99? '...': (data.num || ''));
            }
        });
    })();
});