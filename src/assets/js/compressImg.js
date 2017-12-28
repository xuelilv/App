(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        global.CompressImg = factory();
}(this, function() {
    'use strict';
    var MAX_IMAGE_WIDTH = 2000;

    function dataURItoBlob(dataURI) {
        // convert base64 to raw binary data held in a string
        var byteString, mimestring;
        if (dataURI.split(',')[0].indexOf('base64') !== -1) {
            byteString = atob(dataURI.split(',')[1]);
        } else {
            byteString = decodeURI(dataURI.split(',')[1]);
        }

        mimestring = dataURI.split(',')[0].split(':')[1].split(';')[0]

        var content = [];
        for (var i = 0; i < byteString.length; i++) {
            content[i] = byteString.charCodeAt(i)
        }

        return new Blob([new Uint8Array(content)], { type: mimestring });
    }

    function imgScale(src, scale, cbk) {
        if (!src) return cbk(false);
        var _canvas = document.createElement('canvas');
        var tImg = new Image();
        tImg.onload = function() {
            var cw = tImg.width;
            var ch = tImg.height;
            var w = tImg.width;
            var h = tImg.height;
            _canvas.width = w;
            _canvas.height = h;
            if (cw > MAX_IMAGE_WIDTH && cw > ch) {
                w = MAX_IMAGE_WIDTH;
                h = (MAX_IMAGE_WIDTH * ch) / cw;
                _canvas.width = w;
                _canvas.height = h;
            }
            if (ch > MAX_IMAGE_WIDTH && ch > cw) {
                h = MAX_IMAGE_WIDTH;
                w = (MAX_IMAGE_WIDTH * cw) / ch;
                _canvas.width = w;
                _canvas.height = h;

            }

            var _context = _canvas.getContext('2d');
            _context.drawImage(tImg, 0, 0, w, h);
            var type = 'image/jpeg';
            src = _canvas.toDataURL(type, scale);
            var blob = dataURItoBlob(src);
            cbk(blob)
        };
        tImg.src = src

    }

    function CompressImg(files, opt, cbk) {
        opt = opt || {};
        var scale = opt.scale;
        if (!scale || 1 === scale) return cbk(files)
        var files_count = files.length,
            ret = [];

        for (var i = 0, j = files.length; i < j; i++) {
            var fReader = new FileReader();
            fReader.onload = function(e) {
                var result = e.target.result;
                imgScale(result, scale, function(file) {
                    file && ret.push(file);
                    files_count--;
                    if (files_count <= 0) cbk && cbk(ret);
                });
            };
            fReader.readAsDataURL(files[i]);
        }
    }

    return CompressImg;
}));