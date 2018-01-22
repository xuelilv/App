Allpay.cssLoad('./assets/pages/search/index.css');
Allpay.define(['../assets/pages/search/index.html'], function(res) {
    return function() {
        Allpay.Page({
            el: '#contain',
            template: res
        });
    }();
});