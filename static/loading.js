/**
 * Created by zhang on 17/4/7.
 */


function loading() {
    this.init = function() {
        // var html = '<div id="load"><img class="animation_style" src="../images/loading.png"></div>';
        // $(html).insertBefore("#loading");
        // $("#load").hide();

        var hudHtml = '<div class="m-load2"><div class="line"> <div></div><div></div><div></div><div></div><div></div><div></div></div><div class="circleBg"></div></div>';
        // $(hudHtml).insertBefore("#loadHud");
        $("#loadHud").append($(hudHtml)).hide();
        var screenWidth = $(window).width();
        var screenHeight = $(window).height();
        // alert('width:'+screenWidth + 'height:' + screenHeight);
        $(".m-load2").css({
            top: (screenHeight - 80 - 64) / 2+'px',
            left: (screenWidth - 80) / 2+'px'
        });
        // $("#loadHud").hide();

    };


    this.showLoading = function() {
        // $("#load").show();
        $("#loadHud").show();
    };
    this.hideLoading = function() {
        // $("#load").hide();
        $("#loadHud").hide();
    }
}










