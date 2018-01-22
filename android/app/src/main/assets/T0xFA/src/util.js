const Dialog = new MyDialog(); 
export class Util {

    static isPlainObject(value) {
        return !!value && Object.prototype.toString.call(value) === '[object Object]';
    }

    static isArray(value) {
        return value instanceof Array;
    }

    static isNumber(value) {
        return !!value && Object.prototype.toString.call(value) === '[object Number]';
    }

    static isString(value) {
        return !!value && Object.prototype.toString.call(value) === '[object String]';
    }

    static toArray(value) {
        return Array.prototype.slice.call(value);
    }

    static getStyles(el, key) {
        var styles = document.defaultView.getComputedStyle(el, null);
        return parseInt(styles.getPropertyValue(key) || styles[key], 10);
    }

    static formatTime(time, format) {
        var time = new Date(time);
        var o = {
            "M+": time.getMonth() + 1, //月份 
            "d+": time.getDate(), //日 
            "H+": time.getHours(), //小时 
            "m+": time.getMinutes(), //分 
            "s+": time.getSeconds(), //秒 
            "q+": Math.floor((time.getMonth() + 3) / 3), //季度 
            "S": time.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return format;
    }

    static cutString(str, start, end, replace) {
        if (Util.isString(str)) {
            var subStr = str.substring(start, end);
            return replace + subStr;
        } else {
            return '';
        }
    }

    static showAlert(calssName, content){
        Dialog.dialog("confirm", {
            'class': calssName,
            'content': content
        });
    } 

    static showConfirm(content,callbackCancel,callbackConfirm){
            Dialog.dialog("confirm", {
                "class": "confirmDia animated bounceIn",
                "content": content,
                "btn":["取消","确定"],
                callback:function(id){
                    if(id == 0){
                        callbackCancel();
                    }else if(id == 1){
                        callbackConfirm();
                    }
                }
            });
        } 
    }
