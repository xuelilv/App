(function() {
    var router = new Allpay.Router();
    router.map({
        'index': function() {
            Allpay.use('../assets/pages/index/index.js');
        },
        'search': function() {
            Allpay.use('../assets/pages/search/index.js');
        },
        'chart': function() {
            Allpay.use(['../assets/lib/SVG/svg.js', '../assets/pages/chart/index.js']);
        }
    });
})();