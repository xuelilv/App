define(['text!../html/personalCenter.html', 'drawImg'], function(html, drawImg) {
    var data = null;
    App.Models.personalModel = Backbone.Model.extend({
        url: App.BaseUrl + "api/client/personCenter"
    });
    data = new App.Models.personalModel;
    var personalCenterView = Backbone.View.extend({
        el: "#views",
        template: _.template(html),

        initialize: function() {
            var _this = this;
            App.closeToast();
            _this.render();
            // this.model.fetch({
            //     success: function() {
            //         App.closeToast();
            //         _this.render();
            //     }
            // });
        },

        render: function() {
            var toJSONdata = { dayWater: 1, isImprove: true, clientMsg: { name: '学立' }, balance: 200 };
            var userDataStr = JSON.stringify(toJSONdata.clientMsg);
            console.log(toJSONdata)
            this.$el.html(this.template(toJSONdata));
            drawImg.init(1);
            window.localStorage.setItem("userData", userDataStr);
            window.localStorage.setItem("clientId", toJSONdata.clientMsg.id);
        },

        history: function() {
            Backbone.history.navigate('history', {
                trigger: true,
                replace: false
            });
        },

        message: function() {
            if (this.model.get("isImprove")) {
                Backbone.history.navigate('userProfile', {
                    trigger: true
                });
            } else {
                Backbone.history.navigate('setProfile', {
                    trigger: true
                });
            }
        },

        overMoney: function() { //余额
            this.rechargeCode = this.model.get("isFirstDeposit");
            this.firstRecharge();
        },

        firstRecharge: function() { //第一次充值
            if (this.rechargeCode) {
                window.localStorage.setItem("alertMask", true);
                Backbone.history.navigate('firstRecharge', {
                    trigger: true
                });
            } else {
                window.localStorage.setItem("alertMask", false);
                Backbone.history.navigate('reSuccess', {
                    trigger: true
                });
            }
        }
    });

    var controller = function() {
        var View = new personalCenterView({
            model: data
        });
        controller.onRouteChange = function() {
            View.undelegateEvents();
        }
    };
    return {
        controller: controller,
        'balance': data
    }
});