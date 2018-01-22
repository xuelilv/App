define(['text!../html/reSuccess.html','personalCenter'], function(html,obj) {

	var reSuccessModel = Backbone.Model.extend({});

	var reSuccessView = Backbone.View.extend({
		el: "#views",
		template: _.template(html),
		overMoney : 0,
		events: {
			"click .mask": "mask",
			"click .type_btn": "typeMoney",
			"click .reCharge_record": "reChargeHistory"
		},

		initialize: function() {
			var _this = this;
			var liWidth = (App.ClientWidth - App.ClientWidth*0.1)/3;
			var cirWidth = liWidth * 0.85;
			this.model.set({
				'liWidth':liWidth,
				'cirWidth':cirWidth
			});
			$.ajax({
				url: App.BaseUrl+"api/getBalance",
				async: true,
				type: "post",
				data: {
					"clientId": window.localStorage.getItem("clientId")
				},
				success: function(data) {
					if (data.responseCode == 200) {
						_this.model.set({
							balance:data.result
						});
						_this.render();
					}
				}
			});
		},

		render: function() {
			var self = this;
			this.$el.html(this.template(this.model.toJSON()));
			var alertMask = JSON.parse(window.localStorage.getItem("alertMask"));

			if(alertMask){
				$(".mask").removeClass("hide");
				$(".mask").find(".mask_tip").addClass("active");
				window.localStorage.setItem("alertMask",false);
				setTimeout(function(){
					self.mask();
				}, 1000);
			}else{
				this.mask();
			}
		},

		mask: function() {
			$(".mask").addClass("hide");
			$(".mask").find(".mask_tip").removeClass("active")
		},

		typeMoney: function(ev) {
			var money = parseInt(ev.srcElement.innerText);

			if (!isNaN(money)) {
				window.localStorage.setItem("money", money);
			} else {
				window.localStorage.setItem("money", 0);
			}
			Backbone.history.navigate("autoEnter", {
				trigger: true,
				repalce: true
			})
		},

		reChargeHistory: function() {
			$.ajax({
				url: App.BaseUrl+"api/client/getDepositList",
				async: true,
				type: "post",
				data: {
					"clientId": window.localStorage.getItem("clientId"),
					"page": 1
				},
				success: function(data) {
					if (data.responseCode == 200) {
						window.localStorage.setItem("MontyRecord", JSON.stringify(data.result));
						Backbone.history.navigate("recordMoney", {
							trigger: true,
							repalce: true
						})
					}
				}
			});
		}
	});

	var controller = function() {
		var Model = new reSuccessModel();
		var View = new reSuccessView({
			model: Model
		});

		controller.onRouteChange = function() {
			View.undelegateEvents();
		}
	};

	return {
		controller: controller
	}
});



