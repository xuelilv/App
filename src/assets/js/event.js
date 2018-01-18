Allpay.define(function() {
    return function() {
        var _document = document;
        var startTx, startTy;
        var EVENTMAP = ['tap', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown'];

        function fireEvent(el, type, params) {
            var event = new CustomEvent(type, {
                bubbles: true,
                cancelable: true,
                detail: params
            });
            el.dispatchEvent(event);
        }

        function swipeDirection(x1, x2, y1, y2) {
            return Math.abs(x1 - x2) >=
                Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
        }

        function touch(e) {
            var touches = e.touches[0];
            startTx = touches.clientX;
            startTy = touches.clientY;
        }

        function move(e) {
            var touches = e.changedTouches[0],
                endTx = touches.clientX,
                endTy = touches.clientY,
                deltaX = startTx - endTx,
                deltaY = startTy - endTy;
            fireEvent(e.target, 'drag', {
                x: deltaX,
                y: deltaY
            });
        }

        function end(e) {
            var touches = e.changedTouches[0],
                endTx = touches.clientX,
                endTy = touches.clientY,
                deltaX = Math.abs(startTx - endTx),
                deltaY = Math.abs(startTy - endTy);
            if (deltaX < 30 && deltaY < 30) {
                fireEvent(e.target, 'tap');
            } else {
                fireEvent(e.target, 'swipe' + swipeDirection(startTx, endTx, startTy, endTy), {
                    x: deltaX,
                    y: deltaY
                });
            }
        }

        function cancel(e) {

        }

        function cancelAll(e) {
            EVENTMAP.forEach(function(type) {
                _document.removeEventListener(type, function() {}, false);
            });
        }

        _document.addEventListener('touchstart', touch, false);
        _document.addEventListener('touchmove', move, false);
        _document.addEventListener('touchend', end, false);
        _document.addEventListener('touchcancel', cancel, false);
        window.addEventListener('scroll', function() {
            cancelAll();
        }, false);
    }();
});