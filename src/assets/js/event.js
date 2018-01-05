Allpay.define(function() {
    return function() {
        var _document = document;
        var startTx, startTy;



        function touch(e) {
            var touches = e.touches[0];

            startTx = touches.clientX;
            startTy = touches.clientY;
        }

        function move(e) {

        }

        function cancel(e) {

        }

        function end() {
            var touches = e.changedTouches[0],
                endTx = touches.clientX,
                endTy = touches.clientY;

            // 在部分设备上 touch 事件比较灵敏，导致按下和松开手指时的事件坐标会出现一点点变化
            if (Math.abs(startTx - endTx) < 6 && Math.abs(startTy - endTy) < 6) {
                console.log('fire tap event');
            }
        }

        _document.addEventListener('touchstart', touch, false);
        _document.addEventListener('touchmove', move, false);
        _document.addEventListener('touchend', end, false);
        _document.addEventListener('touchcancel', cancel, false);
        _document.addEventListener('mousedown', touch, false);
        _document.addEventListener('mouseup', end, false);
        _document.addEventListener('mousemove', move, false);
    }();
});