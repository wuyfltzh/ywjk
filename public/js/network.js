/**
 * Created by wbb on 16/6/30.
 */
$(function(){

    var INTERVAL = 30,
        $eqCon = $('.eq-container');

    (function init(){
        $(window).on('resize', function(){
            $eqCon.height($eqCon.width() * 7 / 13);
            $('.main-box').height($('.main-box').height() + 20)
        }).trigger('resize');
    })();

    function getData(fn){
        $.ajax({
            url: '/topology',
            success: function(data){
                fn && fn(data);
            }
        })
    }

    function fetchData(data){
        var str = '';
        $.each(data, function(k, v){
            var position = transfer(v.coordinate);
            str += '<div class="equipmt" style="top:' + position.y/7 + '%;left:' + position.x/13 + '%;">' +
                '<div class="status status' + v.status + '"></div>' +
                '</div>'
        });
        $eqCon.html(str);
    }

    function transfer(str){
        var arr = str.split(',');

        return {
            x: arr[0].substr(1),
            y: arr[1].substr(0,arr[1].length-1)
        };
    }

    function refresh(){
        getData(fetchData);
    }

    refresh();

    setInterval(refresh, INTERVAL * 1000);
});