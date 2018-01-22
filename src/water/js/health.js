define(['text!../html/filterHealth.html','index'], function(tpl,obj) {
    App.Models.Health = Backbone.Model.extend({
       
    });
    App.Views.Health = Backbone.View.extend({
        model: new App.Models.Health,
        el: '#views',
        template: _.template(tpl),
        choose: null,
        explanationArr: [],
        warn: "",
        initialize: function() {
        	var _this = this;
            $.ajax({
                url: App.BaseUrl + 'api/filter/getFilterList',
                type: 'POST',
                data:{'purifierId':obj.data.toJSON().id},
                success: function(res) {
                    if (res !== null) {
                    	console.log(res);
                    	_this.model.set(res);
                        _this.render();
                        App.closeToast();
                    }
                }
            });
        },
        getJSON: function() {
            return this.model.toJSON();
        },
        temp: function() {
            this.$el.html(this.template(this.getJSON()));
            this.filterEl = $(".filter");
            this.healthState = $(".healthState");
            this.setElHeight();
            this.filter();
            this.reset();
            this.setHealthState();
            this.dialog();
        },
        render: function() {
            var list = this.getJSON().result;
            var _this = this;
            if (list.length > 0) {
                this.temp();
                _.each(list, function(v) {
                    _this.explanationArr.push(v.explanation);
                });
            }
        },
        setHealthState: function() {
            var _this = this;
            this.filterEl.each(function(i, v) {
                var warn = v.getAttribute("data-warn");
                if (warn == "true") {
                    _this.warn += i + 1 + "、";
                }
            });
            if (this.warn !== "") {
                this.healthState.text("请更换" + this.warn.substring(0, this.warn.length - 1) + "号滤芯").addClass("warn");
            } else {
                this.healthState.text("滤芯健康状态").removeClass("warn");
            }
        },
        setElHeight: function() {
            var bodyH = parseInt(document.body.clientHeight, 10);
            var h = 0;
            if (bodyH <= 480) {
                h = bodyH * 0.3;
            } else {
                h = bodyH * 0.4;
            }
            $(".item").css("height", h + "px");
        },
        filter: function() {
            var _this = this;
            var explanationTit = $("#explanationTit");
            var explanationTxt = $("#explanationTxt");
            var total = $("#total");
            this.filterEl.on("tap", function(e) {
                var num = Number($(this).find(".numPosition").html());
                _this.choose = num;
                _this.chooseId = $(this).attr("id");
                $(this).find(".item").addClass("boxShadow");
                $(this).siblings().find(".item").removeClass("boxShadow");
                explanationTit.text(num + "号滤芯：");
                total.text($(this).attr("data-tot"));
                explanationTxt.text(_this.explanationArr[num - 1]);
                e.preventDefault();
            });
        },
        reset: function() {
            var _this = this;
            $("#resetBtn").on("tap", function(e) {
                if (_this.choose == null) {
                    App.showDia("alertDia animated bounceIn", "请选择滤芯！");
                } else {
                    var isWarn = $(".item" + _this.choose).parent().attr("data-warn");
                    if (isWarn == "true") {
                        $(".lineOne").find("span").text(_this.choose);
                        //$("#popUpBg").show();
                        App.Dialog.dialog("confirm", {
                            class: "confirmDia animated bounceIn",
                            content: "确认要重置" + _this.choose+"号滤芯吗？<br/>"+"可将净水量回复到100%。",
                            btn:["取消","确定"],
                            callback:function(id){
                            	//alert(id);
                            	if(id == 0){
                            		$("#DialogConfirm").hide();
                            	}else if(id == 1){
                                    $.ajax({
                                        url: App.BaseUrl + 'api/filter/reSetFilter',
                                        type: 'POST',
                                        data: {
                                        	"purifierId":obj.data.toJSON().id,
                                            "filterNum": _this.choose
                                        },
                                        success: function(res) {
                                            if (res.responseCode == '200') {
                                            	var itemEl = $(".item" + _this.choose);
                                            	var totPul = itemEl.parent().attr("data-tot");
                                            	itemEl.find(".itemSpan").css("height", "100%");
                                            	itemEl.next().find(".volumeNum").text(totPul+"L").find(".volumePer").text("(100%)");
                                                $("#DialogConfirm").hide();
                                            } else {
                                            	App.showDia("alertDia animated bounceIn", res.responseMessage);
                                            }
                                        }
                                    });
                            	}
                            }
                        });
                    } else if (isWarn == "false") {
                        App.showDia("alertDia animated bounceIn", "滤芯状况良好，不需要重置！");
                    }
                }
                e.preventDefault();
            });
        },
        dialog: function() {
            var _this = this;
            $(".sureBtn").on("tap", function(e) {
                $.ajax({
                    url: App.BaseUrl + 'api/filter/getFilter',
                    type: 'POST',
                    data: {
                        "filterId": _this.choose
                    },
                    success: function(res) {
                        if (res.flag == 'succ') {
                            $(".item" + _this.choose).find(".itemSpan").css("height", "100%");
                            $("#popUpBg").hide();
                        }
                    }
                });
                e.preventDefault();
            });
            $(".cancelBtn").on("tap", function(e) {
                $("#popUpBg").hide();
                e.preventDefault();
            });
        }
    });

    var controller = function() {
        var View = new App.Views.Health();
        controller.onRouteChange = function() {
            View.undelegateEvents();
        }
    };
    return {
        controller: controller
    }
});
