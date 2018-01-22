define(['text!../html/firstRecharge.html'], function(html) {
	var firstRechargeModel = Backbone.Model.extend({});

	var firstRechargeView = Backbone.View.extend({
		el: "#views",
		template: _.template(html),
		events: {
			"click .now_Recharge": "rechargeMoney"
		},

		initialize: function() {
			this.$el.html(this.template(this.model.toJSON()));
		},

		rechargeMoney: function() {
			App.showToast(0.5);
			$.ajax({
				url: App.BaseUrl + "api/client/unifiedorder",
				async: true,
				type: "post",
				data: {
					"clientId": window.localStorage.getItem("clientId"),
					"money": "0.2"
				},
				success: function(data) {
					window.localStorage.setItem("alertMask",false);
					if(data.responseCode=="400"){
						App.showDia("alertDia animated bounceIn", data.responseMessage);
						App.closeToast(0.5);
						Backbone.history.navigate('reSuccess', {
							trigger: true,
							replace: true
						});
					}else{
						WeixinJSBridge.invoke('getBrandWCPayRequest', data,
								function(res){
									App.closeToast(0.5);
						           	if(res.err_msg == "get_brand_wcpay_request:ok") {
						           		window.localStorage.setItem("alertMask",true);
						           		Backbone.history.navigate('reSuccess', {
											trigger: true,
											replace: true
										});
						           	}else if(res.err_msg == "get_brand_wcpay_request：cancel"){
						           		Backbone.history.navigate('reSuccess', {
											trigger: true,
											replace: true
										});
						           	}else{
						           		Backbone.history.navigate('reSuccess', {
											trigger: true,
											replace: true
										});
						           	}
				       			}
						   );
					}
				}
			})

		}
	});

	var controller = function() {
		var Model = new firstRechargeModel();
		var View = new firstRechargeView({
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