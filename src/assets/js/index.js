(function() {
    var router = new Allpay.Router();
    router.map({
        'index': function() {
            Allpay.use('../assets/pages/index/index.js');
        },
        'search': function() {
            Allpay.use('../assets/pages/search/index.js');
        }
    });
    setTimeout(function() {
        window.location.hash = 'index';
    }, 1000);
})();