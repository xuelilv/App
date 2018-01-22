define(function() {
	function chartDraw(xTime, data) {
		Chart1 = new Highcharts.Chart({
			chart: {
				renderTo: document.getElementById("chartDraw"),
				backgroundColor: null
			},
			title: { //标题
				text: ''
			},
			subtitle: { //副标题
				text: ''
			},
			xAxis: {
				categories: xTime,
				tickLength: 0, //x轴向下直线
				labels: {
					style: {
						color: 'white',
						fontSize: '1.1rem'
					}
				}
			},
			yAxis: {
				title: {
					text: ''
				},
				labels: {
					style: {
						color: 'white'
					}
				}
			},
			tooltip: { //提示框
				backgroundColor: 'white',
				borderColor: null,
				borderRadius: 5,
				formatter: function() { //自定义提示框
					return this.y + "L"
				},
				style: {
					padding: 10,
					color: '#0078c7',
					fontWeight: 'bold'
				}
			},
			legend: { //x轴下的标题
				enabled: false
			},
			credits: { //隐藏highchart文字
				enabled: false
			},
			colors: ['#ffffff'],
			series: [{
				data: data
			}]
		});
	}

	return {
		init: function(xTime,data) {
			chartDraw(xTime,data)
		},

		getDates: function() {
			var time = new Date();
			var yyy = time.getFullYear();
			var mm = time.getMonth();
			var dd = time.getDate();
			var xTime = [];

			if (dd > 7 || dd == 7) { //获取前七天
				for (var i = 1; i < 8; i++) {
					xTime.push(dd - (7 - i) + "");
				}
			} else {
				var dates = new Date(yyy, mm, 0).getDate(); //获取跨月的七天
				var ds = 7 - dd;
				for (var k = 0; k < ds; k++) {
					xTime.push(dates - (ds - k) + 1 + "");
				}
				var timeLength = 7 - xTime.length;
				for (var j = 0; j < timeLength; j++) {
					xTime.push(j + 1 + "");
				}
			}
			return xTime;
		}
	}
});