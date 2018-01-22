var libPath = '../lib/';
requirejs.config({
    baseUrl:'./js',
    paths: {
        app:'../config/app',
        text:'../lib/text.min'
    },
	deps:['app']
});

