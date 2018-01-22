define(['text!../html/recordMoney.html', 'iscroll'], function(html) {
	var recordModel = Backbone.Model.extend({});

	var recordView = Backbone.View.extend({
		el: "#views",
		recordMoney: null,
		myScroll: null,
		balse: false,
		i: 1,
		template: _.template(html),


		initialize: function() {
			this.recordMoney = JSON.parse(window.localStorage.getItem("MontyRecord"));
			this.render();
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()))
			this.createLi(this.recordMoney)
			this.Scroll();
		},

		createLi: function(data) {
			var time = "";
			var money = "";

			for (var i = 0; i < data.length; i++) {
				time += "<li>" + data[i].createTime.replace(/-/g, '.') + "</li>";
				money += "<li>" + data[i].money + "元</li>";
			}
			$(".oul1").append(time)
			$(".oul2").append(money)
console.log(money)
			if ($(".oul1 li").length < 11) {
				$(".downTip").css("display", "none");
				this.balse = false;
			} else {
				$(".downTip").css("display", "block");
				this.balse = true;
			}
		},

		Scroll: function() {
			var _this = this;
			var pullupoffset = $(".downTip").offset().height;
			document.addEventListener('touchmove', function(e) {
				e.preventDefault();
			}, false);

			var down = false;
			this.myScroll = new IScroll('#record_data', {
				hScrollbar: false,
				vScrollbar: false,
				onScrollMove: function() {
					if (this.y < (this.maxScrollY - 80)) {
						$(".downTip").html("松手开始更新...")
						down = true;
					} else if (this.y > (this.maxScrollY + 100)) {
						$(".downTip").html("上拉加载更多...")
						down = false;
					}
				},

				onScrollEnd: function() {
					var that = this;
					if (down && _this.balse) {
						down = false;
						$(".downTip").html("上拉加载更多...")
						var index = _this.i += 1;
						$.ajax({
							url: App.BaseUrl + "api/client/getDepositList",
							async: true,
							type: "post",
							data: {
								"clientId": window.localStorage.getItem("clientId"),
								"page": parseInt(index)
							},
							success: function(data) {
								if (data.responseCode == 200) {
									_this.createLi(data.result);
									that.refresh();
								}
							}
						});
					}
				}
			})

		}
	});

	var controller = function() {
		var Model = new recordModel();
		var View = new recordView({
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