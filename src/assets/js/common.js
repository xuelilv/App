(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define ===
        'function' && define.amd ? define(factory) : global.Allpay = factory();
}(this, function() {
    'use strict';

    // 全局事件管理器
    var eventBus = observer();

    // 工具
    var util = function() {
        return {
            isPlainObject: function(value) {
                return !!value && Object.prototype.toString.call(value) === '[object Object]';
            },
            isArray: function(value) {
                return value instanceof Array;
            },
            isNumber: function(value) {
                return !!value && Object.prototype.toString.call(value) === '[object Number]';
            },
            isString: function(value) {
                return !!value && Object.prototype.toString.call(value) === '[object String]';
            },
            isFunction: function(value) {
                return !!value && Object.prototype.toString.call(value) === '[object Function]';
            },
            toArray: function(value) {
                return Array.prototype.slice.call(value);
            },
            changeViewPort: function(content) {
                var metaEl = document.head.getElementsByTagName('meta');
                var newMetaEl = document.createElement('meta');
                newMetaEl.setAttribute('name', 'viewport');
                newMetaEl.setAttribute('content', content);
                if (metaEl.hasOwnProperty('viewport')) {
                    document.head.removeChild(metaEl.viewport);
                    document.head.appendChild(newMetaEl);
                }
            },
            formatTime: function(time, format) {
                var self = this;
                var replaceStr = function(str) {
                    return self.isString(str) ? str.replace(/-/g, "/") : new Date(str);
                };
                time = new Date(replaceStr(time));

                var weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
                var o = {
                    "M+": time.getMonth() + 1, //月份
                    "d+": time.getDate(), //日
                    "H+": time.getHours(), //小时
                    "m+": time.getMinutes(), //分
                    "s+": time.getSeconds(), //秒
                    "q+": Math.floor((time.getMonth() + 3) / 3), //季度
                    "S": time.getMilliseconds(), //毫秒
                    "w": weekDay[time.getDay()]
                };
                if (/(y+)/.test(format)) {
                    format = format.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
                }
                for (var k in o) {
                    if (new RegExp("(" + k + ")").test(format)) {
                        format = format.replace(RegExp.$1,
                            (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    }
                }
                return format;
            },
            getURLQuery: function(href) {
                var locationObj = href || location;
                var string = (locationObj.search.length > 0 ? locationObj.search.substring(1) : '');
                var args = {};
                var items = string.length > 0 ? string.split('&') : [];
                var item, key, value;
                for (var i = 0; i < items.length; i++) {
                    item = items[i].split('=');
                    key = decodeURIComponent(item[0]);
                    value = decodeURIComponent(item[1]);
                    if (key.length > 0) {
                        args[key] = value;
                    }
                }
                return args;
            },
            parseURLQueryObj2String: function(obj) {
                var query = '',
                    len = Object.keys(obj).length;
                for (var key in obj) {
                    query += '&' + key + '=' + window.encodeURIComponent(window.decodeURIComponent(obj[key]));
                }
                return len ? ('?' + query.replace(/^&/g, '')) : '';
            },
            getStyles: function(el, key) {
                var styles = document.defaultView.getComputedStyle(el, null),
                    value = styles.getPropertyValue(key) || styles[key];
                return parseInt(value) || value;
            },
            cutString: function(str, start, end, replace) {
                if (this.isString(str)) {
                    var subStr = str.substring(start, end);
                    return replace + subStr;
                } else {
                    return '';
                }
            },
            fixChangePageTit: function(title) {
                var handle = setTimeout(function() {
                    document.title = title;
                    var iframe = document.createElement('iframe');
                    iframe.style.visibility = 'hidden';
                    iframe.style.width = '1px';
                    iframe.style.height = '1px';
                    iframe.onload = function() {
                        setTimeout(function() {
                            document.body.removeChild(iframe);
                        }, 0);
                    };
                    document.body.appendChild(iframe);
                }, 0);
            },
            formatNumberByZero: function(pNumber, pLength) {
                if (pNumber.length === parseInt(pLength)) {
                    return pNumber;
                }
                var temp = 1,
                    tempZero = "";
                for (var i = 1; i < pLength; i++) {
                    temp = temp * 10;
                    if (parseInt(pNumber) < temp) {
                        tempZero = tempZero + "0";
                    }
                }
                return tempZero + pNumber;
            },
            scrollTop: function(top) {
                if (document.body.scrollTop) {
                    document.body.scrollTop = top;
                } else {
                    document.documentElement.scrollTop = top;
                }
            },
            getAbsolutePos: function(el) {
                var actualLeft = el.offsetLeft;
                var actualTop = el.offsetTop;
                var current = el.offsetParent;
                while (current !== null) {
                    actualLeft += current.offsetLeft;
                    actualTop += current.offsetTop;
                    current = current.offsetParent;
                }
                return {
                    x: actualLeft,
                    y: actualTop
                }
            },
            toFirstUpper: function(str) {
                return str.replace(/\b\w+\b/g, function(word) {
                    return word.substring(0, 1).toUpperCase() + word.substring(1);
                });
            },
            /**
             * @param nodes 树数据
             * @param predicate  过滤方法
             */
             deal: function(nodes, predicate) {
              // 如果已经没有节点了，结束递归
              if (!(nodes && nodes.length)) {
                return []
              }

              var newChildren = []
              for (const node of nodes) {
                if (predicate(node)) {
                  // 如果节点符合条件，直接加入新的节点集
                  newChildren.push(node)
                  node.childList = this.deal(node.childList, predicate)
                } else {
                  // 如果当前节点不符合条件，递归过滤子节点，
                  // 把符合条件的子节点提升上来，并入新节点集
                  newChildren.push(...this.deal(node.childList, predicate))
                }
              }
              return newChildren
            },
            setHtmlFontSize: function() {
                function setWidth() {
                    var width = document.documentElement.clientWidth;
                    var height = document.documentElement.clientHeight;
                    var new_width = 0;
                    if (width < height) {
                        new_width = width * (1 - (width / height - 375 / 590));
                    } else {
                        new_width = 375;
                    }
                    var fontSize = new_width / 37.5;
                    document.documentElement.style.fontSize = fontSize + "px";
                }

                setWidth();
                window.onresize = function() {
                    setWidth();
                };
            },
            assign: function(target, varArgs) {
                var to = Object(target);
                for (var index = 1; index < arguments.length; index++) {
                    var nextSource = arguments[index];
                    if (nextSource != null) {
                        for (var nextKey in nextSource) {
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                }
                return to;
            },
            throttle: function (func, wait, options) {
                /* options的默认值
                 *  表示首次调用返回值方法时，会马上调用func；否则仅会记录当前时刻，当第二次调用的时间间隔超过wait时，才调用func。
                 *  options.leading = true;
                 * 表示当调用方法时，未到达wait指定的时间间隔，则启动计时器延迟调用func函数，若后续在既未达到wait指定的时间间隔和func函数又未被调用的情况下调用返回值方法，则被调用请求将被丢弃。
                 *  options.trailing = true; 
                 * 注意：当options.trailing = false时，效果与上面的简单实现效果相同
                 */
                var context, args, result;
                var timeout = null;
                var previous = 0;
                if (!options) options = {};
                var later = function () {
                    previous = options.leading === false ? 0 : new Date().getTime();
                    timeout = null;
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                };
                return function () {
                    var now = new Date().getTime();
                    if (!previous && options.leading === false) previous = now;
                    // 计算剩余时间
                    var remaining = wait - (now - previous);
                    context = this;
                    args = arguments;
                    // 当到达wait指定的时间间隔，则调用func函数
                    if (remaining <= 0 || remaining > wait) {
                        if (timeout) {
                            clearTimeout(timeout);
                            timeout = null;
                        }
                        previous = now;
                        result = func.apply(context, args);
                        if (!timeout) context = args = null;
                    } else if (!timeout && options.trailing !== false) {
                        // options.trailing=true时，延时执行func函数
                        timeout = setTimeout(later, remaining);
                    }
                    return result;
                };
            },
            debounce: function (func, wait, immediate) {
                // immediate默认为false
                var timeout, args, context, timestamp, result;

                var later = function () {
                    // 当wait指定的时间间隔期间多次调用debounce返回的函数，则会不断更新timestamp的值，导致last < wait && last >= 0一直为true，从而不断启动新的计时器延时执行func
                    var last = new Date().getTime() - timestamp;

                    if (last < wait && last >= 0) {
                        timeout = setTimeout(later, wait - last);
                    } else {
                        timeout = null;
                        if (!immediate) {
                            result = func.apply(context, args);
                            if (!timeout) context = args = null;
                        }
                    }
                };

                return function () {
                    context = this;
                    args = arguments;
                    timestamp = new Date().getTime();
                    // 第一次调用该方法时，且immediate为true，则调用func函数
                    var callNow = immediate && !timeout;
                    // 在wait指定的时间间隔内首次调用该方法，则启动计时器定时调用func函数
                    if (!timeout) timeout = setTimeout(later, wait);
                    if (callNow) {
                        result = func.apply(context, args);
                        context = args = null;
                    }

                    return result;
                };
            },
            /**  
             * 将以base64的图片url数据转换为Blob  
             * @param urlData  
             * 用url方式表示的base64图片数据  
             */
            convertBase64UrlToBlob: function (urlData) {
                var bytes = window.atob(urlData.split(',')[1]); //去掉url的头，并转换为byte  

                //处理异常,将ascii码小于0的转换为大于0  
                var ab = new ArrayBuffer(bytes.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < bytes.length; i++) {
                    ia[i] = bytes.charCodeAt(i);
                }

                return new Blob([ab], {
                    type: 'image/png'
                });
            },
            fixClassList() {
                if (!("classList" in document.documentElement)) {
                    Object.defineProperty(HTMLElement.prototype, 'classList', {
                        get: function () {
                            var self = this;

                            function update(fn) {
                                return function (value) {
                                    var classes = self.className.split(/\s+/g),
                                        index = classes.indexOf(value);

                                    fn(classes, index, value);
                                    self.className = classes.join(" ");
                                }
                            }

                            return {
                                add: update(function (classes, index, value) {
                                    if (!~index) classes.push(value);
                                }),

                                remove: update(function (classes, index) {
                                    if (~index) classes.splice(index, 1);
                                }),

                                toggle: update(function (classes, index, value) {
                                    if (~index) {
                                        classes.splice(index, 1);
                                    } else {
                                        classes.push(value);
                                    }
                                }),

                                contains: function (value) {
                                    return !!~self.className.split(/\s+/g).indexOf(value);
                                },

                                item: function (i) {
                                    return self.className.split(/\s+/g)[i] || null;
                                }
                            };
                        }
                    });
                }
            },
            fireEvent(node, eventName) {
                // Make sure we use the ownerDocument from the provided node to avoid cross-window problems
                var doc, event;
                if (node.ownerDocument) {
                    doc = node.ownerDocument;
                } else if (node.nodeType == 9) {
                    // the node may be the document itself, nodeType 9 = DOCUMENT_NODE
                    doc = node;
                } else {
                    throw new Error("Invalid node passed to fireEvent: " + node.id);
                }

                if (node.dispatchEvent) {
                    // Gecko-style approach (now the standard) takes more work
                    var eventClass = "";

                    // Different events have different event classes.
                    // If this switch statement can't map an eventName to an eventClass,
                    // the event firing is going to fail.
                    switch (eventName) {
                        case "click": // Dispatching of 'click' appears to not work correctly in Safari. Use 'mousedown' or 'mouseup' instead.
                        case "mousedown":
                        case "mouseup":
                            eventClass = "MouseEvents";
                            break;

                        case "focus":
                        case "change":
                        case "blur":
                        case "select":
                            eventClass = "HTMLEvents";
                            break;

                        default:
                            eventClass = "HTMLEvents";
                            break;
                    }
                    event = doc.createEvent(eventClass);

                    var bubbles = eventName == "change" ? false : true;
                    event.initEvent(eventName, bubbles, true); // All events created as bubbling and cancelable.

                    event.synthetic = true; // allow detection of synthetic events
                    // The second parameter says go ahead with the default action
                    node.dispatchEvent(event, true);
                    return event;
                } else if (node.fireEvent) {
                    // IE-old school style
                    event = doc.createEventObject();
                    event.synthetic = true; // allow detection of synthetic events
                    node.fireEvent("on" + eventName, event);
                    return event;
                }
            },
            /**
             * 合并两数组并去重
             * @param arr1
             * @param arr2
             * @returns {*|string|Array.<T>|{options, browsertest, dist, rhino, rhinolessc}}
             */
            concatArr: function(arr1, arr2) {
                var arr = arr1.concat();
                for (var i = 0; i < arr2.length; i++) {
                    arr.indexOf(arr2[i]) === -1 ? arr.push(arr2[i]) : 0;
                }
                return arr;
            },
            /**
             * 判断数组中是否存在重复的元素，并返回重复的元素
             * @param arr
             * @returns {boolean}
             */
            isRepeatInArr: function(arr) {
                var hash = {},
                    isRepeat = false,
                    repeatArr = [];
                for (var i in arr) {
                    if (hash[arr[i]]) {
                        isRepeat = true;
                        repeatArr.push(arr[i]);
                    }
                    hash[arr[i]] = true;
                }
                return isRepeat ? repeatArr : false;
            },
            /**
             * 获取两数组非重复部分
             * @param arr1
             * @param arr2
             * @returns {Array}
             */
            getNotRepeatInArr: function(arr1, arr2) {
                var arr = [],
                    copyArr1 = arr1.concat();
                for (var i = 0; i < arr2.length; i++) {
                    copyArr1.indexOf(arr2[i]) === -1 ? arr.push(arr2[i]) : 0;
                }
                return arr;
            },
            /**
             * 获取当前节点的所有兄弟节点
             * @param elm
             * @returns {Array}
             */
            siblings: function(elm) {
                var a = [];
                var p = elm.parentNode.children;
                for (var i = 0, pl = p.length; i < pl; i++) {
                    if (p[i] !== elm) {
                        a.push(p[i]);
                    }
                }
                return a;
            },
            /**
             * [A-Z]编码
             * example:A....Z,2A....2Z
             * @param val
             * @returns {string}
             */
            getCharCode: function(val) {
                var firstStr = parseInt(val / 26) || "";
                var sendStr = String.fromCharCode(65 + val - 26 * firstStr) || "";
                firstStr = firstStr ? firstStr + 1 : firstStr;
                var str = firstStr + sendStr;
                return str;
            },
            /**
             * 根据val获取key,浅遍历
             * @param obj
             * @param val
             * @returns {string}
             */
            findKeyInObj: function(obj, val) {
                var value = '';
                for (var key in obj) {
                    if (obj[key] == val) {
                        value = key;
                    }
                }
                return value;
            },
            /**
             * android终端
             * @returns {boolean}
             */
            isAndroid: function() {
                var u = navigator.userAgent;
                return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
            },
            /**
             * ios终端
             * @returns {boolean}
             */
            isIos: function() {
                var u = navigator.userAgent;
                return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            },
            /**
             * 格式化设备名称
             * @param {Object} result
             */
            setDeviceName: function(result) {
                var homemadeId = '001',
                    deviceName = result.deviceName,
                    deviceMark = result.deviceMark || '',
                    deviceMac = '';
                if (result.hasOwnProperty('homemadeId') && result.homemadeId !== null) {
                    homemadeId = this.formatNumberByZero(parseInt(result.homemadeId) + '', 3);
                }

                deviceName = deviceName ? deviceName.substr(0, 3) : '';

                if (this.isString(result.deviceMac)) {
                    deviceMac = result.deviceMac.substr(result.deviceMac.length - 5, 5);
                }

                return {
                    deviceMark: deviceMark,
                    homemadeId: homemadeId,
                    deviceName: deviceName,
                    deviceMac: deviceMac
                };
            },
            hidePhone: function(phoneStr) {
                phoneStr = phoneStr + '';
                if (phoneStr.length) {
                    return phoneStr.substr(0, 3) + '*****' + phoneStr.substr(-4, 4);
                }
                return phoneStr;
            },
            hideName: function(str) {
                str = str + '';
                if (str.length) {
                    return str.substr(0, 1) + '**' + str.substr(-1, 1);
                }
                return str;
            },
            hideBank: function(str) {
                str = str + '';
                if (str.length) {
                    return str.substr(0, 4) + '**********' + str.substr(-4, 4);
                }
                return str;
            },
            ParseUrl: ParseUrl,
            WorkTime: WorkTime,
            extend: extend
        };
    }();

    // 兼容本地存储
    function localStorage() {
        var local = window.localStorage;
        var Cookie = {
            cookieAPI: {
                get: function(name) {
                    var nameEQ = name + "=";
                    var ca = document.cookie.split(';'); //把cookie分割成组
                    for (var i = 0; i < ca.length; i++) {
                        var c = ca[i]; //取得字符串
                        if (c.charAt(0) == ' ') {
                            c = c.substring(1, c.length);
                        }
                        if (c.indexOf(nameEQ) == 0) { //如果含有我们要的name
                            return decodeURI(c.substring(nameEQ.length, c.length)); //解码并截取我们要值
                        }
                    }
                    return false;
                },
                set: function(name, value, options) {
                    if (util.isPlainObject(name)) {
                        for (var k in name) {
                            if (name.hasOwnProperty(k)) {
                                this.set(k, name[k], value);
                            }
                        }
                    } else {
                        var opt = util.isPlainObject(options) ? options : {
                                expires: options
                            },
                            expires = (opt.expires == undefined) ? '' : opt.expires,
                            path = opt.path !== undefined ? ';path=' + opt.path : ';path=/',
                            domain = opt.domain ? ';domain=' + opt.domain : '',
                            secure = opt.secure ? ';secure' : '';

                        //过期时间
                        if (util.isString(expires) && expires !== '') {
                            expires = new Date(expires);
                        } else if (util.isNumber(expires)) {
                            expires = new Date(+new Date + 1000 * 60 * 60 * 24 *
                                expires);
                        }
                        if (expires !== '' && 'toGMTString' in expires) {
                            expires = ';expires=' + expires.toGMTString();
                        }

                        document.cookie = name + "=" + encodeURI(value) + expires + path + domain + secure; //转码并赋值
                    }
                },
                remove: function(names) {
                    names = util.isArray(names) ? names : util.toArray(arguments);
                    for (var i = 0, l = names.length; i < l; i++) {
                        this.set(names[i], '', -1);
                    }
                    return names;
                },
                clear: function() {
                    return this.remove(Cookie.getKeys(this.all()));
                },
                all: function() {
                    if (document.cookie === '') {
                        return {};
                    }
                    var cookies = document.cookie.split('; '),
                        result = {};
                    for (var i = 0, l = cookies.length; i < l; i++) {
                        var item = cookies[i].split('=');
                        result[decodeURI(item[0])] = decodeURI(item[1]);
                    }
                    return result;
                }
            },
            getKeys: Object.names || function(obj) {
                var names = [];
                for (var name in obj) {
                    if (obj.hasOwnProperty(name)) {
                        names.push(name);
                    }
                }
                return names;
            }

        };

        var cookieAPI = Cookie.cookieAPI;
        return {
            setItem: function(key, val) {
                local ? local.setItem(key, val) : cookieAPI.set(key, val);
            },
            getItem: function(key) {
                return local ? local.getItem(key) : cookieAPI.get(key);
            },
            removeItem: function(key) {
                local ? local.removeItem(key) : cookieAPI.remove([key]);
            },
            clear: function() {
                local ? local.clear() : cookieAPI.clear();
            }
        }
    }

    // 倒计时
    function WorkTime(options) {
        this.work = undefined;
        this.time = 60;
        if (options) {
            this.time = options.time || 60;
        }
    }

    WorkTime.prototype.addZero = function(t) {
        if (t < 10 && t >= 0) {
            t = "0" + t;
        }
        return t;
    };
    WorkTime.prototype.formatTime = function(tot) {
        var m = this.addZero(parseInt(tot / 60, 10));
        var s = this.addZero(tot % 60);
        return (m + ":" + s);
    };
    WorkTime.prototype.startWorker = function(startingCall, endCall) {
        this.fixWork(startingCall, endCall);
    };
    WorkTime.prototype.stopWorker = function(endCall) {
        endCall();
    };
    WorkTime.prototype.fixWork = function(startingCall, endCall) {
        var time = this.time,
            timeinter;
        timeinter = setInterval(function() {
            time--;
            startingCall(time);
            if (time < 1) {
                clearInterval(timeinter);
                endCall();
            }
        }, 1000);
    };

    // 字符串验证
    function checkString() {
        return {
            /**
             * 验证字符串是否为正整数
             * @param s
             * @returns {boolean}
             */
            integer: function(s) {
                var re = /^[0-9]+$/g;
                return s.search(re) !== -1;
            },

            /**
             * 验证字符串是否为正数
             * @param s
             * @returns {boolean}
             */
            isNumber: function(s) {
                var re = /^[0-9]+.?[0-9]*$/g;
                return re.test(s);
            },

            /**
             * 验证手机号码是否正确
             * @param s
             * @returns {boolean}
             */
            checkMobile: function(s) {
                var reg = /^[1][3|8|4|5|7][0-9]{9}$/g;
                return reg.test(s);
            },

            /**
             * 验证身份证
             * @param s
             * @returns {boolean}
             */
            isCardNo: function(s) {
                var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/g;
                return reg.test(s);
            },

            /**
             * 验证金额
             * @param s
             * @returns {boolean}
             */
            isAmount: function(s) {
                var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/g;
                return reg.test(s + '');
            },
            /**
             * 验证字符串是否E-Mail
             * @param str
             * @returns {boolean}
             */
            isEmail: function(str) {
                var myReg = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
                return myReg.test(str);
            },
            /**
             * 验证字符串是否只由汉字、字母、数字组成
             * @param s
             * @returns {boolean}
             */
            isChinaOrNumbOrLett: function(s) {
                var reg = /^[0-9a-zA-Z\u4e00-\u9fa5]+$/;
                return reg.test(s);
            }
        };
    }

    /**
     * 将urlStr 字符串转换为url对象
     * @param urlStr
     */
    function ParseUrl(urlStr) {
        var url = document.createElement('a');
        url.href = urlStr;
        this.url = url;
    }

    ParseUrl.prototype.addQuery = function(key, value) {
        var query = util.getURLQuery(this.url);
        var queryStr = '';
        if (!query.hasOwnProperty(key)) {
            query[key] = value;
        }

        for (var k in query) {
            queryStr += ('&' + k + '=' + query[k]);
        }

        this.url.search = queryStr.replace(/^&/g, '');
    };

    /**
     * 简单下载CSS模块
     * @param href
     * @param callback
     */
    function cssLoad(href, callback) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = callback;
        document.head.appendChild(link);
    }

    /**
     * 简单路由
     * @constructor
     */
    function Router() {
        var self = this;
        this.routers = {}; // 存储路由
        this.before = null;
        this.after = null;
        this.getUrl();
        window.addEventListener('load', function() {
            self.change();
        }, false);
        window.addEventListener('hashchange', function() {
            self.change();
        }, false);
    }
    Router.prototype.getUrl = function() {
        var path = window.location.hash.replace(/^#/g, '');
        var pathArr = path.split('?');
        this.url = {
            pathname: pathArr[0].replace(/[\s*]|^\/|\/$/g, ''),
            query: util.getURLQuery({ search: pathArr[1] ? ('?' + pathArr[1]) : '' })
        };
    };
    Router.prototype.map = function(pathObj) {
        if (!pathObj) return;
        for (var key in pathObj) {
            var path = key.replace(/[\s*|^\/|$\/]/g, '');
            if (util.isFunction(pathObj[key])) {
                this.routers[path] = {
                    callback: pathObj[key]
                };
            }
        }
    };
    Router.prototype.change = function() {
        var self = this;
        this.getUrl();
        if (this.routers[this.url.pathname]) {
            this.before ? this.before({
                to: this.url,
                next: function() {
                    self.routers[self.url.pathname].callback.call(self, self.url);
                }
            }) : self.routers[self.url.pathname].callback.call(self, self.url);
        }
    };
    Router.prototype.beforeEach = function(callback) {
        if (util.isFunction(callback)) {
            this.before = callback;
        }
    };
    Router.prototype.afterEach = function(callback) {
        if (util.isFunction(callback)) {
            this.after = callback;
        }
    };

    /**
     * ajax
     * @param  {Object} args {url:'/test',type:'POST',data:'',headers:'',success:callBack,error:callBack}
     * @return {[type]}      [description]
     */
    function ajax(args) {
        var xhr = function() {
            if (typeof XMLHttpRequest != "undefined") {
                xhr = function() {
                    return new XMLHttpRequest();
                };
            } else if (typeof ActiveXObject != "undefined") {
                xhr = function() {
                    return new ActiveXObject("Microsoft.XMLHTTP");
                };
            } else {
                xhr = function() {
                    throw new Error("NOT SUPPORT");
                };
            }
            return xhr();
        };
        if (typeof args == "object") {
            var init = xhr();
            var successBack = args.success;
            var errorBack = args.error;
            var setHeaders = function() {
                if (args.hasOwnProperty('headers')) {
                    for (var i in args.headers) {
                        init.setRequestHeader(i, args.headers[i]);
                    }
                }
            };
            init.onreadystatechange = function() {
                if (init.readyState == 4) {
                    if ((init.status >= 200 && init.status < 300) || init.status === 304 || init.status === 0) {
                        return successBack(init.responseText, init, args);
                    } else {
                        return errorBack(init.status, init, args);
                    }
                }
            };
            init.open(args.type, args.url, args.async);
            if (args.type === "POST") {
                setHeaders();
                init.send(args.data);
            } else {
                init.send(null);
            }

        }
    }

    var http = {
        root: '',
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        intercept: function(callback) {
            eventBus.subscribe('httpIntercept', callback);
        }
    };
    ['post', 'get'].forEach(function(method) {
        http[method] = function(url, args) {
            var params = arguments;
            var body = null,
                success, error, options;
            if (util.isPlainObject(params[1])) {
                body = params[1];
                success = params[2];
                error = params[3];
                options = params[4];
            } else {
                success = params[1];
                error = params[2];
                options = params[3];
            }
            var args = util.assign({
                url: http.root + url,
                method: method.toUpperCase(),
                data: body,
                async: true,
                header: http.header,
                success: success || function() {},
                error: error || function() {}
            }, options);
            eventBus.subscriber['httpIntercept'] && eventBus.update('httpIntercept', args);
            ajax(args);
        }
    });

    /**
     * 模拟继承
     * @param  {[type]} subClass   [description]
     * @param  {[type]} superClass [description]
     * @return {[type]}            [description]
     */
    function extend(subClass, superClass) {
        var F = function() {};
        F.prototype = superClass.prototype;
        subClass.prototype = new F;
        subClass.constructor = subClass;
    }

    /**
     * JS动画 兼容写法
     * 
     */
    function fixRequestAnimationFrame() {
        var lastTime = 0;
        var prefixes = 'webkit moz ms o'.split(' ');
        var requestAnimationFrame = window.requestAnimationFrame;
        var cancelAnimationFrame = window.cancelAnimationFrame;
        var prefix;
        for (var i = 0; i < prefixes.length; i++) {
            if (requestAnimationFrame && cancelAnimationFrame) {
                break;
            }
            prefix = prefixes[i];
            requestAnimationFrame = requestAnimationFrame || window[prefix + 'RequestAnimationFrame'];
            cancelAnimationFrame = cancelAnimationFrame || window[prefix + 'CancelAnimationFrame'] || window[prefix + 'CancelRequestAnimationFrame'];
        }
        if (!requestAnimationFrame || !cancelAnimationFrame) {
            requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
            cancelAnimationFrame = function(id) {
                window.clearTimeout(id);
            };
        }
        window.requestAnimationFrame = requestAnimationFrame;
        window.cancelAnimationFrame = cancelAnimationFrame;
    }

    /**
     * 观察者模式
     * @return {Object} subscriber 订阅者 subscribe 订阅事件 update 发布事件
     */
    function observer() {
        return {
            subscriber: [],
            subscribe: function(type, fn) {
                if (typeof this.subscriber[type] === "undefined") {
                    this.subscriber[type] = [];
                }
                this.subscriber[type].push(fn);
            },
            delSubscribe: function(type, fn) {
                this.subscriber[type] = this.subscriber[type].filter(function(val) {
                    if (val !== fn) {
                        return val;
                    }
                });
            },
            update: function(type, arg, thisObj) {
                var scope = thisObj || window;
                this.subscriber[type].forEach(function(val) {
                    val.call(scope, arg);
                });
            }
        }
    }

    /**
     * 简单模块加载器 支持.js/.css/.html
     */
    var module = {
        _modules: {},
        _configs: {
            // 用于拼接相对路径
            basePath: (function(path) {
                var host = location.origin || location.host;
                if (path.charAt(path.length - 1) === '/') {
                    path = path.substr(0, path.length - 1);
                }
                return path.substr(path.indexOf(host) + host.length + 1);
            })(location.href),
            // 用于拼接相对根路径
            host: location.protocol + '//' + location.host + '/'
        }
    };

    module.hasModule = function(_uri) {
        // 判断是否已有该模块，不论加载中或已加载好
        return module._modules.hasOwnProperty(_uri);
    };
    module.isModuleLoaded = function(_uri) {
        // 判断该模块是否已加载好
        return !!module._modules[_uri];
    };
    module.pushModule = function(_uri) {
        // 新模块还未加载完成，表示加载中；防止重复加载
        if (!module._modules.hasOwnProperty(_uri)) {
            module._modules[_uri] = null;
        }
    };
    module.installModule = function(_uri, mod) {
        module._modules[_uri] = mod;
    };
    module.load = function(uris) {
        var i, nsc;
        for (i = 0; i < uris.length; i++) {
            if (!module.hasModule(uris[i])) {
                module.pushModule(uris[i]);
                var isCss = (/.css$/g).test(uris[i]),
                    isJs = (/.js$/g).test(uris[i]),
                    isHtml = (/.html$/g).test(uris[i]);
                // 开始加载
                if (isCss) {
                    cssLoad(uris[i]);
                } else if (isJs) {
                    var nsc = document.createElement('script');
                    nsc.src = uris[i];
                    nsc.setAttribute('async', 'async');
                    document.body.appendChild(nsc);
                } else if (isHtml) {
                    http.get(uris[i], function(res, xhr, args) {
                        module._modules[args.url] = res;
                        module.proxy.emit(args.url);
                    });
                }

            }
        }
    };

    module.resolvePath = function(path) {
        // 返回绝对路径
        var res = '',
            paths = [],
            resPaths;
        if (path.match(/.*:\/\/.*/)) {
            // 绝对路径
            res = path.match(/.*:\/\/.*?\//)[0]; // 协议+域名
            path = path.substr(res.length);
        } else if (path.charAt(0) === '/') {
            // 相对根路径 /开头
            res = module._configs.host;
            path = path.substr(1);
        } else {
            // 相对路径 ./或../开头或直接文件名
            res = module._configs.host;
            resPaths = module._configs.basePath.split('/');
        }
        resPaths = resPaths || [];
        paths = path.split('/');
        for (var i = 0; i < paths.length; i++) {
            if (paths[i] === '..') {
                resPaths.pop();
            } else if (paths[i] === '.') {
                // do nothing
            } else {
                resPaths.push(paths[i]);
            }
        }
        res += resPaths.join('/');
        return res;
    };

    var define = module.define = function(dependPaths, fac) {
        var _uri = document.currentScript.src;
        if (module.isModuleLoaded(_uri)) {
            return;
        }
        var factory, depPaths, uris = [];
        if (arguments.length === 1) {
            factory = arguments[0];
            // 挂载到模块组中
            module.installModule(_uri, factory());
            // 告诉proxy该模块已装载好
            module.proxy.emit(_uri);
        } else {
            // 有依赖的情况
            factory = arguments[1];
            // 装载完成的回调函数
            module.use(arguments[0], function() {
                module.installModule(_uri, factory.apply(null, arguments));
                module.proxy.emit(_uri);
            });
        }
    };

    module.use = function(paths, callback) {
        if (!Array.isArray(paths)) {
            paths = [paths];
        }
        var uris = [],
            i;
        for (i = 0; i < paths.length; i++) {
            uris.push(module.resolvePath(paths[i]));
        }
        // 先注册事件，再加载
        module.proxy.watch(uris, callback);
        module.load(uris);
    };

    module.proxy = function() {
        var proxy = {};
        var taskId = 0;
        var taskList = {};

        var execute = function(task) {
            var uris = task.uris,
                callback = task.callback;
            for (var i = 0, arr = []; i < uris.length; i++) {
                arr.push(module._modules[uris[i]]);
            }
            callback.apply(null, arr);
        };
        var deal_loaded = function(_uri) {
            var i, k, task, sum;
            // 当一个模块加载完成时，遍历当前任务栈
            for (k in taskList) {
                if (!taskList.hasOwnProperty(k)) {
                    continue;
                }
                task = taskList[k];
                if (task.uris.indexOf(_uri) > -1) {
                    // 查看这个任务中的模块是否都已加载好
                    for (i = 0, sum = 0; i < task.uris.length; i++) {
                        if (module.isModuleLoaded(task.uris[i])) {
                            sum++;
                        }
                    }
                    if (sum === task.uris.length) {
                        // 都加载完成 删除任务
                        delete(taskList[k]);
                        execute(task);
                    }
                }
            }
        };

        proxy.watch = function(uris, callback) {
            // 先检查一遍是否都加载好了
            for (var i = 0, sum = 0; i < uris.length; i++) {
                if (module.isModuleLoaded(uris[i])) {
                    sum++;
                }
            }
            if (sum === uris.length) {
                execute({
                    uris: uris,
                    callback: callback
                });
            } else {
                // 订阅新加载任务
                var task = {
                    uris: uris,
                    callback: callback
                };
                taskList['' + taskId] = task;
                taskId++;
            }
        };
        proxy.emit = function(_uri) {
            deal_loaded(_uri);
        };
        return proxy;
    }();

    /**
     * Page 类
     */
    function Page(options) {
        this.el = options.el ? document.querySelector(options.el) : null; // 挂载元素
        this.template = options.template || '';
        this.el && (this.el.innerHTML = this.template);
    }

    var $loading = document.getElementById('DialogLoading');
    util.setHtmlFontSize();

    // 对外接口
    return {
        util: util,
        checkString: checkString(),
        localStorage: localStorage(),
        cssLoad: cssLoad,
        Router: Router,
        ajax: ajax,
        fixRequestAnimationFrame: fixRequestAnimationFrame,
        observer: observer,
        define: define,
        use: module.use,
        http: http,
        Page: function(options) {
            return new Page(options);
        },
        loading: function() {
            $loading.show();
        },
        closeLoading: function() {
            $loading.hide();
        }
    };
}));
