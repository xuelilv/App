define(['text!../html/detail.html'], function(tpl) {
	var DetailModel = Backbone.Model.extend();

    App.Views.Detail = Backbone.View.extend({
        model: new DetailModel,
        el: '#views',
        events: {
            "tap .del": "del",
            "change #name":"changeTxt"
        },
        json:null,
        template: _.template(tpl),
        initialize: function() {
        	this.model.set(App.selectedDevice);
        	this.model.set("clientHieght",App.ClientHeight);
            var json = this.model.toJSON();
            this.json = json;
            this.DeviceID = json.id;
            App.closeToast();
            this.$el.html(this.template(json));
        },
        isValid:function(text){
        	var re = /^[^`~!@#$%^&*()+=|\\\][\]\{\}:;'\,.<>/?]{1}[^`~!@$%^&()+=|\\\][\]\{\}:;'\,.<>?]{0,19}$/gi;
        	if(text == ""){
        		App.showDia("alertDia animated bounceIn", "名称不能为空！");
        		return false;
        	}else if(!re.test(text)){
        		App.showDia("alertDia animated bounceIn", "名称不能包含特殊字符！");
        		return false;
        	}else if(this.getByteLen(text)>12){
        		App.showDia("alertDia animated bounceIn", "名称不超过6个字12个英文！");
        		return false;
        	}else{
        		return true;
        	}
        },
        changeTxt:function(e){
        	var val = e.target.value;
        	var name = this.json.name;
        	console.log(val+"="+name+","+name.length);
        	if(!this.isValid(val)){
        		return false;
        	}else{
            	if(name !== val){
                    $.ajax({
                        url: App.BaseUrl + 'api/editPurification',
                        type: 'POST',
                        data: {
                        	'clientId':App.getClientId(),
                        	'name':val,
                        	'purifierId': this.DeviceID
                        },
                        success: function(res) {
                            if (res.responseCode == "200") {
                            	App.showDia("alertDia animated bounceIn", "修改成功！");
                            }
                        }
                    });
            	}
        	}

        },
        
        getByteLen: function(val) {
            var len = 0;
            for (var i = 0; i < val.length; i++) {
                 var a = val.charAt(i);
                 if (a.match(/[^\x00-\xff]/ig) != null) 
                {
                    len += 2;
                }
                else
                {
                    len += 1;
                }
            }
            return len;
        },
        
        del: function() {
            var _this = this;
            App.Dialog.dialog("confirm", {
                title: "温馨提示",
                content: "确定要删除该设备吗？",
                btn: ["取消", "确定"],
                callback: function(index) {
                    if (index == 0) {
                        $("#contentWrap").addClass("bounceOut");
                    } else if (index == 1) {
                        _this.delReq();
                    }
                }
            });
        },
        delReq: function() {
            var _this = this;
            $.ajax({
                url: App.BaseUrl + 'api/delPurification',
                type: 'POST',
                data: {
                	"clientId":App.getClientId(),
                    "purifierId": _this.DeviceID
                },
                success: function(res) {
                	//console.log(res);
                    if (res.responseCode == "200") {
                        $("#contentWrap").addClass("bounceOut");
                        res.has == 'y' ? 
                        Backbone.history.navigate("list", {
                            trigger: true,
                            replace: false
                        }) : Backbone.history.navigate("noBind", {
                            trigger: true,
                            replace: false
                        });
                        //WeixinJSBridge.call('closeWindow');
                    }else{
                    	App.showDia("alertDia animated bounceIn", res.responseMessage);
                    }
                }
            });
        }
    });

    var controller = function() {
        var View = new App.Views.Detail();
        controller.onRouteChange = function() {
            View.undelegateEvents();
        }
    };
    return {
        controller: controller
    }
});