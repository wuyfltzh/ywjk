/**
 * Created by wbb on 16/6/12.
 */
$(function(){
    $('.j-login').click(function(){
        $.ajax({
            url: '/login',
            type:'post',
            success:function(data){
                if(data.result){
                    window.location.href = '/';
                }else{
                    $('.msg').text('用户名或密码错误！');
                }
            },
            error:function(){
                $('.msg').text('服务器出错，请稍后重试！');
            }
        })
    });
});