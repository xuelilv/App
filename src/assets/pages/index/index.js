Allpay.cssLoad('./assets/component/slide/slide.css');
Allpay.cssLoad('./assets/pages/index/index.css');
Allpay.define(['../assets/pages/index/index.html', '../assets/component/slide/slide.js'], function(res, Slide) {
    return function() {
        Allpay.Page({
            el: '#contain',
            template: res
        });
        var mySlide = new Slide({
            el: '.slide-contain',
            time: 1500,
            auto: true
        });

    }();
});