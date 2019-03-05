 $(function() {
    var oDiv = $('.main .content .info'),
        oSystem = $('.main .system .msg'),
        device_type = navigator.userAgent, //获取userAgent信息
        oSubmit = $('.main .submit'),
        reg = /^.*FSBrowser.*$/igm;

    function getCookie(cookieName) {
        var strCookie = document.cookie;
        var arrCookie = strCookie.split("; ");
        for (var i = 0; i < arrCookie.length; i++) {
            var arr = arrCookie[i].split("=");
            if (cookieName == arr[0]) {
                return arr[1];
            }
        }
        return "";
    }

    function render(res) {
        console.log('render');
        oSubmit.css('display', 'none');
        for (var i = 0; i < oDiv.length; i++) { //渲染后台获取信息
            oDiv[i].innerText += ' ' + res.Value.initialData[$(oDiv[i]).attr('data-prop')];
        }
        oSystem[1].innerText += ' ' + device_type; //获取并渲染userAgent信息
        if (reg.test(device_type)) { //判断是否使用纷享app打开
            alert('纷享App');
            FSOpen.init({
                appId: 'FSAID_5f5e533',
                onSuccess: function(resp) {
                    // 初始化成功回调. 所有JS API执行必须在初始化成功后，否则会出错。
                    FSOpen.runtime.getVersion({ //获取并渲染终端版本
                        onSuccess: function(resp) {
                            alert('成功获取版本信息');
                            oSystem[0].innerText += ' ' + resp.ver;
                            oSubmit.css('display', 'block'); //回调成功后显示按钮
                        }
                    });
                },
                onFail: function(error) {
                    alert('获取版本信息失败');
                    // 失败回调处理
                    if (error.errorCode === 30000) {
                        alert('请更新纷享客户端到最新版本。');
                    } else {
                        alert('初始化失败：' + JSON.stringify(error.errorMessage));
                    }
                }
            });
            if (FSOpen.util.uploadLog) {
                alert('fsopen.util.uploadLog接口存在');
                oSubmit.css('display', 'block');
                oSubmit.on('touchstart', function() {
                    alert('触发touchstart函数');
                    // oSubmit.css('background', '#f97c4b');
                    FSOpen.util.uploadLog({
                        onSuccess: function() {
                            alert('上传成功');
                        },
                        onFail: function() {
                            alert('上传失败，请重新上传');
                        }
                    });
                })
                // oSubmit.on('touchend', function() {
                //     oSubmit.css('background', '#fd944d')
                // })
            } else {
                alert('fsopen.util.uploadLog接口不存在');
                alert('请更新纷享客户端到最新版本。');
            }
        } else {
            $(oSystem[0]).css('display', 'none');
            alert('不是纷享App');
        }
    }
    $.ajax({
        url: '/FHH/EM1HORGBIZ/Organization/Employee/getPlevel?_fs_token=' + getCookie('fs_token'),
        cache: false,
        type: 'POST',
        data: JSON.stringify({}),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function() {
            $('.error').text('未知异常，获取信息失败')
        },
        success: function(res) {
            console.log('res');
            if (res.Result && res.Result.StatusCode == 0) {
                console.log('res.Result');
                render(res);
            } else {
                if (res.Action && res.Action.Code == 1) {
                    $('.error').text('请先登录帐号再访问').css('animation', 'cancel 5s 1')

                } else {
                    $('.error').text((res.Error && res.Error.Message) || '未知异常，获取信息失败');
                }
            }
        }
    })
 })
 