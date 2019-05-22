/**
 * Created by zhang on 17/6/28.
 */
/**
 * Created by zhang on 17/6/27.
 */
//构造函数方式
var isHideAlert = false;

function yyToastView() {
    this.init = function() {
        // var toastHtml = "<div  id='toastCenter'> <div class='msgHit'><lable class='leftLabel'>消息提示</lable><lable class='rightLabel'>关闭</lable></div> <div class='TextContent'> <lable id='TextLabel'>操作成功....</lable></div> </div> </div> ";
        var toastHtml = "<div  id='toastCenter'> <div class='msgHit'>解除绑定</div> <div class='TextContent'> <lable" +
            " id='TextLabel'>您确定要解绑xx儿童机器人?</lable></div><div class='alertBtn'><div" +
            " class='btnDiv cancelBtn' onclick='cancelBtnClick()'>取消</div><div class='btnDiv ensureBtn'" +
            " onclick='ensureBtnClick()'>确定</div></div></div>" +
            " </div> ";
        var tmp="<div id='mask_tmp'> </div> ";
        $("#toast").append(toastHtml).hide();
    };

    this.toastText = function (text) {
        $("#TextLabel").text(text);
        if (text.indexOf('确定')>=0){
            $('#toastCenter .ensureBtn').show();
            $('#toastCenter .cancelBtn').text('取消').removeClass('alertEnsureBtn');
            isHideAlert = false;
            // $('.btnDiv.ensureBtn').on('click',ensureBtnClick());
        } else {
            $('#toastCenter .msgHit').text('消息提示');
            $('#toastCenter .ensureBtn').hide();
            $('#toastCenter .cancelBtn').text('确定').addClass('alertEnsureBtn');
            isHideAlert = true;
            // $('.btnDiv.ensureBtn').on('click',function () {
            //     event.stopPropagation();
            //     $("#toast").hide();
            // });
            // function ensureBtnClick() {
            //     event.stopPropagation();
            //     // alert('确定');
            //     $("#toast").hide();
            // }
        }
    };

    this.hitText = function (text) {
        $('.msgHit').text(text);
    };

    this.showToast = function() {
        // $("#mask_tmp").css("display","block");
        console.log('showToast');
        $("#toast").show(300);
        var time_tmp=3000;
        if (isHideAlert){
            setTimeout(function () {
                $("#toast").hide();

            },time_tmp );
        }
        // $("#toast").show();
    };

    this.closeToast = function() {
        // alert('测试');
        $("#toast").hide();
        // $("#toastCenter").hide();
    }

}


//移除弹框
function hideAction() {
    event.stopPropagation();
    // alert('点击关闭');
    // closeToast();
    $("#toast").hide();
}

function cancelBtnClick() {
    event.stopPropagation();
    $("#toast").hide();
}


function ensureBtnClick() {

}

//原型方式
// function Car() {
// }
//
// Car.prototype.color = "blue";
// Car.prototype.doors = 4;
// Car.prototype.mpg = 25;
// Car.prototype.showColor = function() {
//     alert(this.color);
// };

