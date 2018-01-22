define(['text!../html/qrcodeBtn.html'], function(html) {
	var qrcodeModel = Backbone.Model.extend({
		defaults: {
			status: "online",
			did: 1,
			current: "now"
		}
	});

	var qrcodeView = Backbone.View.extend({
		el: "#views",
		template: _.template(html),
		events: {
			"click .mask": "mask",
			"click .now_qrcode_btn" : "f"
		},

		initialize: function() {
			//console.log(this.model.toJSON())
			//this.f();
			App.closeToast();
			this.$el.html(this.template(this.model.toJSON()));
		},
		
		f:function(){
			a();
		},

		mask: function() {
			$(".mask a").addClass("active")
		}
	});

	var controller = function() {
		var Model = new qrcodeModel();
		var View = new qrcodeView({
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
