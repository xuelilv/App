define(['text!../html/list.html'], function(tpl) {
    var loc = window.localStorage,
        oldPurifierId = "";

    App.Models.List = Backbone.Model.extend({

    });
    App.Collections.DeviceList = Backbone.Collection.extend({
        model: App.Models.List,
        url: App.BaseUrl + 'api/getPurificationList'
    });
    App.selectedDevice = null;
    var DeviceList = new App.Collections.DeviceList;
    var DeviceView = Backbone.View.extend({
        tagName: 'li',
        className: 'device',
        template: _.template(tpl),
        events: {
            "tap .selectImg": "edit",
            "tap .edit_icon":"toEdit",
            "tap .btn":"toEdit"
        },
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.isUse();
            return this;
        },
        toEdit:function(e){
        	App.selectedDevice = this.model.toJSON();
            Backbone.history.navigate("detail", {
                trigger: true,
                replace: false
            });
            e.preventDefault();
        },
        choiceDevice: function(old, curr) {
            var _this = this;
            if (old !== curr) {
                $.ajax({
                    url: App.BaseUrl + 'api/choicePurification',
                    type: 'POST',
                    data: {
                    	clientId:App.getClientId(),
                        purifierId: curr
                    },
                    success: function(res) {
                        if (res.responseCode == 200) {
                            _this.$(".selectImg").addClass("selected");
                            _this.$el.siblings().find(".selectImg").removeClass("selected");
                            Backbone.history.navigate("control", {
                                trigger: true,
                                replace: true
                            });
                            oldPurifierId = curr;
                        }

                    }
                });
            }
        },
        isUse: function() {
            var isUse = this.model.get("isUse"),
                id = this.model.get("id");
            if (isUse == "y") {
                oldPurifierId = id;
            }
        },
        edit: function(e) {
            var id = this.$el.find(".view").attr("id");
            if (oldPurifierId !== undefined && id !== null) {
                this.choiceDevice(oldPurifierId, id);
            }
            e.preventDefault();
        }
    });
    App.Views.List = Backbone.View.extend({
        tagName: 'ul',
        id: 'devices',
        cou: 0,
        initialize: function() {
            this.listenTo(DeviceList, 'reset', this.addAll);
            var temp = loc.getItem("list");
            //if (temp !== null) {
            //    DeviceList.reset(JSON.parse(temp).result);
            //    App.closeToast();
           // } else {
                DeviceList.fetch({
                    success: function(m) {
                        DeviceList.reset(m.toJSON()[0].result);
                        App.closeToast();
                    }
                });
            //}
        },
        render: function() {
            $("#views").html(this.$el);
            return this;
        },
        addAll: function() {
            if (DeviceList.length > 0) {
                DeviceList.each(this.addDevice, this);
            }
        },
        addDevice: function(device, list) {
            var Device = new DeviceView({
                model: device
            });
            this.$el.append(Device.render().el);
            this.cou++;
            if (this.cou >= list) {
                this.render();
            }
        }
    });

    var controller = function() {
        var View = new App.Views.List();
        controller.onRouteChange = function() {
            View.undelegateEvents();
        }
    };
    return {
        controller: controller
    }
});