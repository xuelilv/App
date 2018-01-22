define(['text!../html/setProfile.html'], function(html) {
	var setProfileModel = Backbone.Model.extend({});

	var setProfileView = Backbone.View.extend({
		el: "#views",
		template: _.template(html),
		events: {
			"click .save_btn a": "reset"
		},

		initialize: function() {
			var userData = JSON.parse(window.localStorage.getItem("userData"));
			console.log(userData.address);
			this.model.set({
				address: (userData.address.length > 6) ? (userData.address.substr(0,5)+"...") : (userData.address),
				mobile: userData.mobile,
				email: userData.email,
				familySize: userData.familySize,
				name: userData.name,
				sex: userData.sex,
				district:userData.district,
				province:userData.province,
				city:userData.city
			});
			this.render();
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
		},

		reset: function() {
			Backbone.history.navigate('userProfile', {
				trigger: true
			});
		}
	});

	var controller = function() {
		var Model = new setProfileModel();
		var View = new setProfileView({
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