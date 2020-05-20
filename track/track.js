"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var Track = /** @class */ (function () {
    function Track(options) {
        // 浏览器指纹
        this.uuid = '';
        // 当前环境
        this.env = '';
        // 用于上报的路径
        this.trackUrl = '';
        // 该项目埋点的基本数据
        this.commonData = {};
        // 是否不上报
        this.silence = false;
        this.env = options.env;
        this.trackUrl = options.trackUrl;
        this.commonData = options.commonData;
        this.silence = options.silence || false;
    }
    // 发起发送请求
    Track.prototype.request = function (data) {
        this.silence && console.log('不上报哟');
        console.log('send data', data);
    };
    // 手动埋点
    Track.prototype.send = function (toSendData) {
        var _this = this;
        var url = this.trackUrl;
        var data = __assign(__assign({}, this.commonData), toSendData);
        return this.$nextTick(function () {
            _this.request({ data: data, url: url });
        });
    };
    // 异步，将来可兼容 Promise
    Track.prototype.$nextTick = function (callback, timeout) {
        if (timeout === void 0) { timeout = 4; }
        return setTimeout(callback, timeout);
    };
    return Track;
}());
exports["default"] = Track;
