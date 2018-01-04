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
            i = 1,
            timer,
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
        $wrapper.addEventListener(transitionEnd, function(e) {
            $wrapper.style.transitionDuration = '0ms';
        }, false);
        eventBus.subscribe('slideTo', function(index) {
            i = index;
            addTransform(index);
        });
        timer && clearInterval(timer);
        this.auto && (timer = setInterval(function() {
            if (i < slidesCount) {
                addTransform(i);
                i++;
            } else if (i === slidesCount) {
                i = 0;
            }
        }, this.autoTime));
    };

    slide.prototype.slideTo = function(index) {
        eventBus.update('slideTo', index);
    };

    return slide;
});