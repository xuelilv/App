(function() {
    var router = new Allpay.Router();
    router.map({
        'index': function() {
            Allpay.http.get('./assets/pages/index/index.html', function(res) {
                Allpay.use('../assets/pages/index/index.css');
                Allpay.Page({
                    el: '#contain',
                    template: res
                });
            });
        }
    });
    setTimeout(function() {
        window.location.hash = 'index';
    }, 1000);
})();