(function() {
    var router = new Allpay.Router();
    router.map({
        'index': function() {
            Allpay.use('../assets/pages/index/index.js', function(fn) {
                fn();
            });
        },
        'search': function() {
            Allpay.use('../assets/pages/search/index.js', function(fn) {
                fn();
            });
        }
    });
    setTimeout(function() {
        window.location.hash = 'index';
    }, 1000);
})();