Allpay.define(function() {
    var eventBus = Allpay.observer();
    var slide = function(options) {
        if (!options.el) return;
        var self = this;
        this.auto = options.auto || false;
        this.autoTime = options.time || 1500;
        this.el = document.querySelector(options.el);
        this.elWidth = Allpay.util.getStyles(this.el, 'width');
        this.elHeight = Allpay.util.getStyles(this.el, 'height');
        this.slides = this.el.querySelectorAll('.slide-item');
        this.bullets = this.el.querySelectorAll('.slide-pagination-bullet');
        [].forEach.call(this.slides, function(el) {
            el.style.width = self.elWidth + 'px';
        });
        this.animate();
    };

    slide.prototype.animate = function() {
        var self = this;
        var slidesCount = this.slides.length,
            i = 0,
            timer,
            dx = 0,
            $wrapper = this.el.querySelector('.slide-wrapper');
        var transitionEnd = (function() {
            var transEndEventNames = {
                WebkitTransition: 'webkitTransitionEnd',
                MozTransition: 'transitionend',
                OTransition: 'oTransitionEnd otransitionend',
                transition: 'transitionend'
            }
            for (var name in transEndEventNames) {
                if (typeof(document.body || document.documentElement).style[name] === "string") {
                    return transEndEventNames[name]
                }
            }
        })();
        var addClass = function(el) {
            el.classList.add('on');
            [].forEach.call(Allpay.util.siblings(el), function(el) {
                el.classList.remove('on');
            });
        };
        var addTransform = function(index) {
            $wrapper.style.transform = 'translate3d(-' + self.elWidth * index + 'px, 0, 0)';
            $wrapper.style.transitionDuration = self.autoTime - 500 + 'ms';
            if (self.slides[index]) {
                addClass(self.slides[index]);
                addClass(self.bullets[index]);
            }
        };
        var startAuto = function() {
            self.auto && (timer = setInterval(function() {
                if (i < slidesCount - 1) {
                    addTransform(i);
                    i++;
                } else if (i === slidesCount - 1) {
                    addTransform(i);
                    i = 0;
                }
            }, self.autoTime));
        };
        $wrapper.addEventListener(transitionEnd, function(e) {
            $wrapper.style.transitionDuration = '0ms';
        }, false);
        $wrapper.addEventListener('touchstart', function() {
            clearInterval(timer);
        }, false);
        $wrapper.addEventListener('drag', function(e) {
            if (dx < 0 && i === slidesCount - 1) return;
            dx = e.detail.x;
            $wrapper.style.transform = 'translate3d(-' + (self.elWidth * i + dx) + 'px, 0, 0)';
            $wrapper.style.transitionDuration = '0ms';
        }, false);
        $wrapper.addEventListener('touchend', function() {
            var half = Math.abs(dx) > self.elWidth / 2;
            if (half) {
                if (dx < 0 && i < slidesCount - 1) {
                    addTransform(i + 1);
                    i = i + 1;
                }
                if (dx > 0 && i > 0) {
                    addTransform(i - 1);
                    i = i - 1;
                }
            } else {
                addTransform(i);
            }
            dx = 0;
            startAuto();
        }, false);
        eventBus.subscribe('slideTo', function(index) {
            i = index;
            addTransform(index);
        });
        timer && clearInterval(timer);
        startAuto();
    };

    slide.prototype.slideTo = function(index) {
        eventBus.update('slideTo', index);
    };

    return slide;
});