define(function() {
    var loading = $("#DialogLoading"),
        ContentLoading = $("#ContentLoading"),
        isLoading = true;
    var router = null;
    window.App = {
        Views: {},
        Models: {},
        Controls: {},
        Collections: {},
        OneAnimate: true,
        BaseUrl: '/wechat/',///wechat/
        Util: new Common.Util(),
        Dialog: new MyDialog,
        ClientWidth:$("body").width(),
        ClientHeight:$("body").height(),
        getClientId: function() {
            var clientId = this.Util.getURLQuery()["clientId"];
            if (clientId !== null) {
                return clientId;
            }
        },
        showToast: function(opacity) {
            $("#MaskLoading").css("opacity", opacity);
            loading.show();
        },
        showDia: function(calssName, c) {
            this.Dialog.dialog("confirm", {
                class: calssName,
                content: c
            });
        },
        closeToast: function() {
            loading.hide();
        },
        initialize: function() {
            router = new App.Controls.Routes();
            router.on("route", function(route, params) {
                require([route], function(controller) {
                    if (router.currentController != undefined) {
                        if (router.currentController.controller !== controller.controller) {
                            router.currentController.controller.onRouteChange && router.currentController.controller.onRouteChange();
                        }
                    }
                    router.currentController = controller;
                    controller.controller.apply(null, params);
                })
            });
            Backbone.history.start();
        }
    };
    Backbone.emulateHTTP = true;
    Backbone.emulateJSON = true;
    Backbone.ajax = function() {
        var args = Array.prototype.slice.call(arguments, 0);
        if(args[0]['type'] == "GET"){
            args[0]['type'] = "POST";
            args[0]['data'] = {'clientId':App.getClientId()};
        }
        return Backbone.$.ajax.apply(Backbone.$, args);
    };
    App.Controls.Routes = Backbone.Router.extend({
        routes: {
            'noBind': 'noBind',
            'control': 'index',
            'list': 'list',
            'detail': 'detail',
            'health': 'health',
            'personal': "personalCenter",
            'history': "historyRecord",
            'userProfile': "userProfile",
            'setProfile': "setProfile",
            'firstRecharge': "firstRecharge",
            "reSuccess": "reSuccess",
            "autoEnter": "autoEnter",
            "qrcodeBtn": "qrcodeBtn",
            "setName": "setName",
            "recordMoney": "recordMoney",
            "service": "service",
            "userHelp": "userHelp"
        },
        execute: function(callback, args) {
            if (isLoading) {
                App.showToast(1);
            }
            if (callback) callback.apply(this, args);
        },
        noBind: function() {
            isLoading = false;
            require(['noBind'], function() {

            });
        },
        index: function() {
            isLoading = true;
        },
        list: function() {
            isLoading = true;
        },
        detail: function() {
            isLoading = true;
        },
        health: function() {
            isLoading = true;
        },
        personalCenter: function() {
            isLoading = false;
        },
        historyRecord: function() {
            isLoading = true;
        },
        userProfile: function() {
            isLoading = false;
        },
        setProfile: function() {
            isLoading = false;
        },
        firstRecharge: function() {
            isLoading = false;
        },
        reSuccess: function() {
            isLoading = false;
        },
        autoEnter: function() {
            isLoading = false;
        },
        qrcodeBtn: function() {
            isLoading = false;
        },
        setName: function() {
            isLoading = false;
        },
        recordMoney: function() {
            isLoading = false;
        },
        service: function() {
            isLoading = false;
        },
        userHelp: function() {
            isLoading = false;
        }
    });
    $(function(){
        App.initialize();//初始化APP
    });
});