define(['text!../html/userHelp.html'], function(html) {
	var userHelpModel = Backbone.Model.extend({});

	var userHelpView = Backbone.View.extend({
		el: "#views",
		template: _.template(html),

		initialize: function() {
			App.closeToast();
			this.$el.html(this.template(this.model.toJSON()));
		},

	})


	var controller = function() {
		var Model = new userHelpModel();
		var View = new userHelpView({
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