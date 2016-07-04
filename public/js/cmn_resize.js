/**
 * Created by wbb on 16/5/4.
 */
$(function(){
    $(window).on('resize', function(){
        $('.j-main').height($('.block-body').height() - 55);
    });
    (function(){
        $(window).trigger('resize');
    })();
});