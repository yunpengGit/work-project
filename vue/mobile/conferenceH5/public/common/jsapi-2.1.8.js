'use strict';
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
var initApp = false;
window.responseCallBackObj = false
window.failAll = null // 总体失败回调
window.timOutFail = null
window.onerror = function (err) {
    var params = {
        url: location.href,
        err: err,
    };
    console.log('全局错误', params)
    window.failAll && window.failAll(params)
}
// JsApi 对象
function JsApi() {
    var inside = jsApiAVICInside; // 内部缓存值
    var util = jsapiAVICInsideUtils(); // 内部工具类
    try {
        if (util.getPlatform() === 'Ios') {
            // ios端通过javascriptBridge来通信
            util.setupWebViewJavascriptBridge(function (Bridge) {
                initApp = true;
                // 挂在bridge实例
                inside.setI('bridge', Bridge);
                log('JsApi->setupWebViewJavascriptBridge->Ios initApp=' + initApp);
                util.registerHandler(Bridge);
            });
        } else if (util.getPlatform() === 'Android') {
            try {
                initApp = true;
                window.avicObject.getAuthParams('init');
                inside.setI('bridge', window.avicObject);
                log('JsApi->setupWebViewJavascriptBridge->Android initApp=' + initApp);
            } catch (error) {
                console.log("不在app环境内");
            }
        } else if (util.getPlatform() === 'Windows' || util.getPlatform() === 'Mac') {
            initApp = true;
            // util.log('errorMsg', util.getErrorMsg('1003'));
            log('JsApi->setupWebViewJavascriptBridge->Windows initApp=' + initApp);
            // var electron = require('electron')
            // var ipcRenderer = electron.ipcRenderer
        }
    } catch (error) {
        util.log('error', error);
    }
}
// 内部状态类
function jsApiAVICInsideState() {
    var Iobj = {
        debug: false, // 是否打印内部log
        bridge: {}, // bridge--bridge 实例
        actionCallBack: {} // action成功失败回调
    };
    return {
        // getIobj
        getI: function getI() {
            return Iobj;
        },
        // setIobj
        setI: function setI(keyName, value) {
            for (var key in Iobj) {
                if (Iobj.hasOwnProperty(key) && key === keyName) {
                    Iobj[key] = value;
                }
            }
        }
    };
}
var jsApiAVICInside = jsApiAVICInsideState();
// 内部方法类
function jsapiAVICInsideUtils() {
    /**
     * JavascriptBridge初始化方法
     * @param {callback} callback
     */
    function setupWebViewJavascriptBridge(callback) {
        // Ios jsBridge 接入方式
        if (window.WebViewJavascriptBridge) {
            log('jsapiAVICInsideUtils->setupWebViewJavascriptBridge->window.WebViewJavascriptBridge=', window.WebViewJavascriptBridge);
            return callback(WebViewJavascriptBridge);
        }
        if (window.WVJBCallbacks) {
            return window.WVJBCallbacks.push(callback);
        }
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'https://__bridge_loaded__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function () {
            document.documentElement.removeChild(WVJBIframe);
        }, 0);
    }
    /**
     * 获取错误信息
     * @param {string} errorCode 错误码
     */
    function getErrorMsg(errorCode) {
        var errorObj = {
            code: errorCode
        };
        var msg = {
            '1003': '不在app环境内',
            '1004': '返回结果解析失败'
        };
        errorObj.message = msg[errorCode];
        return errorObj;
    }
    /**
     * log
     * @param {string} message 
     * @param {*} data 
     */
    function log(message, data) {
        var log = document.getElementById('log');
        if (jsApiAVICInside.getI().debug) {
            if (log) {
                var el = document.createElement('div');
                el.className = 'logLine';
                el.innerHTML = 'JSAPI内部打印：' + message + ':<br/>' + JSON.stringify(data) + '===';
                if (log.children.length) {
                    log.insertBefore(el, log.children[0]);
                } else {
                    log.appendChild(el);
                }
            } else {
                console.log('JSAPI内部打印：' + message + JSON.stringify(data) + '===');
            }
        }
    }
    /**
     * 获取当前所在环境
     */
    function getPlatform() {
        var userAgent = navigator.userAgent.toLowerCase();
        var name = 'Unknown';
        if (userAgent.indexOf('win') > -1) {
            name = 'Windows';
        } else if (userAgent.indexOf('iphone') > -1) {
            name = 'Ios';
        } else if (userAgent.indexOf('mac') > -1) {
            name = 'Mac';
        } else if (userAgent.indexOf('x11') > -1 || userAgent.indexOf('unix') > -1 || userAgent.indexOf('sunname') > -1 ||
            userAgent.indexOf('bsd') > -1) {
            name = 'Unix';
        } else if (userAgent.indexOf('linux') > -1) {
            if (userAgent.indexOf('android') > -1) {
                name = 'Android';
            } else {
                name = 'Linux';
            }
        } else {
            name = 'Unknown';
        }
        return name;
    }
    /**
     * handler方法封装
     * @param {string} tag callHandler标识
     * @param {object} params callHandler参数
     * @param {function} responseCallBack callHandler回调 默认设置了成功和失败回调，后续有新需求可扩展
     * @param {function} success 成功回调
     * @param {function} fail 失败回调
     * @param {function} cancel 
     */
    function actionHandler(tag, params, responseCallBack, success, fail, cancel) {
        // setTimeout(initJsapi(tag, params, responseCallBack, success, fail, cancel),200);
        initJsapi(tag, params, responseCallBack, success, fail, cancel);
    }
    window.catchIos = 1
    window.registerHandlerInit = false
    /**
     * JSAPIH5端注册事件
     * @param {bridge实例} bridge
     */
    function registerHandler(bridge) {
        // Toast('开始挂载')
        // bridge.registerHandler('testJavascriptHandler', testJsHandler);
        // if (!window.registerHandlerInit) {
        bridge.registerHandler('callPageShowOrHide', callPageShowOrHide);
        window.registerHandlerInit = true
        // }
    }
    // 监听app端发来的时间handler 暂无此需求
    function callPageShowOrHide(data, responseCallBack) {
        let receive = JSON.parse(JSON.stringify((typeof data === 'String' ? JSON.parse(data) : data)))
        log('receive', receive);
        // Toast('收到数据准备执行回调')
        console.log('testJsHandler返回数据', receive, receive.code, window.pageShow, window.pageHide)
        if (receive.code === '900001' || receive.code === 900001) {
            // Toast('执行code900001')
            console.log('testJsHandler返回数据--->pageShow', receive)
            if (window.pageShow) {
                // Toast('执行pageshow了')
                window.pageShow(receive);
            }
        } else if (receive.code === '900002' || receive.code === 900002) {
            // Toast('执行code900002')
            console.log('testJsHandler返回数据--->pageHide', receive)
            if (window.pageHide) {
                // Toast('执行pageHide了')
                window.pageHide(receive);
            }
        }
        responseCallBack && responseCallBack(receive);
    }
    function Toast(msg, duration) {
        duration = isNaN(duration) ? 1000 : duration;
        var m = document.createElement('div');
        let top = parseInt(Math.random() + Math.floor(Math.random() * 109 + 1))
        m.innerHTML = msg
        m.style.cssText =
            `max-width:60%;min-width: 150px;padding:0 14px;height: auto;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;bottom: ${top}%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;`;
        document.body.appendChild(m);
        setTimeout(function () {
            var d = 0.5;
            m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
            m.style.opacity = '0';
            setTimeout(function () {
                document.body.removeChild(m)
            }, d * 1000);
        }, duration);
    }
    function timOutFail(responseCallBack, tag) {
        setTimeout(() => {
            if (!window.responseCallBackObj && tag !== 'openScanQRCode' && tag !== 'getWxInvoiceList') {
                responseCallBack(JSON.stringify({
                    code: '402003',
                    message: 'jsapi超时未响应'
                }))
            } else {
                window.responseCallBackObj = false
            }
            window.responseCallBackObj = false
        }, 3000)
    }
    /**
     * 初始化jsapi对象
     */
    function initJsapi(tag) {
        log('initJsapi->responseCallBack->tag=' + tag);
        console.log('initJsapi->responseCallBack->tag=' + tag);
        // alert(tag);
        var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
        var responseCallBack = arguments[2];
        var success = arguments[3];
        var fail = arguments[4];
        var cancel = arguments[5];
        // Toast('调用了方法')
        if (!responseCallBack) {
            // Toast('开始绑定回调')
            responseCallBack = function responseCallBack(res) {
                // Toast('开始执行回调', res)
                if (!window.responseCallBackObj) {
                    // Toast('已响应' + tag)
                    window.responseCallBackObj = true
                }
                var resObj = {};
                // alert('initJsapi->responseCallBack->res=' + res);
                try {
                    resObj = JSON.parse(res);
                    resObj.content = resObj.content || {};
                } catch (error) {
                    fail(getErrorMsg('1004'));
                }
                // Toast('开始执行回调-------', JSON.stringify(resObj))
                // alertTitle('收到回调responseCallBack' + JSON.stringify(resObj))
                if (resObj.code === '900001') {
                    // alert('initJsapi->responseCallBack->900001');
                    window.pageShow = pageShow || null
                    pageShow && pageShow(resObj);
                } else if (resObj.code === '900002') {
                    // alert('initJsapi->responseCallBack->900002');
                    window.pageHide = pageHide || null
                    pageHide && pageHide(resObj);
                } else if (resObj.code === '200') {
                    success && success(resObj);
                } else {
                    fail && fail(resObj);
                }
            };
        }
        timOutFail(responseCallBack, tag)
        if (!initApp) {
            //是否在app内部
            if (getPlatform() === 'Ios') {
                var insideObj = jsApiAVICInside.getI();
                // alertTitle('开始执行' + JSON.stringify(insideObj.bridge))
                try {
                    log('callHandlerParams', {
                        tag: tag,
                        params: params
                    });
                    if (JSON.stringify(insideObj.bridge) !== '{}') {
                        insideObj.bridge.callHandler(tag, params, responseCallBack)
                        registerHandler(insideObj.bridge)
                        window.catchIos = 0
                    } else {
                        setTimeout(() => {
                            try {
                                insideObj.bridge.callHandler(tag, params, responseCallBack)
                            } catch (err) {
                                window.catchIos++
                                if (window.catchIos < 7) {
                                    initJsapi(tag, params, responseCallBack, success, fail, cancel);
                                }
                                // fail('错误信息错误信息insideObj.bridge是否设置' + JSON.stringify(insideObj.bridge));
                                fail('不在app内错误执行' + JSON.stringify(err));
                                fail(err)
                            }
                        }, 500)
                    }
                } catch (err) {
                    log('initJsapi->Ios catch1 ->err=', err);
                    fail('不在app内错误执行' + JSON.stringify(err))
                }
                return;
            } else {
                fail(getErrorMsg('1003'));
                return;
            }
        }
        var insideObj = jsApiAVICInside.getI();
        // 默认 responseCallBack 后续如果需要扩展则自己入参,需注意当res.content不存在时，需要赋值一个空对象{}
        if (getPlatform() === 'Ios') {
            // insideObj.bridge.callHandler(tag, params, responseCallBack);
            try {
                log('callHandlerParams', {
                    tag: tag,
                    params: params
                });
                if (JSON.stringify(insideObj.bridge) !== '{}') {
                    insideObj.bridge.callHandler(tag, params, responseCallBack)
                    registerHandler(insideObj.bridge)
                } else {
                    setTimeout(() => {
                        try {
                            insideObj.bridge.callHandler(tag, params, responseCallBack)
                            registerHandler(insideObj.bridge)
                            window.catchIos = 0
                        } catch (err) {
                            window.catchIos++
                            if (window.catchIos < 7) {
                                initJsapi(tag, params, responseCallBack, success, fail, cancel);
                            }
                            fail('在app内错误执行1' + JSON.stringify(err))
                            fail('错误信息错误信息insideObj.bridge是否设置' + JSON.stringify(insideObj.bridge));
                        }
                    }, 500)
                }
            } catch (err) {
                log('initJsapi->Ios catch2 ->err=', err);
                fail('在app内错误执行' + JSON.stringify(err))
            }
        } else if (getPlatform() === 'Android') {
            // 安卓端 callBack 需要js单独监听,故暂存一下用户失败成功回调,方便后续调用
            jsApiAVICInside.setI('actionCallBack', responseCallBack);
            // 安卓端需要 url最后一段的html文件名
            // var url = window.location.href
            // var index = url.lastIndexOf("\/")
            // str = url.substring(index + 1,url.length)
            // str = str.split('.')[0]
            // log('pathname', {pathname:str, params})
            //insideObj.bridge[tag](JSON.stringify({pathname:str, params}))
            insideObj.bridge[tag](JSON.stringify(params));
            // if (JSON.stringify(insideObj.bridge) !== '{}') {
            //   insideObj.bridge[tag](JSON.stringify({pathname:str, params}))
            // } else {
            //   fail(getErrorMsg('1003'))
            // }
        } else if (getPlatform() === 'Windows' || getPlatform() === 'Mac') {
            try {
                if (tag === 'getAuthParams') {
                    var data = params;
                    data.currTime = data.currTime * 1000;
                    console.log('鉴权成功回调', data);
                    success(data);
                }
                var electron = require('electron');
                var ipcRenderer = electron.ipcRenderer;
                ipcRenderer.send(tag, params, responseCallBack);
                ipcRenderer.on('webParent', function (event, message) {
                    if (message) {
                        console.log(message, '获取传递回来的数据------------------------');
                        success(message);
                    }
                });
                ipcRenderer.on('jsApiReturnfail', (event, message) => {
                    if (message) {
                        console.log(message, '获取传递回来失败回调------------------------');
                        fail(message)
                    }
                });
            } catch (error) {
                console.log(error)
                fail(getErrorMsg('1003'))
            }
        }
    }
    return {
        setupWebViewJavascriptBridge: setupWebViewJavascriptBridge,
        getErrorMsg: getErrorMsg,
        log: log,
        getPlatform: getPlatform,
        actionHandler: actionHandler,
        registerHandler: registerHandler
    };
}
/**
 * 安卓异步回调统一处理方法
 * @param {string} res 获取到的res是个经过encode过的JSON字符串 
 */
function androidResponseCallBack(res) {
    var decodeRes = '';
    var resObj = ''
    try {
        decodeRes = decodeURIComponent(res);
        resObj = JSON.parse(decodeRes);
    } catch (error) {
        jsapiAVICInsideUtils().log('msg', jsapiAVICInsideUtils().getErrorMsg('1004'));
    }
    if ((typeof resObj === 'undefined' ? 'undefined' : _typeof(resObj)) === 'object') {
        jsApiAVICInside.getI().actionCallBack(decodeRes);
        try {
            setTimeout(() => {
                window.closePhoto && window.closePhoto()
            }, 500)
        } catch (err) {
            console.log('执行关闭图片报错')
        }
        console.log('当前获取的状态', window.openPhoto)
        return window.openPhoto ? window.openPhoto : '获取安卓端异步数据成功';
    }
    return '获取安卓端异步数据失败';
}
/**
 * jsApi初始化config方法
 * @param {string} appId app的唯一标识
 * @param {string} currTime 生成签名的时间戳
 * @param {string} once 生成签名的随机串
 * @param {string} sign 签名
 * @param {callBack} ready config验证成功的回调
 * @param {callBack} error config验证失败的回调
 */
JsApi.prototype.auth = function (_ref) {
    var appId = _ref.appId;
    var currTime = _ref.currTime;
    var once = _ref.once;
    var sign = _ref.sign;
    var success = _ref.success;
    var fail = _ref.fail;
    window.failAll = fail
    var util = jsapiAVICInsideUtils(); // 内部工具类
    var params = {
        appId: appId,
        currTime: currTime,
        once: once,
        sign: sign
    };
    util.log('初始化auth参数', params);
    // 成功后 去挂在和客户端通信的实例对象
    util.actionHandler('getAuthParams', params, null, success, fail);
    // 校验状态，暂时默认为true，后续更改实际做校验后再做调整
    util.log('getPlatform', util.getPlatform());
};
/**
 * H5唤起原生扫码方法
 * @param {function} success success回调
 * @param {function} fail fail回调
 * @param {function} cancel cancel回调
 */
JsApi.prototype.scanQRCode = function (_ref2) {
    var appId = _ref2.appId;
    var success = _ref2.success;
    var fail = _ref2.fail;
    window.failAll = fail
    jsapiAVICInsideUtils().actionHandler('openScanQRCode', {
        appId: appId
    }, null, success, fail);
};
/**
 * H5获取本地location方法
 * @param {string} type 坐标类型,默认wgs84的gps坐标
 * @param {function} success success回调
 * @param {function} fail fail回调
 * @param {function} cancel cancel回调
 */
JsApi.prototype.getLocation = function (_ref3) {
    var appId = _ref3.appId;
    var success = _ref3.success;
    var fail = _ref3.fail;
    window.failAll = fail
    jsapiAVICInsideUtils().actionHandler('getLocation', {
        appId: appId
    }, null, success, fail);
};
/**
 * H5获取本地通讯录方法
 * @param {number} type 1--单选,2--多选 default--1  
 * @param {String} fromType 1--云会议-预约会议, 2--会议室预约, 3--活动邀约-发起活动
 * @param {number} maxNum 最大支持选择人数
 * @param {String} members 已选中人员 格式：userId@status||userId@status  userId为sso用户Id;status：1支持删除，2：不可删除
 * @param {number} authLevel  // 是否开启权限级别：0.控制，1.不控制 默认给0可删除 
 * @param {function} success success回调
 * @param {function} fail fail回调
 * @param {function} cancel cancel回调
 * @param {string} toast 提示语
 */
JsApi.prototype.addressBook = function (_ref4) {
    var appId = _ref4.appId;
    var type = _ref4.type;
    var fromType = _ref4.fromType
    var maxNum = _ref4.maxNum;
    var members = _ref4.members;
    var authLevel = _ref4.authLevel;
    var toast = _ref4.toast
    var success = _ref4.success;
    var fail = _ref4.fail;
    window.failAll = fail
    if (!type) {
        // 默认type 1
        type = 1, maxNum, members;
    }
    if (!fromType) fromType = '1'
    console.log('走到了addressBook========', appId, type, maxNum, members)
    jsapiAVICInsideUtils().actionHandler('getAddressBook', {
        appId: appId,
        type: type,
        maxNum: maxNum,
        members: members,
        authLevel: authLevel,
        fromType: fromType,
        toast: toast
    }, null, success, fail);
};
/**
 * 关闭webView
 */
JsApi.prototype.closeWebView = function (_ref4) {
    var appId = _ref4.appId
    var success = _ref4.success
    var fail = _ref4.fail
    window.failAll = false
    console.log('开始关闭webView=====')
    jsapiAVICInsideUtils().actionHandler('closeWebView', {
        appId: appId
    }, null, success, fail)
}
/**
 * H5保存图片
 * @param {String}  PictureUrl 图片的url地址
 * @param {String}  PictureType  图片类型
 */
JsApi.prototype.savePictureForLocate = function (_ref4) {
    var appId = _ref4.appId
    var success = _ref4.success
    var fail = _ref4.fail
    var PictureUrl = _ref4.PictureUrl
    var PictureType = _ref4.PictureType
    if (!PictureType) PictureType = 'png'
    window.failAll = false
    console.log('开始保存图片=====')
    jsapiAVICInsideUtils().actionHandler('savePictureForLocate', {
        appId: appId,
        PictureUrl: PictureUrl,
        PictureType: PictureType
    }, null, success, fail)
}
/**
 * H5获取鉴权方法
 * @param {function} fail fail回调
 * @param {function} cancel cancel回调
 */
JsApi.prototype.getAvoidLoginToken = function (_ref4) {
    var appId = _ref4.appId || '1234567'
    var success = _ref4.success
    var fail = _ref4.fail
    window.failAll = fail
    console.log('走到了getAvoidLoginToken========', appId)
    // alert('走到了getAvoidLoginToken========', appId)
    jsapiAVICInsideUtils().actionHandler('getAvoidLoginToken', {
        appId: appId
    }, null, success, fail)
}
/**
 * H5 点击图片提交url数组
 * @param {function} imageList imageList 当前H5的地址数组
 * @param {function} defaultUrl defaultUrl 默认展示的URL
 * @param {function} fail fail回调
 * @param {function} cancel cancel回调
 */
JsApi.prototype.giveImageList = function (_ref4) {
    var appId = _ref4.appId || '1234567'
    var imageList = _ref4.imageList || []
    var defaultUrl = _ref4.defaultUrl || ''
    var success = _ref4.success
    var fail = _ref4.fail
    console.log('走到了giveImageList========', appId)
    window.failAll = fail
    // alert('走到了getAvoidLoginToken========', appId)
    jsapiAVICInsideUtils().actionHandler('giveImageList', {
        appId: appId,
        imageList: imageList,
        defaultUrl: defaultUrl
    }, null, success, fail)
}
/**
 * H5 同步日程
 * @param {function} appID appID 传入appID
 * @param {function} fail fail回调
 * @param {function} cancel cancel回调
 */
JsApi.prototype.synchronizationchedule = function (_ref4) {
    var appId = _ref4.appId
    var success = _ref4.success
    var fail = _ref4.fail
    window.failAll = fail
    console.log('走到了synchronizationchedule========', appId)
    // alert('走到了getAvoidLoginToken========', appId)
    jsapiAVICInsideUtils().actionHandler('synchronizationchedule', {
        appId: appId,
    }, null, success, fail)
}
/**
 * H5 同步日程
 * @param {function} appID appID 传入appID
 * @param {function} fail fail回调
 * @param {function} cancel cancel回调
 */
JsApi.prototype.workBenchUpdate = function (_ref4) {
    var appId = _ref4.appId
    var num = _ref4.num
    var success = _ref4.success
    var fail = _ref4.fail
    window.failAll = fail
    console.log('走到了workBenchUpdate========', appId)
    // alert('走到了getAvoidLoginToken========', appId)
    jsapiAVICInsideUtils().actionHandler('workBenchUpdate', {
        appId: appId,
        num: num
    }, null, success, fail)
}
JsApi.prototype.peopleJump = function (_ref4) {
    var accid = _ref4.accid
    var appId = _ref4.appId
    var userStatus = _ref4.userStatus
    var success = _ref4.success
    var fail = _ref4.fail
    window.failAll = fail
    console.log('peopleJump========', appId, userStatus, accid)
    // alert('走到了getAvoidLoginToken========', appId)
    jsapiAVICInsideUtils().actionHandler('peopleJump', {
        accid: accid,
        userStatus: userStatus,
        appId: appId
    }, null, success, fail)
}
// 视频播放
JsApi.prototype.openH5VideoStart = function (_ref4) {
    var VideoUrl = _ref4.VideoUrl
    var appId = _ref4.appId
    var VideoThumbUrl = _ref4.VideoThumbUrl
    var success = _ref4.success
    var fail = _ref4.fail
    window.failAll = fail
    console.log('openH5VideoStart========', appId, VideoThumbUrl, VideoUrl)
    // alert('走到了getAvoidLoginToken========', appId)
    jsapiAVICInsideUtils().actionHandler('openH5VideoStart', {
        VideoUrl: VideoUrl,
        VideoThumbUrl: VideoThumbUrl,
        appId: appId
    }, null, success, fail)
}
// 图片长按播放
JsApi.prototype.showH5PictureWindow = function (_ref4) {
    var PictureUrl = _ref4.PictureUrl
    var appId = _ref4.appId
    var PictureType = _ref4.PictureType || ''
    var success = _ref4.success
    var fail = _ref4.fail
    window.failAll = fail
    console.log('showH5PictureWindow========', appId, PictureType, PictureUrl, _ref4)
    let params = {
        PictureUrl: PictureUrl,
        PictureType: PictureType,
        appId: appId
    }
    params.isPrivatePublic = _ref4.isPrivatePublic || 0
    // alert('走到了getAvoidLoginToken========', appId)
    jsapiAVICInsideUtils().actionHandler('showH5PictureWindow', params, null, success, fail)
}
/**
 * H5 获取字体大小变化
 * @param {function} fail fail回调
 * @param {function} cancel cancel回调
 */
JsApi.prototype.getIncrementFontSize = function (_ref4) {
    var appId = _ref4.appId || '1234567'
    var success = _ref4.success
    var fail = _ref4.fail
    window.failAll = fail
    console.log('走到了getIncrementFontSize========', appId)
    // alert('走到了getAvoidLoginToken========', appId)
    jsapiAVICInsideUtils().actionHandler('getIncrementFontSize', {
        appId: appId
    }, null, success, fail)
}
/**
 * H5分享方法
 * @param {string} imgUrl 分享图标url
 * @param {string} title 分享标题
 * @param {string} desc 分享描述
 * @param {string} link 分享链接
 * @param {function} success success回调
 * @param {function} fail fail回调
 * @param {function} cancel cancel回调
 */
JsApi.prototype.share = function (_ref5) {
    var appId = _ref5.appId;
    var imgUrl = _ref5.imgUrl;
    var title = _ref5.title;
    var desc = _ref5.desc;
    var link = _ref5.link;
    var success = _ref5.success;
    var fail = _ref5.fail;
    window.failAll = fail
    jsapiAVICInsideUtils().actionHandler('getShare', {
        appId: appId,
        imgUrl: imgUrl,
        title: title,
        desc: desc,
        link: link
    }, null, success, fail);
};
/**
 * jsApi创建会议室方法
 * @param {string} appId app的唯一标识
 * @param {string} roomId 会议ID
 * @param {string} type 1 音频；2 视频
 * @param {string} resolutionRatio 320，480，720，1080
 * @param {string} title 会议主题
 * @param {string} meetingTime 会议时间
 * @param {string} shareUrl 分享url
 * @param {string} meettingUrl 腾讯会议url
 * @param {int} openAudio 开启音频 0 不开，1开启
 * @param {int} openCamera 开启摄像头 0 不开；1 开启
 * @param {string} manager 主持人ID(用户中心userId)
 * @param {string} members 新的参会人员ID(用户中心userId)，包括主持人，多人时“,”隔开
 * @param {callBack} success 成功的回调
 * @param {callBack} fail 失败的回调
 * @param {string} fromeType 来源
 * @param {string} toast 提示语
 */
JsApi.prototype.createOnlineMeeting = function (_ref6) {
    var {appId, roomId, fromeType, toast, type, resolutionRatio, title, meetingTime, shareUrl, meettingUrl, openAudio, openCamera, manager, members, success, fail} = _ref6
    window.failAll = fail
    var util = jsapiAVICInsideUtils(); // 内部工具类
    var params = {
        appId: appId,
        roomId: roomId,
        type: type,
        fromeType,
        toast,
        resolutionRatio: resolutionRatio,
        title: title,
        meetingTime: meetingTime,
        shareUrl: shareUrl,
        meettingUrl: meettingUrl,
        openAudio: openAudio,
        openCamera: openCamera,
        manager: manager,
        members: members
    };
    util.log('createOnlineMeeting参数', params);
    // 成功后 去挂在和客户端通信的实例对象
    util.actionHandler('createOnlineMeeting', params, null, success, fail);
    // 校验状态，暂时默认为true，后续更改实际做校验后再做调整
    util.log('getPlatform', util.getPlatform());
};
/**
 * jsApi会议室加人接口
 * @param {string} appId app的唯一标识
 * @param {string} roomId 会议ID
 * @param {string} type 1 音频；2 视频
 * @param {string} resolutionRatio 320，480，720，1080
 * @param {string} title 会议主题
 * @param {string} meetingTime 会议时间
 * @param {string} shareUrl 分享url
 * @param {int} openAudio 开启音频 0 不开，1开启
 * @param {int} openCamera 开启摄像头 0 不开；1 开启
 * @param {int} selfOpenAudio 当前用户音频 0 不开，1开启
 * @param {int} selfOpenCamera 当前用户开启摄像头 0 不开；1 开启
 * @param {string} manager 主持人ID(用户中心userId)
 * @param {string} members 新的参会人员ID(用户中心userId)，包括主持人，多人时“,”隔开
 * @param {callBack} success 成功的回调
 * @param {callBack} fail 失败的回调
 */
JsApi.prototype.onlineMeetingAddMember = function (_ref7) {
    var appId = _ref7.appId;
    var roomId = _ref7.roomId;
    var type = _ref7.type;
    var resolutionRatio = _ref7.resolutionRatio;
    var title = _ref7.title;
    var meetingTime = _ref7.meetingTime;
    var shareUrl = _ref7.shareUrl;
    var openAudio = _ref7.openAudio;
    var openCamera = _ref7.openCamera;
    var selfOpenAudio = _ref7.selfOpenAudio;
    var selfOpenCamera = _ref7.selfOpenCamera;
    var manager = _ref7.manager;
    var members = _ref7.members;
    var success = _ref7.success;
    var fail = _ref7.fail;
    window.failAll = fail
    var util = jsapiAVICInsideUtils(); // 内部工具类
    var params = {
        appId: appId,
        roomId: roomId,
        type: type,
        resolutionRatio: resolutionRatio,
        title: title,
        meetingTime: meetingTime,
        shareUrl: shareUrl,
        openAudio: openAudio,
        openCamera: openCamera,
        selfOpenAudio: selfOpenAudio,
        selfOpenCamera: selfOpenCamera,
        manager: manager,
        members: members
    };
    util.log('onlineMeetingAddMember参数', params);
    // 成功后 去挂在和客户端通信的实例对象
    util.actionHandler('onlineMeetingAddMember', params, null, success, fail);
    // 校验状态，暂时默认为true，后续更改实际做校验后再做调整
    util.log('getPlatform', util.getPlatform());
};
/**
 * jsApi预约会议室加人接口
 * @param {string} appId app的唯一标识
 * @param {string} roomId 会议ID
 * @param {string} type 1 音频；2 视频
 * @param {string} resolutionRatio 320，480，720，1080
 * @param {string} title 会议主题
 * @param {string} meetingTime 会议时间
 * @param {string} shareUrl 分享url
 * @param {int} openAudio 开启音频 0 不开，1开启
 * @param {int} openCamera 开启摄像头 0 不开；1 开启
 * @param {int} selfOpenAudio 当前用户音频 0 不开，1开启
 * @param {int} selfOpenCamera 当前用户开启摄像头 0 不开；1 开启
 * @param {string} manager 主持人ID(用户中心userId)
 * @param {string} members 新的参会人员ID(用户中心userId)，包括主持人，多人时“,”隔开
 * @param {callBack} success 成功的回调
 * @param {callBack} fail 失败的回调
 */
JsApi.prototype.subscribeOnlineMeetingAddMember = function (_ref8) {
    var appId = _ref8.appId;
    var roomId = _ref8.roomId;
    var type = _ref8.type;
    var resolutionRatio = _ref8.resolutionRatio;
    var title = _ref8.title;
    var meetingTime = _ref8.meetingTime;
    var shareUrl = _ref8.shareUrl;
    var openAudio = _ref8.openAudio;
    var openCamera = _ref8.openCamera;
    var selfOpenAudio = _ref8.selfOpenAudio;
    var selfOpenCamera = _ref8.selfOpenCamera;
    var manager = _ref8.manager;
    var members = _ref8.members;
    var success = _ref8.success;
    var fail = _ref8.fail;
    window.failAll = fail
    var util = jsapiAVICInsideUtils(); // 内部工具类
    var params = {
        appId: appId,
        roomId: roomId,
        type: type,
        resolutionRatio: resolutionRatio,
        title: title,
        meetingTime: meetingTime,
        shareUrl: shareUrl,
        openAudio: openAudio,
        openCamera: openCamera,
        selfOpenAudio: selfOpenAudio,
        selfOpenCamera: selfOpenCamera,
        manager: manager,
        members: members
    };
    util.log('subscribeOnlineMeetingAddMember参数', params);
    // 成功后 去挂在和客户端通信的实例对象
    util.actionHandler('subscribeOnlineMeetingAddMember', params, null, success, fail);
    // 校验状态，暂时默认为true，后续更改实际做校验后再做调整
    util.log('getPlatform', util.getPlatform());
};
/**
 * jsApi分享html
 * @param {string} appId app的唯一标识
 * @param {string} title 页面title
 * @param {string} img 分享的图片
 * @param {string} content 分享的内容
 * @param {string} link 分享调整链接
 * @param {callBack} success 成功的回调
 * @param {callBack} fail 失败的回调
 */
JsApi.prototype.shareHtml = function (_ref9) {
    var appId = _ref9.appId;
    var title = _ref9.title;
    var img = _ref9.img;
    var content = _ref9.content;
    var link = _ref9.link;
    var success = _ref9.success;
    var fail = _ref9.fail;
    window.failAll = fail
    var util = jsapiAVICInsideUtils(); // 内部工具类
    var params = {
        appId: appId,
        title: title,
        img: img,
        content: content,
        link: link
    };
    util.log('shareHtml参数', params);
    // 成功后 去挂在和客户端通信的实例对象
    util.actionHandler('shareHtml', params, null, success, fail);
    // 校验状态，暂时默认为true，后续更改实际做校验后再做调整
    util.log('getPlatform', util.getPlatform());
};
/**
 * jsApi设置页面title
 * @param {string} title 会议主题
 * @param {callBack} success 成功的回调
 * @param {callBack} fail 失败的回调
 */
JsApi.prototype.setPageTitle = function (_ref10) {
    var title = _ref10.title;
    var success = _ref10.success;
    var fail = _ref10.fail;
    window.failAll = fail
    var util = jsapiAVICInsideUtils(); // 内部工具类
    var params = {
        title: title
    };
    util.log('setPageTitle参数', params);
    // 成功后 去挂在和客户端通信的实例对象
    util.actionHandler('setPageTitle', params, null, success, fail);
    // 校验状态，暂时默认为true，后续更改实际做校验后再做调整
    util.log('getPlatform', util.getPlatform());
};
/**
 * 璺宠浆鑷冲叕浼楀彿璇︽儏鐣岄潰
 * @param {string} appId app鐨勫敮涓€鏍囪瘑
 * @param {string} accid 鍏紬鍙峰搴旂殑accid
 * @param {callBack} success 鎴愬姛鐨勫洖璋�
 * @param {callBack} fail 澶辫触鐨勫洖璋�
 */
JsApi.prototype.goToPublicDetailPage = function (_ref12) {
    var appId = _ref12.appId;
    var accid = _ref12.accid;
    var success = _ref12.success;
    var fail = _ref12.fail;
    window.failAll = fail
    var util = jsapiAVICInsideUtils(); // 鍐呴儴宸ュ叿绫�
    var params = {
        appId: appId,
        accid: accid
    };
    util.log('goToPublicDetailPage鍙傛暟', params);
    // 鎴愬姛鍚� 鍘绘寕鍦ㄥ拰瀹㈡埛绔€氫俊鐨勫疄渚嬪璞�
    util.actionHandler('goToPublicDetailPage', params, null, success, fail);
    // 鏍￠獙鐘舵€侊紝鏆傛椂榛樿涓簍rue锛屽悗缁洿鏀瑰疄闄呭仛鏍￠獙鍚庡啀鍋氳皟鏁�
    util.log('getPlatform', util.getPlatform());
};
/**
 * 閾炬帴鍙充笂瑙掕彍鍗曟坊鍔�
 * @param {string} appId app鐨勫敮涓€鏍囪瘑
 * @param {string} data  鑿滃崟閰嶇疆鏁版嵁
 * @param {callBack} success 鎴愬姛鐨勫洖璋�
 * @param {callBack} fail 澶辫触鐨勫洖璋�
 */
JsApi.prototype.addHtmlMenu = function (_ref13) {
    var appId = _ref13.appId;
    var data = _ref13.data;
    var success = _ref13.success;
    var fail = _ref13.fail;
    window.failAll = fail
    var util = jsapiAVICInsideUtils(); // 鍐呴儴宸ュ叿绫�
    var params = {
        appId: appId,
        data: data
    };
    util.log('addHtmlMenu鍙傛暟', params);
    // 鎴愬姛鍚� 鍘绘寕鍦ㄥ拰瀹㈡埛绔€氫俊鐨勫疄渚嬪璞�
    util.actionHandler('addHtmlMenu', params, null, success, fail);
    // 鏍￠獙鐘舵€侊紝鏆傛椂榛樿涓簍rue锛屽悗缁洿鏀瑰疄闄呭仛鏍￠獙鍚庡啀鍋氳皟鏁�
    util.log('getPlatform', util.getPlatform());
};
/**
 * 閾炬帴鍙充笂瑙掕彍鍗曟坊鍔�
 * @param {string} appId app鐨勫敮涓€鏍囪瘑
 * @param {对象数组} typeData  
 * @param {callBack} success 鎴愬姛鐨勫洖璋�
 * @param {callBack} fail 澶辫触鐨勫洖璋�
 */
JsApi.prototype.shareOtherMenu = function (_ref13) {
    var appId = _ref13.appId;
    var typeData = _ref13.typeData;
    var extra = _ref13.extra
    var success = _ref13.success;
    var fail = _ref13.fail;
    window.failAll = fail
    var util = jsapiAVICInsideUtils(); // 鍐呴儴宸ュ叿绫�
    var params = {
        appId: appId,
        typeData: typeData,
        extra: extra
    };
    util.log('shareOtherMenu', params);
    // 鎴愬姛鍚� 鍘绘寕鍦ㄥ拰瀹㈡埛绔€氫俊鐨勫疄渚嬪璞�
    util.actionHandler('shareOtherMenu', params, null, success, fail);
    // 鏍￠獙鐘舵€侊紝鏆傛椂榛樿涓簍rue锛屽悗缁洿鏀瑰疄闄呭仛鏍￠獙鍚庡啀鍋氳皟鏁�
    util.log('getPlatform', util.getPlatform());
};
/**
 * 閾炬帴鍙充笂瑙掕彍鍗曟坊鍔�
 * @param {string} appId app鐨勫敮涓€鏍囪瘑
 * @param {string} data  鑿滃崟閰嶇疆鏁版嵁
 * @param {callBack} success 鎴愬姛鐨勫洖璋�
 * @param {callBack} fail 澶辫触鐨勫洖璋�
 */
JsApi.prototype.getPublicNoArticalDetailShareInfo = function (_ref13) {
    var appId = _ref13.appId;
    var img = _ref13.img;
    var content = _ref13.content;
    var title = _ref13.title;
    var avater = _ref13.avater;
    var name = _ref13.name;
    var link = _ref13.link;
    var success = _ref13.success;
    var fail = _ref13.fail;
    window.failAll = fail
    var util = jsapiAVICInsideUtils(); // 鍐呴儴宸ュ叿绫�
    var params = {
        appId: appId,
        img: img,
        title: title,
        name: name,
        avater: avater,
        link: link,
        content: content,
    };
    util.log('getPublicNoArticalDetailShareInfo鍙傛暟', params);
    // 鎴愬姛鍚� 鍘绘寕鍦ㄥ拰瀹㈡埛绔€氫俊鐨勫疄渚嬪璞�
    util.actionHandler('getPublicNoArticalDetailShareInfo', params, null, success, fail);
    // 鏍￠獙鐘舵€侊紝鏆傛椂榛樿涓簍rue锛屽悗缁洿鏀瑰疄闄呭仛鏍￠獙鍚庡啀鍋氳皟鏁�
    util.log('getPlatform', util.getPlatform());
};
/**
 * H5唤起原生地图APP
 * @param {string} appId app的唯一标识
 * @param {string} originLat  30.231644, //传0代表当前位置
 * @param {string} originLong  120.238732,//传0代表当前位置
 * @param {string} originName:'出发地'，//起始坐标传0、默认为当前位置、不为0时、传出发地名称
 * @param {string} destinationLat : 30.299019,
 * @param {string} destinationLong : 120.218897,
 * @param {string} destinationName:'目的地'，
 * @param {callBack} success 鎴愬姛鐨勫洖璋�
 * @param {callBack} fail 澶辫触鐨勫洖璋�
 * 
 */
JsApi.prototype.getJumptoNativeMapAppInfo = function (_ref13) {
    var appId = _ref13.appId;
    var originLat = _ref13.originLat;
    var originLong = _ref13.originLong;
    var originName = _ref13.originName;
    var destinationLat = _ref13.destinationLat;
    var destinationLong = _ref13.destinationLong;
    var destinationName = _ref13.destinationName;
    var success = _ref13.success;
    var fail = _ref13.fail;
    window.failAll = fail
    var util = jsapiAVICInsideUtils(); // 鍐呴儴宸ュ叿绫�
    var params = {
        appId: appId,
        originLat: originLat,
        originLong: originLong,
        originName: originName,
        destinationLat: destinationLat,
        destinationLong: destinationLong,
        destinationName: destinationName,
    };
    util.log('getJumptoNativeMapAppInfo鍙傛暟', params);
    // 鎴愬姛鍚� 鍘绘寕鍦ㄥ拰瀹㈡埛绔€氫俊鐨勫疄渚嬪璞�
    util.actionHandler('getJumptoNativeMapAppInfo', params, null, success, fail);
    // 鏍￠獙鐘舵€侊紝鏆傛椂榛樿涓簍rue锛屽悗缁洿鏀瑰疄闄呭仛鏍￠獙鍚庡啀鍋氳皟鏁�
    util.log('getPlatform', util.getPlatform());
};
/**
 * H5获取APP版本号接口
 * @param {callBack} success 成功的回调
 * @param {callBack} fail 失败的回调
 */
JsApi.prototype.getAppVersion = function (_ref11) {
    var success = _ref11.success;
    var fail = _ref11.fail;
    window.failAll = fail
    var util = jsapiAVICInsideUtils(); // 内部工具类
    var params = {};
    util.log('getAppVersion请求开始');
    // 成功后 去挂在和客户端通信的实例对象
    util.actionHandler('getAppVersion', params, null, success, fail);
    // 校验状态，暂时默认为true，后续更改实际做校验后再做调整
    util.log('getPlatform', util.getPlatform());
};
/**
 * 添加水印
 * @param {callBack} success 成功的回调
 * @param {callBack} fail 失败的回调
 */
JsApi.prototype.addWaterMark = function (_ref12) {
    var success = _ref12.success;
    var fail = _ref12.fail;
    window.failAll = fail
    var util = jsapiAVICInsideUtils(); // 内部工具类
    var params = {};
    util.log('addWaterMark请求开始');
    // 成功后 去挂在和客户端通信的实例对象
    util.actionHandler('addWaterMark', params, null, success, fail);
    // 校验状态，暂时默认为true，后续更改实际做校验后再做调整
    util.log('getPlatform', util.getPlatform());
};
/**
 * 设置H5类型
 * @param {string} appId app的唯一标识
 * @param {string} type:0, // 0:表示默认的左箭头右叉     1:表示文章详情   左叉右边空
 * @param {callBack} success 成功的回调
 * @param {callBack} fail 失败的回调
 */
JsApi.prototype.setH5Type = function (_ref13) {
    var appId = _ref13.appId;
    var type = _ref13.type;
    var success = _ref13.success;
    var fail = _ref13.fail;
    window.failAll = fail
    var util = jsapiAVICInsideUtils(); // 内部工具类
    var params = {
        appId: appId,
        type: type
    };
    util.log('setH5Type请求开始');
    // 成功后 去挂在和客户端通信的实例对象
    util.actionHandler('setH5Type', params, null, success, fail);
    // 校验状态，暂时默认为true，后续更改实际做校验后再做调整
    util.log('getPlatform', util.getPlatform());
};
/**
 * 给原生H5详情数据
 * @param {string} appId app的唯一标识
 * @param {string} type : 0,//H5类型    0：表示普通类型  1：表示文章类型
 * @param {string} extra:, //备用,额外数据    type为1时的数据为"{ publicId:xxxx,publicAccid:xxxx,publicName:xxxx,publicImg:xxxxx }"
 * @param {callBack} success 成功的回调
 * @param {callBack} fail 失败的回调
 */
JsApi.prototype.setH5Detail = function (_ref14) {
    var appId = _ref14.appId;
    var type = _ref14.type;
    var extra = _ref14.extra;
    var success = _ref14.success;
    var fail = _ref14.fail;
    window.failAll = fail
    var util = jsapiAVICInsideUtils(); // 内部工具类
    var params = {
        appId: appId,
        type: type,
        extra: extra
    };
    util.log('setH5Detail请求开始');
    // 成功后 去挂在和客户端通信的实例对象
    util.actionHandler('setH5Detail', params, null, success, fail);
    // 校验状态，暂时默认为true，后续更改实际做校验后再做调整
    util.log('getPlatform', util.getPlatform());
};
let appId = null;
let pageShow = null;
window.pageShow = null;
let pageHide = null;
window.pageHide = null;
/**
 * 隐藏或显示页面
 * @param {string} appId app的唯一标识
 */
JsApi.prototype.pageShowOrHide = function (_ref15) {
    // alert('jsapi pageShowOrHide ')
    appId = _ref15.appId;
    pageShow = _ref15.pageShow;
    window.pageShow = _ref15.pageShow;
    pageHide = _ref15.pageHide;
    window.pageHide = _ref15.pageHide;
    var util = jsapiAVICInsideUtils(); // 内部工具类
    var params = {
        appId: appId
    };
    util.log('pageShowOrHide请求开始');
    // 成功后 去挂在和客户端通信的实例对象
    util.actionHandler('pageShowOrHide', params, null, pageShow, pageHide);
    // 校验状态，暂时默认为true，后续更改实际做校验后再做调整
    util.log('getPlatform', util.getPlatform());
};
/**
 * 打开/关闭蓝牙
 * @param {string} opeType 操作类型  0，关闭；1，开启
 * @param {function} success success回调
 * @param {function} fail fail回调
 * @param {function} cancel cancel回调
 */
JsApi.prototype.opeBluetooth = function (_ref) {
    var appId = _ref.appId;
    var opeType = _ref.opeType;
    var success = _ref.success;
    var fail = _ref.fail;
    window.failAll = fail
    jsapiAVICInsideUtils().actionHandler('opeBluetooth', {
        appId: appId,
        opeType: opeType
    }, null, success, fail);
};
/**
 * 获取蓝牙设备列表
 * @param {string} namePrefix 选填，设备名称前缀，会获取蓝牙设备时会通过名称前缀匹配
 * @param {function} success success回调
 * @param {function} fail fail回调
 * @param {function} cancel cancel回调
 */
JsApi.prototype.bluetoothDeviceArray = function (_ref) {
    var appId = _ref.appId;
    var namePrefix = _ref.namePrefix;
    var success = _ref.success;
    var fail = _ref.fail;
    window.failAll = fail
    jsapiAVICInsideUtils().actionHandler('bluetoothDeviceArray', {
        appId: appId,
        namePrefix: namePrefix
    }, null, success, fail);
};
/**
 * 打印桌牌
 * @param {string} mac 必填，打印设备的mac地址
 * @param {string} imgUrl 需要传输的图片的url地址
 * @param {function} success success回调
 * @param {function} fail fail回调
 * @param {function} cancel cancel回调
 */
JsApi.prototype.printTableCard = function (_ref) {
    var appId = _ref.appId;
    var mac = _ref.mac;
    var imgUrl = _ref.imgUrl;
    var success = _ref.success;
    var fail = _ref.fail;
    window.failAll = fail
    jsapiAVICInsideUtils().actionHandler('printTableCard', {
        appId: appId,
        mac: mac,
        imgUrl: imgUrl
    }, null, success, fail);
};
/**
 * 获取步数
 * @param {string} dateStr 必填，需要获取步数的日期，多人时“,”隔开 例如：20210317,20210318；最大支持获取跨度30天内数据
 * @param {function} success success回调
 * @param {function} fail fail回调
 * @param {function} cancel cancel回调
 */
JsApi.prototype.getSteps = function (_ref) {
    var appId = _ref.appId;
    var success = _ref.success;
    var fail = _ref.fail;
    window.failAll = fail
    jsapiAVICInsideUtils().actionHandler('getSteps', {
        appId: appId
    }, null, success, fail);
};
/**
 * 加人会议室接口
 * @param {string} meetingId //会议号（必须）
 * @param {string} nickName //昵称（非必须）
 * @param {boolean} micOn //⼊会⻨克⻛是否开启（默认为false，⾮必须）
 * @param {boolean} cameraOn //⼊会摄像头是否开启（默认为false，⾮必须）
 * @param {boolean} speakerOn //是否开启⻨克⻛（默认为false，⾮必须）
 * @param {function} success success回调
 * @param {function} fail fail回调
 * @param {function} cancel cancel回调
 */
JsApi.prototype.joinMeeting = function (_ref) {
    var {appId, meetingCode, nickName, title, shareUrl, micOn, cameraOn, speakerOn, success, fail, meettingUrl} = _ref
    window.failAll = fail
    jsapiAVICInsideUtils().actionHandler('joinMeeting', {
        appId: appId,
        meetingCode,
        title,
        shareUrl,
        nickName,
        micOn,
        cameraOn,
        meettingUrl,
        speakerOn
    }, null, success, fail);
};
/**
 * 会议室登录接口
 * @param {function} success success回调
 * @param {function} fail fail回调
 * @param {function} cancel cancel回调
 */
JsApi.prototype.loginMeeting = function (_ref) {
    var appId = _ref.appId;
    var success = _ref.success;
    var fail = _ref.fail;
    window.failAll = fail
    jsapiAVICInsideUtils().actionHandler('loginMeeting', {
        appId: appId
    }, null, success, fail);
};
/**
 * getClipboardContent 获取剪切板内容
 * @param {function} success success回调
 * @param {function} fail fail回调
 * @param {function} cancel cancel回调
 */
JsApi.prototype.getClipboardContent = function (_ref) {
    var success = _ref.success;
    var fail = _ref.fail;
    window.failAll = fail
    jsapiAVICInsideUtils().actionHandler('getClipboardContent', {}, null, success, fail);
};
/**
 * screenDirection 设置屏幕方向
 * @param {int} success success回调
 * @param {function} success success回调
 * @param {function} fail fail回调
 * @param {function} cancel cancel回调
 */
JsApi.prototype.screenDirection = function (_ref) {
    var screenType = _ref.screenType; //屏幕方向类型 1强制横屏 2关闭强制横屏
    var hideStatusBar = _ref.hideStatusBar; //是否隐藏转态栏 1隐藏 2开启
    var success = _ref.success;
    var fail = _ref.fail;
    window.failAll = fail
    jsapiAVICInsideUtils().actionHandler('screenDirection', {
        screenType,
        hideStatusBar
    }, null, success, fail);
};
/**
 * getWxInvoiceList 获取发票信息
 * @param {int} success success回调
 * @param {function} success success回调
 * @param {function} fail fail回调
 * @param {function} cancel cancel回调
 */
JsApi.prototype.getWxInvoiceList = function (_ref) {
    var success = _ref.success;
    var fail = _ref.fail;
    window.failAll = fail
    jsapiAVICInsideUtils().actionHandler('getWxInvoiceList', {}, null, success, fail);
};
/**
 * 校验jsapi所处环境 
 */
JsApi.prototype.checkEnvironment = function () {
    console.log('JsApi.prototype.checkEnvironment', Object.keys(jsApiAVICInside.getI().bridge).length === 0)
    console.log('JsApi.prototype.checkEnvironment', jsapiAVICInsideUtils().getPlatform())
    if (Object.keys(jsApiAVICInside.getI().bridge).length === 0) {
        return '';
    } else if (jsapiAVICInsideUtils().getPlatform() === 'Ios') {
        return 'IOS';
    } else if (jsapiAVICInsideUtils().getPlatform() === 'Android') {
        return 'AOS';
    }
    return jsapiAVICInsideUtils().getPlatform();
};
var Chef = {
    //body 的宽高
    'bodyH': document.documentElement.clientHeight || document.body.clientHeight || window.innerHeight,
    'bodyW': document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth,
    //动态创建 style 标签添加样式
    'cssStyle': function () {
        var doc = document;
        var style = doc.createElement("style");
        if (style.styleSheet) { // IE
            style.styleSheet.cssText = arguments[0];
        } else { // w3c  
            var cssText = doc.createTextNode(arguments[0]);
            style.appendChild(cssText);
        }
        var heads = doc.getElementsByTagName("head");
        if (heads.length) {
            heads[0].appendChild(style);
        } else {
            doc.documentElement.appendChild(style);
        }
    },
    // 创建并显示遮罩层
    'createChef': function () {
        if (document.body.getElementsByClassName('Chef_opacity').length == 1) {
            document.body.removeChild(document.body.getElementsByClassName('Chef_opacity')[0]);
        }
        var div = this.create('div');
        div.style.width = this.bodyW + 'px';
        div.style.height = this.bodyH + 'px';
        div.className = 'Chef_opacity';
        document.body.appendChild(div);
    },
    //alert 框
    'alert': function (text) {
        // 显示遮罩层
        this.createChef();
        // 创建
        var alertDiv = this.create('div'),
            alertH2 = this.create('h2'),
            alertX = this.create('span'),
            alertP = this.create('p'),
            alertBDiv = this.create('div'),
            alertFirm = this.create('button');
        alertP.innerHTML = text
        alertX.innerHTML = 'X';
        alertX.className = 'Chef_X';
        // 插号的click事件 什么都不做
        alertX.onclick = function () {
            alertFirm.onclick();
        }
        // 确定按钮的click事件 什么都不做
        alertFirm.onclick = function () {
            document.getElementsByClassName('Chef_opacity')[0].style.display = 'none';
            document.body.removeChild(alertDiv);
        }
        //样式以及内容
        alertDiv.className = 'Chef_alert';
        if (arguments.length == 1) {
            document.getElementsByClassName('Chef_opacity')[0].style.background = 'rgba(0,0,0,' + arguments[
                0].shade + ')';
            alertDiv.style.top = arguments[0].offset;
            if (arguments[0].width == undefined) {
                alertDiv.style.width = '260px';
            } else {
                alertDiv.style.width = arguments[0].width;
                alertDiv.style.marginLeft = '-' + parseInt(arguments[0].width) / 2 + 'px';
            }
            arguments[0].title == undefined ? alertH2.innerHTML = '来自网页的信息' : alertH2.innerHTML = arguments[
                0].title;
            arguments[0].content == undefined ? alertP.innerHTML = '' : alertP.innerHTML = arguments[0]
                .content;
            arguments[0].firm == undefined ? alertFirm.innerHTML = '确定' : alertFirm.innerHTML = arguments[0]
                .firm;
        } else { // -- 默认提示信息
            alertH2.innerHTML = '来自网页的信息';
            alertFirm.innerHTML = '确定';
        }
        // 添加到页面
        alertBDiv.appendChild(alertFirm);
        alertH2.appendChild(alertX);
        alertDiv.appendChild(alertH2);
        alertDiv.appendChild(alertP);
        alertDiv.appendChild(alertBDiv);
        document.body.appendChild(alertDiv);
    },
    //创建
    'create': function () {
        return document.createElement(arguments[0]);
    }
};;
(function (Chef) {
    var cssString =
        '\
	            *{padding:0;margin:0;}\
	            .Chef_opacity{display:block;background:rgba(0,0,0,0.4);position:fixed;top:0;z-index:99;}\
	            .Chef_alert{position:fixed;top:100px;background:white;border-top:3px solid #FF6636;width:260px;padding-bottom:5px;left:50%;margin-left:-130px;z-index:100;font-family:Microsoft YaHei;}\
	            .Chef_alert>h2{width:90%;margin:10px auto;margin-bottom:0;font-size:18px;}\
	            .Chef_alert>p{width:90%;margin:0 auto;padding:25px 0;border-bottom:1px solid #d8d8d8;}\
	            .Chef_alert>div{width:90%;height:60px;margin:0 auto;font-size:0;text-align: center;}\
	            .Chef_alert>div>button{width:50%;height:100%;border:0;outline:0;font-size:18px;color:#FE651F;background:white;font-family:Microsoft YaHei;cursor:pointer;}\
	            .Chef_X{float:right;font-size:13px;color:grey;cursor:pointer;font-weight:normal; z-index:999999999999}\
	        ';
    Chef.cssStyle(cssString);
})(Chef);
function alertTitle(title) {
    Chef.alert({
        'title': title,
        'content': '',
        'firm': '确定',
        'offset': '100px',
        'width': '260px',
        'shade': 0.4
    });
}