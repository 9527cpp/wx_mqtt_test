
// var timestamp = (new Date()).getTime(); //时间戳
// var nonceStr = getNonceStr(); //随机串
let portalBaseUrl = "https://www.deepbrain.ai/";//生产
let adminBaserUrl = "https://api.deepbrain.ai/";
let isInitWXJSSDKSuccess = true;
let isScanDevicesFail = true;
let bindDeviceInfo = {'deviceId':''};
let toastText = '操作失败';
let isShowToast = true;
let loadingData = new loading();
loadingData.init();
let toastView = new yyToastView();
toastView.init();
let currentDeviceEle;

var locationHref = location.href;
if (locationHref.indexOf('familyMember.html')>=0){
    isShowToast = false;
} else {
    isShowToast = true;
}

jQuery(document).ready(function(){
    storeUserInfo();
    // loadingData.showLoading();
    // storeUserInfo();
    // var data = {'deviceId':'gh_afbe1c4823a7_cbe39d60287ed99a','type':'bind','ticket':'harddevice_tic_4734252970945586'};
    // sendWXDeviceTicket(data);
    // fetchBindDevices();

});

//onunload

$(window).on('unload',function () {
    alert('消失');

});

!function(e){
    storeUserInfo();
    configDomain();
    loadingData.showLoading();  //开启loading
    console.log('获取微信appId--- ' + adminBaserUrl + "open-api/weChat/getWxAppId?deviceType=" + store.get('deviceType'));
    $.ajax({
        type : "get",
        url : adminBaserUrl + "open-api/weChat/getWxAppId?deviceType=" + store.get('deviceType'),
        dataType : "json",
        timeout : 25000,
        success : function(res) {
            loadingData.hideLoading();
            console.log('微信appId'+JSON.stringify(res));
            var appId = res.appId;
            if (appId){
                loadingData.showLoading();  //开启loading
                console.log('获取微信配置参数--- ' + portalBaseUrl + "wechat/" + appId + "/api/v1/js-api-ticket?url=" + window.location.href);
                $.ajax({
                    type : "get",
                    url : portalBaseUrl + "wechat/" + appId + "/api/v1/js-api-ticket?url=" + window.location.href,
                    // url: 'https://api-demo.deepbrain.ai/api/v1/js-api-ticket?url=' + window.location.href,
                    dataType : "json",
                    timeout : 25000,
                    success : function(msg) {
                        loadingData.hideLoading();
                        console.log('获取微信配置参数' + JSON.stringify(msg));
                        loadingData.showLoading();
                        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                        window.wx.config({
                            // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            beta: true,
                            appId: msg.appId, // 必填，公众号的唯一标识
                            timestamp: msg.timestamp, // 必填，生成签名的时间戳
                            nonceStr: msg.nonceStr, // 必填，生成签名的随机串
                            signature: msg.signature,// 必填，签名，见附录1
                            jsApiList: ["configWXDeviceWiFi","openWXDeviceLib","closeWXDeviceLib","scanQRCode","startScanWXDevice","stopScanWXDevice","onScanWXDeviceResult","onWXDeviceBindStateChange","onWXDeviceStateChange","getWXDeviceInfos","getWXDeviceTicket","connectWXDevice"
                            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                        });
                        window.wx.ready(function(){
                            // alert('wx.ready success');
                            loadingData.hideLoading();
                            if (isInitWXJSSDKSuccess){
                                // $("#test").text('配置成功');
                                var locationHref = location.href;
                                // alert('当前界面: ' + location.href);
//------------------------------------配网界面-------------------------------
                                if (locationHref.indexOf('networkConfig.html')>=0){
                                } else {
//------------------------------扫描设备界面------解绑界面-------------------------------
                                    var openWXDeviceLibPara = {};
                                    if (phoneType() === 'Android') {
                                        openWXDeviceLibPara = {'connType':'lan','brandUserName':store.get('deviceType')};
                                    } else {
                                        openWXDeviceLibPara = {'connType':'lan'};
                                    }
                                    wx.invoke('closeWXDeviceLib', {'connType':'lan'}, function(res) {
                                        console.log('closeWXDeviceLib',res);
                                        if (res.err_msg === 'closeWXDeviceLib:ok'){
                                            window.wx.invoke('openWXDeviceLib', openWXDeviceLibPara,
                                                function(res) {
                                                    if (res.err_msg === 'openWXDeviceLib:ok'){
                                                        // toastText = '成功';
                                                        if (locationHref.indexOf('deviceBind.html')>=0 || locationHref.indexOf('scanDevice.html')>=0){
                                                            // $("#test").text('初始化成功');
                                                            console.log('初始化成功');
                                                            //获取已绑定的设备
                                                            fetchBindDevices();
                                                        } else {
                                                            console.log('=========家庭成员=========');

                                                        }

                                                    } else {
                                                        if (isShowToast){
                                                            toastView.toastText('openWXDeviceLib初始化失败');
                                                            toastView.showToast();
                                                        }
                                                        toastText = 'openWXDeviceLib初始化失败';
                                                        console.log('toastText: ' + toastText);

                                                    }
                                                    console.log('openWXDeviceLib',res);
                                                }
                                            );
                                        } else {
                                            // alert('关闭closeWXDeviceLib'+JSON.stringify(res));
                                        }

                                    });
                                }

                            } else {
                                if (isShowToast){
                                    toastView.toastText('微信JSAPI配置失败!');
                                    toastView.showToast();
                                }
                                toastText = '微信JSAPI配置失败!';
                                console.log('toastText: ' + toastText);
                            }

                        });
                        window.wx.error(function(res){
                            loadingData.hideLoading();
                            isInitWXJSSDKSuccess = false;
                            console.log('wx.error',res);
                            if (isShowToast){
                                toastView.toastText('微信JSAPI配置失败!');
                                toastView.showToast();
                            }
                            toastText = '微信JSAPI配置失败!';
                            console.log('toastText: ' + toastText);

                            var locationHref = location.href;
                            // alert('当前界面: ' + location.href);
//------------------------------------配网界面-------------------------------
                            if (locationHref.indexOf('scanDevice.html')>=0){
                                $('div.yy-list-item').css({display:'none'});
                            }
                            // alert('wx.error' + JSON.stringify(res));
                            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                        });


                    },
                    error : function(msg){
                        loadingData.hideLoading();
                        isInitWXJSSDKSuccess = false;
                        if (isShowToast){
                            toastView.toastText('获取微信签名失败');
                            toastView.showToast();
                        }
                        toastText = '获取微信签名失败';
                        console.log('toastText: ' + toastText);
                    }
                });

            } else {
                isInitWXJSSDKSuccess = false;
                if (isShowToast){
                    toastView.toastText('获取微信AppId失败');
                    toastView.showToast();
                }
                toastText = '获取微信AppId失败';
                console.log('toastText: ' + toastText);
            }

        },
        error : function(msg){
            console.log('微信appId'+JSON.stringify(msg));
            loadingData.hideLoading();
            isInitWXJSSDKSuccess = false;
            if (isShowToast){
                toastView.toastText('获取微信AppId失败');
                toastView.showToast();
            }
            toastText = '获取微信AppId失败';
            console.log('toastText: ' + toastText);
        }
    });


}();

function initSuccess() {
    var locationHref = location.href;
    //*******************************扫描设备界面*******************************
    if (locationHref.indexOf('scanDevice.html')>=0) {
        if (bindDeviceInfo.deviceId != '') {
            var deviceName = '儿童机器人' + bindDeviceInfo.deviceId.substr(bindDeviceInfo.deviceId.length-4);
            $('ul.yy-deviceList').append("<li class=\"yy-list-item yy-input-item am-list-item-middle am-input-disabled" +
                " yy-firstBindDevice\"><div class=\"yy-input-label\"><img src=\"Images/robot.png\"></div><div" +
                " class=\"yy-input-control\"><input type=\"text\" placeholder=\"\" disabled=\"\" value="+deviceName+" readonly=\"\"><div onclick='bindDevice(this)' data-val="+bindDeviceInfo.deviceId+" class='yy-input-bind yy-forbiddenClick'>已绑定<img src='Images/listArrow.png'></div></div></li>");
        }
        //扫描设备
        window.wx.invoke('startScanWXDevice', {'connType':'lan'}, function(res) {
            console.log('startScanWXDevice',res);
            if(res.err_msg == 'startScanWXDevice:ok') {
                $('div.yy-list-item').css({display:'block'});
                scanDevice();
            } else {

                toastView.toastText('搜索设备调用失败');
                toastView.showToast();
                // alert('startScanWXDevice失败--' + JSON.stringify(res));

            }
        });

        // 扫描设备结果WeixinJSBridge.on
        window.wx.on("onScanWXDeviceResult",
            function(res) {
                // console.log('onScanWXDeviceResult',JSON.stringify(res));
                if ("0" === res.isCompleted) {
                    if (res.devices.length > 0){
                        isScanDevicesFail = false;
                    } else {
                        isScanDevicesFail = true;
                    }
                    addDeviceList(res.devices);
                } else {
                    isScanDevicesFail = true;
                    // alert('onScanWXDeviceResult' + JSON.stringify(res));
                    toastView.toastText('搜索设备失败');
                    toastView.showToast();
                }
            });
    } else {
//*******************************解绑界面*******************************
//                                         alert('解绑界面');
        var deviceId = bindDeviceInfo.deviceId;
        if (deviceId == ''){
            $('.yy-deviceBindHtml').css({display:'none'});
            $('.yy-deviceUnbindHtml').css({display:'flex'});
        } else {
            $('.yy-deviceBindHtml').css({display:'flex'});
            $('.yy-deviceUnbindHtml').css({display:'none'});
            $('#yy-bindDeviceId').text(deviceId);
        }
    }
}

function fetchBindDevices() {

    loadingData.showLoading();  //开启loading
    var userId = store.get('openid');
    // userId = 'oVLVV1BPZbCIOs5GBjh6Q0Za5y2E';
    var jsData = {
        "openId":userId
    };
    // console.log(JSON.stringify(jsData));
    var nonceStr = getNonceStr();
    var dateStr = getDataFommortStr();
    var privateKey = getPrivateKeyWithNonceStr(nonceStr,dateStr,userId);
    $.ajax({
        url: adminBaserUrl + 'open-api/wx-device/binding-device',
        type: "post",
        dataType: "json",
        contentType:'application/json',
        headers: {
            privateKey:privateKey, //key
            createdTime:dateStr,//时间
            nonce:nonceStr, //随机数
            key:userId
        },
        data:JSON.stringify(jsData),
        timeout : 25000,
        success: function (res) {
            // console.log('获取已绑定设备成功' + JSON.stringify(res));
            // alert('获取已绑定设备成功' + JSON.stringify(res));
            loadingData.hideLoading();  //隐藏loading
            bindDeviceInfo = res;
            initSuccess();

        },
        error: function (res) {
            // alert('获取已绑定设备列表失败' + JSON.stringify(res));
            toastView.toastText('获取已绑定设备列表失败');
            toastView.showToast();
            loadingData.hideLoading();  //隐藏loading
            initSuccess();
        }

    });
}


function sendWXDeviceTicket(data) {
    loadingData.showLoading();  //开启loading
    var userId = store.get('openid');
    // var appId = store.get('appId');
    // var robotId = store.get('robotId');
    var jsData = {
        "deviceId":data.deviceId,
        "operaType":data.type,
        "openId":userId,
        "deviceType":store.get('deviceType'),
        "ticket":data.ticket
    };
    if (data.type === 'unbind'){
        jsData = {
            "deviceId":data.deviceId,
            "operaType":data.type,
            "openId":userId,
            "ticket":data.ticket,
            "deviceType":store.get('deviceType'),
            'operateUser':''
        };
    }
    // console.log(JSON.stringify(jsData));
    // alert()
    var nonceStr = getNonceStr();
    var dateStr = getDataFommortStr();
    var privateKey = getPrivateKeyWithNonceStr(nonceStr,dateStr,userId);
    $.ajax({
        url: adminBaserUrl + 'open-api/wx-device/bind',
        type: "post",
        dataType: "json",
        contentType:'application/json',
        headers: {
            privateKey:privateKey, //key
            createdTime:dateStr,//时间
            nonce:nonceStr, //随机数
            key:userId
        },
        data:JSON.stringify(jsData),
        timeout : 25000,
        success: function (res) {
            // $(currentDeviceEle).removeClass('yy-forbiddenClick');
            loadingData.hideLoading();  //隐藏loading
            if (data.type === 'bind'){
                if (res.errorCode === '0'){

                    $('.yy-input-bind').text('点击绑定').removeClass('yy-forbiddenClick').append('<img src=\'Images/listArrow.png\'>');

                    $(currentDeviceEle).text('已绑定').addClass('yy-forbiddenClick');
                    $(currentDeviceEle).append('<img src=\'Images/listArrow.png\'>');

                } else if(res.errorCode === '1102'){
                    // alert('发送操作凭证' + JSON.stringify(res));
                    toastView.toastText('该设备不支持在该公众号下绑定');
                    toastView.showToast();
                    $(currentDeviceEle).removeClass('yy-forbiddenClick');
                } else if(res.errorCode === '1103'){
                    // alert('发送操作凭证' + JSON.stringify(res));
                    toastView.toastText('该设备类型不是微信设备,不支持绑定');
                    toastView.showToast();
                    $(currentDeviceEle).removeClass('yy-forbiddenClick');
                } else {
                    // alert('发送操作凭证' + JSON.stringify(res));
                    console.log('绑定发送操作凭证失败' + JSON.stringify(res));
                    toastView.toastText('绑定发送操作凭证失败，请重试');
                    toastView.showToast();
                    $(currentDeviceEle).removeClass('yy-forbiddenClick');
                }
            } else {
                if (res.errorCode === '0'){
                    $('.yy-deviceBindHtml').css({display:'none'});
                    $('.yy-deviceUnbindHtml').css({display:'flex'});
                } else if(res.errorCode === '1101'){
                    // alert('发送操作凭证' + JSON.stringify(res));
                    toastView.toastText('您已不在家庭圈中,不可此操作');
                    toastView.showToast();
                    $(currentDeviceEle).removeClass('yy-forbiddenClick');
                } else {
                    // alert('发送操作凭证' + JSON.stringify(res));
                    toastView.toastText('解除绑定发送操作凭证失败，请重试');
                    toastView.showToast();
                    $(currentDeviceEle).removeClass('yy-forbiddenClick');
                }

            }
        },
        error: function (res) {
            console.log('发送操作凭证失败' + JSON.stringify(res));
            // alert('发送操作凭证失败' + JSON.stringify(res));
            toastView.toastText('发送操作凭证失败');
            toastView.showToast();
            $(currentDeviceEle).removeClass('yy-forbiddenClick');
            loadingData.hideLoading();  //隐藏loading
        }

    });
}


//获取当前设备是安卓还是iOS
function phoneType (){
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        //alert(navigator.userAgent);
        return 'iPhone';
    } else if (/(Android)/i.test(navigator.userAgent)) {
        //alert(navigator.userAgent);
        return 'Android';
    } else {
        return 'pc';
    }
}
//userId=123344&robotId=77373hhufhhfhfh&appId=uauhhe&sn=11133
//<----------------------|存储用户参数|---------------------->
function storeUserInfo() {
    //获取url参数
    var args = getUrlParameter(), openid = args.openid, deviceType = args.deviceType;
    if(openid == null || openid === '' || openid === 'empty' ){
        console.log('没有openid信息');
        store.set('openId','empty');
    } else {
        //存储用户信息
        store.set('openid',args.openid);
    }
    if(deviceType == null || deviceType === '' || deviceType === 'empty' ){
        console.log('没有openid信息');
        store.set('deviceType','empty');
    } else {
        //存储用户信息
        store.set('deviceType',args.deviceType);
    }

    var locationHref = location.href;
    // alert('当前界面: ' + location.href);
//------------------------------------配网界面-------------------------------
    if (locationHref.indexOf('deviceInfo.html')>=0){
        var robotId = args.robotId, appId = args.appId;
        if(robotId == null || robotId === '' || robotId === 'empty' || appId == null || appId === '' || appId === 'empty'){
            console.log('没 appId robotId 信息');
            store.set('robotId','empty');
            store.set('appId','empty');

        } else {
            //存储appId robotId信息
            store.set('robotId',args.robotId);
            store.set('appId',args.appId);
        }
        console.log('robotId: ' + store.get('robotId'));
        console.log('appId: ' + store.get('appId'));

    }

    console.log('openid: ' + store.get('openid'));
    console.log('deviceType: ' + store.get('deviceType'));
    // console.log('robotId: ' + store.get('robotId'));
    // console.log('appId: ' + store.get('appId'));
    // alert(store.get('openid'));
}

//获取url参数 ///index.html?userId=18768957426&robotId=2bc0400a-f0f4-11e7-9430-801844e30cac&appId=aadbee5cf0ec11e79430801844e30cac&sn=JFKJ18033000000002
//获取参数
function getUrlParameter (){
    //.toLowerCase()
    var res=location.search;
    //substring() 方法用于提取字符串中介于两个指定下标之间的字符。
    var qs = (res.length>0?res.substring(1):""),
        qs = qs.replace('?',''),
        args={},
        //split() 方法用于把一个字符串分割成字符串数组
        items = qs.length?qs.split("&"):[],
        item = null,
        name = null,
        value = null,
        i=0,
        len = items.length;
    for(i=0;i<len;i++){
        // console.log(items[i]);
        item = items[i].split("=");
        //decodeURIComponent() 函数可对 encodeURIComponent() 函数编码的 URI 进行解码
        name = decodeURIComponent(item[0]);
        value = decodeURIComponent(item[1]);
        // console.log('参数名name:' + name  + '    ' + '参数值value: ' + value);
        if(name.length){
            args[name] = value;
        }
    }
    return args;
}




//key
function getPrivateKeyWithNonceStr(nonceStr,timeStamp,openId) {
    // var tempUserId = store.get('openid');
    var keyStr = nonceStr + timeStamp + openId;
    // var privateKey = privateKeysha1(keyStr);
    return privateKeysha1(keyStr);
}


//日期格式

function getDataFommortStr() {
    var date = new Date();
    var year,month,day,hour,minute,seconds;
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    hour = date.getHours();
    minute = date.getMinutes();
    seconds = date.getSeconds();

    if (month < 10) {
        month = "0" + month;
    }

    if (day < 10) {
        day = "0" + day;
    }

    if (hour < 10) {
        hour = "0" + hour;
    }

    if (minute < 10) {
        minute = ("0" + minute);
    }

    if (seconds < 10) {
        seconds = ("0" + seconds);
    }

    // return "2018-01-01T00:00:00";
    return year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + seconds;
}


//随机串
function getNonceStr() {
    var nonceStr = randomString();
    return sha1(nonceStr);
}


function randomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

function configDomain() {
    var res = location.href;
    if (res.indexOf('https://www.deepbrain.ai')>=0){ //生产
        // alert('生产环境');
        console.log('生产环境');
        portalBaseUrl = "https://www.deepbrain.ai/";//生产
        adminBaserUrl = "https://api.deepbrain.ai/";//生产

    } else if (res.indexOf('https://www-pre.deepbrain.ai')>=0) {//预发布
        // alert('预发布环境');
        console.log('预发布环境');
        portalBaseUrl = "https://www-pre.deepbrain.ai/";//预发布
        adminBaserUrl = "https://api-pre.deepbrain.ai/";//预发布

    } else if (res.indexOf('https://www-demo.deepbrain.ai')>=0) { //demo
        // alert('demo环境');
        console.log('demo环境');
        portalBaseUrl = "https://www-demo.deepbrain.ai/"; //demo
        adminBaserUrl = "https://api-demo.deepbrain.ai/"; //demo

    }  else if (res.indexOf('https://www-test.deepbrain.ai')>=0) { //test环境
        // alert('test环境');
        console.log('test环境');
        portalBaseUrl = "https://www-test.deepbrain.ai/"; //test环境
        adminBaserUrl = "https://api-test.deepbrain.ai/"; //test环境

    } else {
        // alert('本地测试--');
        console.log('本地测试--');
        portalBaseUrl = "https://www-demo.deepbrain.ai/";
        adminBaserUrl = "https://api-demo.deepbrain.ai/";
        // adminBaserUrl = "http://192.168.20.14:9030/";
    }

}


