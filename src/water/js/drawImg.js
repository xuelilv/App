define(function() {
	function showImg() {}

	showImg.prototype = {
		m: 0,
		hd: 0,
		loadImg: function(obj, img, x, y, w, h, limit, balse) {
			var image = new Image();
			var _this = this;
			_this.hd = h + y;
			image.src = img;
			if (image.complete) {
				_this.drawImage(obj, image, x, y, w, h, limit, balse);
			} else {
				image.onload = function() {
					_this.drawImage(obj, image, x, y, w, h, limit, balse);
				}
			}
		},

		drawImage: function(obj, img, x, y, w, h, limit, balse) {
			obj.drawImage(img, x, y, w, h)
			if (balse) {
				this.requestAnimate(obj, x, y, w, h, limit);
			}
		},

		dragImgdata: function(obj, x, y, w, h) {
			this.m++;
			var imgData = obj.getImageData(x, this.hd, w, this.m);
			for (var i = 0, n = imgData.data.length; i < n; i += 4) {
				imgData.data[i] = 255;
				imgData.data[i + 1] = 255;
				imgData.data[i + 2] = 255;
				imgData.data[i + 3] = 0;
			}
			obj.putImageData(imgData, x, this.hd--);
		},

		requestAnimate: function(obj, x, y, w, h, limit) {
			var _this = this;
			requestAnimationFrame(function() {
				_this.dragImgdata(obj, x, y, w, h);
				if (_this.m < limit) {
					requestAnimationFrame(arguments.callee);
				}
			})
		}
	};

	return {
		init: function(waterNum) {
			var arc = document.getElementById("arc");
			var arc2 = document.getElementById("arc2");
			var content = arc.getContext("2d");
			var content2 = arc2.getContext("2d");

			arc.width = arc2.width = $(".water_img").width();
			arc.height = arc2.height = $(".water_img").height();

			content.fillStyle = "rgba(255,255,255,0)";
			content.fillRect(0,0,arc.width,arc.height);
			content2.fillStyle = "rgba(255,255,255,0)";
			content2.fillRect(0,0,arc.width,arc.height);

			if(parseInt(waterNum) > 1.5){
				waterNum == 1.5;
			}
			var show = new showImg();
			var limit = (waterNum / 1.5) * (arc.height / 1.2);
			show.loadImg(content, "./images/man_icon_2.png", arc.width / 4, arc.height / 6.5, arc.width / 1.8, arc.height / 1.2, limit, true)
			show.loadImg(content2, "./images/man_icon_1.png", arc.width / 4, arc.height / 6.5, arc.width / 1.8, arc.height / 1.2, limit, false)
		}
	}
});