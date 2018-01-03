Allpay.cssLoad('./assets/pages/index/index.css');
Allpay.define(['../assets/pages/index/index.html'], function(res) {
    Allpay.Page({
        el: '#contain',
        template: res
    });
    // var $search = document.querySelector('.search');
    // $search.addEventListener('touchstart', function(e) {
    //     window.location.hash = 'search';
    // }, false);
});