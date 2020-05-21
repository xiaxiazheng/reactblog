(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _track_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./track.js */ \"./track.js\");\n/* harmony import */ var _track_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_track_js__WEBPACK_IMPORTED_MODULE_0__);\n// window.onload = function () {\r\n  // const Track = require(\"./track\");\r\n  \r\n\r\n  // 区分环境\r\n  const getEnv = () => {\r\n    if (true) {\r\n      return \"development\";\r\n    } else {}\r\n  };\r\n\r\n  console.log(\"fdlkjhflds\");\r\n  const env = getEnv();\r\n\r\n  const track = new _track_js__WEBPACK_IMPORTED_MODULE_0__({\r\n    env: env,\r\n    trackUrl: \"www.xxx.com/track\",\r\n    commonData: {\r\n      trackVersion: \"0.0.1\",\r\n    },\r\n    silence: env === \"development\",\r\n  });\r\n\r\n  window.track = track;\r\n  console.log(\"track\", track);\r\n// };\r\n\r\n// export default track;\r\n\n\n//# sourceURL=webpack:///./index.js?");

/***/ }),

/***/ "./track.js":
/*!******************!*\
  !*** ./track.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __assign = (this && this.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\nexports.__esModule = true;\r\nvar Track = /** @class */ (function () {\r\n    function Track(options) {\r\n        // 浏览器指纹\r\n        this.uuid = '';\r\n        // 当前环境\r\n        this.env = '';\r\n        // 用于上报的路径\r\n        this.trackUrl = '';\r\n        // 该项目埋点的基本数据\r\n        this.commonData = {};\r\n        // 是否不上报\r\n        this.silence = false;\r\n        this.env = options.env;\r\n        this.trackUrl = options.trackUrl;\r\n        this.commonData = options.commonData;\r\n        this.silence = options.silence || false;\r\n    }\r\n    // 发起发送请求\r\n    Track.prototype.request = function (data) {\r\n        this.silence && console.log('不上报哟');\r\n        console.log('send data', data);\r\n    };\r\n    // 手动埋点\r\n    Track.prototype.send = function (toSendData) {\r\n        var _this = this;\r\n        var url = this.trackUrl;\r\n        var data = __assign(__assign({}, this.commonData), toSendData);\r\n        return this.$nextTick(function () {\r\n            _this.request({ data: data, url: url });\r\n        });\r\n    };\r\n    // 异步，将来可兼容 Promise\r\n    Track.prototype.$nextTick = function (callback, timeout) {\r\n        if (timeout === void 0) { timeout = 4; }\r\n        return setTimeout(callback, timeout);\r\n    };\r\n    return Track;\r\n}());\r\nexports[\"default\"] = Track;\r\n\n\n//# sourceURL=webpack:///./track.js?");

/***/ })

/******/ });
});