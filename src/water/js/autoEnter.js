define(['text!../html/autoEnter.html'], function(html) {
	var autoEnterModel = Backbone.Model.extend({});

	var autoEnterView = Backbone.View.extend({
		el: "#views",
		template: _.template(html),
		events: {
			"click .save_btn": "upMoney"
		},

		initialize: function() {
			this.$el.html(this.template(this.model.toJSON()));
			$(".inputMoney").val(window.localStorage.getItem("money"))
		},

		upMoney: function() {
			var pattern = /^\d+(\.\d{1,1})?$/;
			var money = $(".inputMoney").val();
		
			/*if(money.indexOf(".") > 0 || money == 0){
				return;
			}else{
				money = parseInt(money);
			}*/
			console.log(pattern.test(money));
			if(!pattern.test(money) || money==0 || money.length>6){
				App.showDia("alertDia animated bounceIn", "输入金额格式不正确");
				return false;
			}
			App.showToast(0.5);
			$.ajax({
				url: App.BaseUrl + "api/client/unifiedorder",
				async: true,
				type: "post",
				data: {
					"clientId": window.localStorage.getItem("clientId"),
					"money": money
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
						if(data.appId){
							WeixinJSBridge.invoke('getBrandWCPayRequest', data,
							       	function(res){
										App.closeToast(0.5)
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
				}
			})
		}
	});

	var controller = function() {
		var Model = new autoEnterModel();
		var View = new autoEnterView({
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