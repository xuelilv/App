!function (globals, document) {
    var version = '0.5';
    var storagePrefix = "local_";
    globals.LocalJs = {
        require: function (key,file, callback) {
           // localStorage.removeItem(storagePrefix + key);
            var self = this;
            var loadSc = function(){
                document.write('<script src="' + file + '" type="text/javascript"><\/script>');
                setTimeout(function () {
                    self._loadJs(key,file, callback)
                }, 3000);
            };
            var getLoc = localStorage.getItem(storagePrefix + key);
            if (!getLoc) {
                loadSc();
            } else {
                var loc = JSON.parse(getLoc);
                if(loc.v == version){
                    this._reject(loc.content, callback);
                }else{
                    loadSc();
                }
            }
        },
        _loadJs: function (key,file, callback) {
            if (!file) {
                return false
            }
            var self = this;
            var xhr = new XMLHttpRequest;
            xhr.open("GET", file,true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var json = {"v":version,"content":xhr.responseText};
                        localStorage.setItem(storagePrefix + key,JSON.stringify(json));
                    } else {}
                }
            };
            xhr.send()
        },
        _reject: function (data, callback) {
            var newF = new Function(data);
            newF();
            callback && callback();
        },
        isSupport: function () {
            return window.localStorage
        }
    }
}(window, document);
!function () {
    LocalJs.require('jq','./lib/base.min.js', function () {

    });
}();
