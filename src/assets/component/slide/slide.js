Allpay.define(function() {
    var slide = function(options) {
        if(!options.el) return;
        var self = this;
        this.el = document.querySelector(options.el);
        this.elWidth = Allpay.util.getStyles(this.el, 'width');
        this.elHeight = Allpay.util.getStyles(this.el, 'height');
        this.slides = this.el.querySelectorAll('.slide-item');
        [].forEach.call(this.slides, function(el) {
            el.style.width = self.elWidth+'px';
        });
    };

    return slide;
});